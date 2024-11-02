import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorPhone: { type: String, required: true },
  department: { 
    type: String, 
    required: true, 
    enum: ['General Medicine', 'Pediatrics', 'Dermatology', 'Cardiology'], 
  },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['cancelled', 'upcoming', 'successful'], 
    default: 'upcoming' 
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

appointmentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

appointmentSchema.set('toJSON', { virtuals: true });

export const appointmentModel = mongoose.model('Appointment', appointmentSchema);