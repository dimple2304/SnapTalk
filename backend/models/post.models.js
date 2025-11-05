import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    isMedia: {
        type: Boolean,
        default: false
    },
    thought: {
        type: String,
    },
    media: {
        url: {
            type: String,
            trim: true
        },
        fileId: {
            type: String,
            trim: true
        }
    },
    caption: {
        type: String,
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        createdAt: { type: Date, default: Date.now }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        comment: {
            type: String
        },
        createdAt: { type: Date, default: Date.now }
    }],
    shares: {
        type: Number
    },
    hashtags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isPinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Posts = mongoose.model("Posts", postsSchema)