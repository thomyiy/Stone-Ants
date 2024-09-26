const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require("crypto")

const StoneRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    stones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "stones",
    }],
    created_at: Date,
})

const stoneRequest = mongoose.model('stoneRequests', StoneRequestSchema);
module.exports = stoneRequest;
