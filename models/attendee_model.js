var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Attendee = mongoose.model('Attendee', {
    secondDuration: Number,
    lastTimeSeen: Date,
    attendance: {
        type: Schema.Types.ObjectId,
        ref: 'Conference'
    }
});
module.exports = Attendee; 