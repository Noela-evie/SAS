import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  userId: { required: true, type: String },
  email: { required: true, type: String },
  email_verified_at: { type: Date },
  password: { required: true, type: String },
  course: { type: String, required: true, enum: ['BIST', 'BSE', 'CSC'] },
  role: { required: true, type: String},
  groupname: { type: String }, 
  isGroupLeader: { type: Boolean, default: false }, 
  updated_at: { type: Date, default: Date.now },
});

userSchema.virtual("id").get(function() { return this._id.toHexString(); });

userSchema.set("toJSON", { virtuals: true });

export const userModel= mongoose.model("User", userSchema);