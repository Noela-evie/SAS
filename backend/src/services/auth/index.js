import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { userModel } from '../../schemas/user.schema.js';
import { doctorsModel } from '../../schemas/doctors.schema.js';
import { passwordResetModel } from '../../schemas/passwordResets.schema.js';
import dotenv from 'dotenv';
import randomToken from 'random-token';
import express from "express";


dotenv.config();

const app = express();
app.use(express.json());

const generateTokenAndResponse = (user, role, res) => {
  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return res.status(200).json({
    token,
    id: user._id,  // Include the user's ID here
    role,
    message: `${role} login successful`
  });
};

const doctorLogin = async (doctor, password, res) => {
  if (!doctor.role) {
    return res.status(500).json({ message: 'Doctor role is missing' });
  }
  if (doctor.role !== 'doctor') {
    return res.status(403).json({ message: 'Invalid doctor role' });
  }
  if (doctor.password === password) {
    return generateTokenAndResponse(doctor, doctor.role, res);
  }
  return res.status(401).json({ message: 'Invalid doctor credentials' });
};

const patientLogin = async (patient, password, res) => {
  if (!patient.role) {
    return res.status(500).json({ message: 'Patient role is missing' });
  }
  if (patient.role !== 'patient') {
    return res.status(403).json({ message: 'Invalid patient role' });
  }
  if (await bcrypt.compare(password, patient.password)) {
    return generateTokenAndResponse(patient, patient.role, res);
  }
  return res.status(401).json({ message: 'Invalid patient credentials' });
};

export const loginRouteHandler = async (req, res) => {
  console.log("Incoming Request:", req.body); 
  try {
    const { NIN, password } = req.body;
    
    // Admin login
    if (NIN === process.env.ADMIN_NIN && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ id: NIN, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({ token, role: 'admin', message: 'Admin login successful' });
    }

    // Doctor login
    const doctor = await doctorsModel.findOne({ NIN });
    if (doctor) {
      return doctorLogin(doctor, password, res);
    }

    // Patient login
    const patient = await userModel.findOne({ NIN });
    if (patient) {
      return patientLogin(patient, password, res);
    }

    return res.status(401).json({ message: 'Invalid general credentials' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const registerRouteHandler = async (req, res) => {
  const { name, NIN, email, password } = req.body;

  // Check if user is trying to register with admin NIN
  if (NIN === process.env.ADMIN_NIN) {
    return res.status(400).json({ message: "Admin cannot register through this route." });
  }

  // Check if user already exists
  const foundUser = await userModel.findOne({ NIN });
  if (foundUser) {
      return res.status(400).json({ message: "NIN is already in use" });
  }

  // Check if email exists
  const foundEmail = await userModel.findOne({ email });
  if (foundEmail) {
      return res.status(400).json({ message: "Email is already in use" });
  }

  console.log(req.body)
  // Check password length
  if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
  }

  // Hash password and save user with role assignment
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Patients are the only ones being registered
  const newUser = new userModel({ name, email, NIN, password: hashPassword, role: 'patient' }); 
  await newUser.save();

  // Generate JWT token
  const token = jwt.sign({ id: newUser._id, NIN }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return res.status(200).json({ token: token, message: 'Registration successful' });
};


export const forgotPasswordRouteHandler = async (req, res) => {
  const { email } = req.body;
  const foundUser = await userModel.findOne({ email });

  if (!foundUser) {
    return res.status(400).json({ errors: { email: ["The email does not match any existing user."] } });
  }

  const token = randomToken(20);
  // Send email with reset link (ensure you have transporter configured)
  await transporter.sendMail({
    from: "noelanalugwa@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Reset Password",
    html: `<p>You requested to change your password. If this request was not made by you, please contact us. Access <a href='${process.env.APP_URL_CLIENT}/auth/reset-password?token=${token}&email=${email}'>this link</a> to reset your password.</p>`,
  });

  await passwordResetModel.create({ email: foundUser.email, token, created_at: new Date() });
  return res.status(204).json({ data: "password-forgot", attributes: { redirect_url: `${process.env.APP_URL_API}/password-reset`, email } });
};

export const resetPasswordRouteHandler = async (req, res) => {
  const { email, password, password_confirmation } = req.body.data.attributes;
  const foundUser = await userModel.findOne({ email });

  if (!foundUser) {
    return res.status(400).json({ errors: { email: ["The email does not match any existing user."] } });
  }

  // Validate password
  if (password.length < 8) {
    return res.status(400).json({ errors: { password: ["The password should have at least 8 characters."] } });
  }

  if (password !== password_confirmation) {
    return res.status(400).json({ errors: { password: ["The password and password confirmation must match."] } });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  await passwordResetModel.deleteOne({ email: foundUser.email });
  await userModel.updateOne({ email: foundUser.email }, { $set: { password: hashPassword } });
  
  return res.sendStatus(204);
};
