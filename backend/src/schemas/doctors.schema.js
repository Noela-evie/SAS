import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { required: true, type: String },
  NIN: { required: true, type: String, unique: true }, // Each doctor has a unique NIN
  email: { type: String, unique: true },
  password: { required: true, type: String },
  role: { type: String, const: "doctor" },
  phone: { type: String, required: true }, // Contact number
  specialty: { type: String }, // e.g., "Cardiologist", "Pediatrician"
  department: {
    type: String,
    required: true,
    enum: ['General Medicine', 'Pediatrics', 'Dermatology', 'Cardiology'], 
  },
  availability: {
    type: Map,
    of: Boolean,
    default: {}, 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

doctorSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

doctorSchema.set('toJSON', { virtuals: true });

export const doctorsModel = mongoose.model('Doctor', doctorSchema);

