import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['appointment', 'reminder', 'message'] },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  readStatus: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

notificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

notificationSchema.set('toJSON', { virtuals: true });

export const notificationModel = mongoose.model('Notification', notificationSchema);