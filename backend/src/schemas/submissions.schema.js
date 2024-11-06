import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  file: { type: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'late'], default: 'submitted' },
  grade: { type: Number },
  feedback: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

submissionSchema.virtual('id').get(function() { 
  return this._id.toHexString(); 
});

submissionSchema.set('toJSON', { virtuals: true });

export const SubmissionModel = mongoose.model('Submission', submissionSchema);