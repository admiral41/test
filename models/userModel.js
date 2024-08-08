const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    ip: String,
    location: String,
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now },
    action: String
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    logs: [logSchema]
});

module.exports = mongoose.model("User", userSchema);
