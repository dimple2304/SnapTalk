import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    dob:{
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
    isOnline:{
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    followersCount: [{
        type: Number,
        default: 0
    }],
    followingCount: [{
        type: Number,
        default: 0
    }]
}, {timestamps: true})

export const Users = mongoose.model("Users", userSchema);
