import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    type: {
        type: String,
        enum: ["like", "comment", "follow"],
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        default: null
    },

    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        default: null
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);