import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  assignmentName: {type: String},
  deadlineDate: { type: Date, required: true },
  deadlineTime: { type: String, required: true },
  Type: {type:  String, enum: ['group', 'individual']},
  groupname: { type: String }, 
  GroupLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  LecturerName: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' }, 
  course: { type: String, required: true, enum: ['BIST', 'BSE', 'CSC'] },
  assignment: { type: String, required: true }, 
  status: { type: String, required: true, enum: ['expired', 'ongoing'], default: 'ongoing' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }], 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

assignmentSchema.virtual('id').get(function() { return this._id.toHexString(); });

assignmentSchema.set('toJSON', { virtuals: true });

export const AssignmentModel = mongoose.model('Assignment', assignmentSchema);