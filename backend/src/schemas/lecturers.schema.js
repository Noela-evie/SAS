import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  name: { required: true, type: String },
  userId: { required: true, type: String, unique: true },
  email: { type: String, unique: true },
  password: { required: true, type: String },
  role: { type: String, const: 'lecturer' }, 
  phone: { type: String, required: true },
  courseunit: { type: String },
  course: { type: String, required: true, enum: ['BIST', 'BSE', 'CSC'] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

lecturerSchema.virtual('id').get(function() { return this._id.toHexString(); });

lecturerSchema.set('toJSON', { virtuals: true });

export const LecturerModel = mongoose.model('Lecturer', lecturerSchema);