import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { userModel} from '../../schemas/user.schema.js';
import { LecturerModel } from '../../schemas/lecturers.schema.js';
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
    id: user._id,  
    role,
    message: `${role} login successful`
  });
};

const lecturerLogin = async (lecturer, password, res) => {
  if (!lecturer.role) {
    return res.status(500).json({ message: 'Lecturer role is missing' });
  }
  if (lecturer.role !== 'lecturer') {
    return res.status(403).json({ message: 'Invalid lecturer role' });
  }
  if (lecturer.password === password) {
    return generateTokenAndResponse(lecturer, lecturer.role, res);
  }
  return res.status(401).json({ message: 'Invalid lecturer credentials' });
};

const studentLogin = async (student, password, res) => {
  if (!student.role) {
    return res.status(500).json({ message: 'Student role is missing' });
  }
  if (student.role !== 'student') {
    return res.status(403).json({ message: 'Invalid student role' });
  }
  if (await bcrypt.compare(password, student.password)) {
    return generateTokenAndResponse(student, student.role, res);
  }
  return res.status(401).json({ message: 'Invalid student credentials' });
};

export const loginRouteHandler = async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    // Admin login
    if (userId === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ id: userId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({ token, role: 'admin', message: 'Admin login successful' });
    }

    // Lecturer login
    const lecturer = await LecturerModel.findOne({ userId });
    if (lecturer) {
      return lecturerLogin(lecturer, password, res);
    }

    // Student login
    const student = await userModel.findOne({ userId });
    if (student) {
      return studentLogin(student, password, res);
    }

    return res.status(401).json({ message: 'Invalid general credentials' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const registerRouteHandler = async (req, res) => {
  const { 
    name, 
    userId, 
    email, 
    password, 
    course, 
    groupname, 
    isGroupLeader 
  } = req.body;


  // Check if user is trying to register with admin userId
  if (userId === process.env.ADMIN_ID) {
    return res.status(400).json({ message: "Admin cannot register through this route." });
  }

  // Check if user already exists
  const foundUser = await userModel.findOne({ userId });
  if (foundUser) {
      return res.status(400).json({ message: "userId is already in use" });
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

   // Students are the only ones being registered
const newUser = new userModel({
  name,
  email,
  userId,
  password: hashPassword,
  role: "student",
  course,
  groupname,
  isGroupLeader
});

console.log(newUser);
await newUser.save();

  // Generate JWT token
  const token = jwt.sign({ id: newUser._id, userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
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
