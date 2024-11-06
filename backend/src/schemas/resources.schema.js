import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  resourceName: { type: String, required: true },
  resourceType: { type: String, required: true, enum: ['Notes', 'Textbooks', 'Pastpapers'] },
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' },
  courseunit: { type: String, required: true },
  course: { type: String, required: true, enum: ['BIST', 'BSE', 'CSC'] },
  resourceContent: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
resourceSchema.virtual('id').get(function() { return this._id.toHexString(); });
resourceSchema.set('toJSON', { virtuals: true });
export const ResourceModel = mongoose.model('Resource', resourceSchema);
