import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        default: ""
    },
    name:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inactive", "pending", "suspended", "banned"],
        default: "active",
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "moderator"], 
        default: "user",
        required: true,
        trim: true
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    // posts:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Posts"
    // }]
}, { timestamps: true })

export const Users = mongoose.model("Users", userSchema);
