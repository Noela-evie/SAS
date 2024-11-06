import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  notificationSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });
  
  notificationSchema.set('toJSON', {
    virtuals: true
  });
  
  export const NotificationModel = mongoose.model('Notification', notificationSchema);
  