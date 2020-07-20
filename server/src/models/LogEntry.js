const mongoose = require('mongoose');

const { Schema } = mongoose;

const logEntrySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    comments: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90,
        required: true
    },
    longitude: {
        type: Number,
        min: -180,
        max: 180,  
        required: true
    },
    image: String,
    visitDate: {
        required: true,
        type: Date
    }
}, {timestamps: true});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;