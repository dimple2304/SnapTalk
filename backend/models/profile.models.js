import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    profilepic: {
        url: {
            type: String,
            trim: true
        },
        fileId: {
            type: String,
            trim: true
        }
    },
    banner: {
        url: {
            type: String,
            trim: true
        },
        fileId: {
            type: String,
            trim: true
        }
    },
    bio: {
        type: String,
        trim: true
    },
    link: {
        url: {
            type: String,
            trim: true
        },
        label: {
            type: String,
            trim: true
        }
    },
    uploads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }]

}, { timestamps: true })

export const Profile = mongoose.model("Profile", profileSchema)