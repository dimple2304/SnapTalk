import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
    likedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        createdAt: { type: Date, default: Date.now }
    }],
    commentBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        createdAt: { type: Date, default: Date.now }
    }],
    hashtags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isPinned: {
        type: Boolean,
        default: false
    }
})

export const Posts = mongoose.model("Posts", postsSchema)