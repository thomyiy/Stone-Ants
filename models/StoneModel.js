const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require("crypto")

const StoneSchema = new mongoose.Schema({
    StockRef: {
        type: String,
        unique: true
    },
    Cert: {
        type: String,
    },
    Shape: {
        type: String,
    },
    Size: {
        type: Number,
        required: true
    },
    DispColor: {
        type: String,
        required: true
    },
    DispClarity: {
        type: String,
        required: true
    },
    Cut: {
        type: String,
        required: true
    },
    Polish: {
        type: String,
        required: true
    },
    Sym: {
        type: String,
        required: true
    },
    Flour: {
        type: String,
        required: true
    },
    RapRate: {
        type: Number,
        required: true
    },
    PPC: {
        type: Number,
        required: true
    },
    Total: {
        type: Number,
        required: true
    },
    created_at: Date,
})

const stone = mongoose.model('stones', StoneSchema);
module.exports = stone;
