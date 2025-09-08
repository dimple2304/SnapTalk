import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isMedia: {
        type: Boolean,
        default: false
    },
    tweet: {
        type: String,
    },
     image: {
        type: String,
    },
    caption: {
        type: String,
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    comment: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        createdAt: {type: Date, default: Date.now}
    }],
    tags: [{
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