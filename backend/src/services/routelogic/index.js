import { appointmentModel } from '../../schemas/appointments.schema.js';
import { eventModel } from '../../schemas/events.schema.js';
import { doctorsModel } from '../../schemas/doctors.schema.js';
import { userModel } from '../../schemas/user.schema.js';

// 1. Post an appointment
export const postAppointmentRouteHandler = async (req, res) => {
    try {
      const appointment = new appointmentModel(req.body);
      await appointment.save();
      res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 2. Get an appointment
  export const getAppointmentRouteHandler = async (req, res) => {
    try {
      const id = ("link unavailable");
      const appointment = await appointmentModel.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 3. Get all appointments for a given doctor or patient
export const getAppointmentsRouteHandler = async (req, res) => {
  try {
    const doctorId = req.query.doctor?._id;
    const patientId = req.query.user?._id;
    const appointments = await appointmentModel.find({
      $or: [{ doctor: doctorId }, { patient: patientId }],
    });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
  // 4. Get all appointments
  export const getAllAppointmentsRouteHandler = async (req, res) => {
    try {
      const appointments = await appointmentModel.find();
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 5. Post event
  export const postEventRouteHandler = async (req, res) => {
    try {
      const event = new eventModel(req.body);
      await event.save();
      res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 6. Get event for given doctor
  export const getEventRouteHandler = async (req, res) => {
    try {
      const doctorId = req.params.doctorId;
      const event = await eventModel.findOne({ doctor: doctorId });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 7. Get all events for a given doctor
  export const getEventsRouteHandler = async (req, res) => {
    try {
      const doctorId = req.query.doctorId;
      const events = await eventModel.find({ doctor: doctorId });
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 8. Delete event for a given doctor
  export const deleteEventRouteHandler = async (req, res) => {
    try {
      const eventId = req.params.eventId;
      await eventModel.findByIdAndDelete(eventId);
      res.status(204).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 9. Get all doctor data for profile
  export const getDoctorProfileRouteHandler = async (req, res) => {
    try {
      const doctorId = req.params.doctorId;
      const doctor = await doctorsModel.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
    // 10. Patch phone number to user schema
    export const patchUserPhoneRouteHandler = async (req, res) => {
    try {
    const userId = req.params.userId;
    const phone = req.body.phone;
    await userModel.updateOne({ _id: userId }, { $set: { phone } });
    res.status(200).json({ message: 'Phone number updated successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    // 11. Patch phone number to doctor schema
    export const patchDoctorPhoneRouteHandler = async (req, res) => {
    try {
    const doctorId = req.params.doctorId;
    const phone = req.body.phone;
    await doctorsModel.updateOne({ _id: doctorId }, { $set: { phone } });
    res.status(200).json({ message: 'Phone number updated successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    // 12. Patch status when appointment is cancelled
    export const patchAppointmentStatusRouteHandler = async (req, res) => {
    try {
    const appointmentId = req.params.appointmentId;
    await appointmentModel.updateOne({ _id: appointmentId }, { $set: { status: 'cancelled' } });
    res.status(200).json({ message: 'Appointment status updated successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    // 13. Patch status to successful when appointment date passes
    export const patchAppointmentStatusToSuccessfulRouteHandler = async (req, res) => {
    try {
    const appointmentId = req.params.appointmentId;
    await appointmentModel.updateOne({ _id: appointmentId }, { $set: { status: 'successful' } });
    res.status(200).json({ message: 'Appointment status updated successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };  

    //14. Get user data for user profile
  export const getUserProfileRouteHandler = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };