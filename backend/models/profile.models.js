import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    profilepic:{
        type: String,
    },
    name: {
        type: String,
        trim:true
    },
    bio: {
        type: String,
        trim:true
    },
    uploads:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Posts"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }]

}, {timestamps: true})

export const Profile = mongoose.model("Profile", profileSchema)