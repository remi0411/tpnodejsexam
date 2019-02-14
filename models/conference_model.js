var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Attendee = require('../models/attendee_model');

const Conference = mongoose.model('Conference', {
    name: String,
    begin: Date,
    end: Date,
    attendance: [{
        userId: String,
        secondDuration: Number,
        lastTimeSeen : Date
    }]
});
module.exports = Conference;