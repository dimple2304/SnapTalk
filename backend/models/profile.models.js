import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    profilepic: {
        type: String,
    },
    banner:{
        type:String
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
        type: String
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