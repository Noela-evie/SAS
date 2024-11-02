import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

eventSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

eventSchema.set('toJSON', { virtuals: true });

export const eventModel = mongoose.model('Event', eventSchema);
