var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Attendee = require('../models/attendee_model');
var Conference = require('../models/conference_model');

mongoose.connect('mongodb://127.0.0.1:27017/conference', {
    useNewUrlParser: true
})


/**
 * @swagger
 * /api/conferences:
 *    post:
 *      description: This should return all users
 */
function addConference(req, res,next) {
    let conference = new Conference({
        name: req.body.name,
        begin: new Date(req.body.begin),
        end: new Date(req.body.end)
    })
    conference.save().then(() => {
        res.status(201).send(conference)
    }).catch(err => {
        res.status(400).send(err)
    });
}


/**
 * @swagger
 * /api/conferences/:
 *    get:
 *      description: This should return all users
 */
function getConferences(req, res,next) {
    Conference.find((err, conferences) => {
        if (err) res.status(400).send(err)
        res.status(200).send(conferences)
    })
}


/**
 * @swagger
 * /api/conferences/:id:
 *    get:
 *      description: This should return all users
 */
function getConference(req, res,next) {
    Conference.find({
        _id: req.params.id
    }, (err, conferences) => {
        if (err) res.status(400).send(err)
        if (conferences.length == 0) res.status(404).send('Not found')
        res.status(200).send(conferences[0])
    });
}


/**
 * @swagger
 * /api/conferences/:id:
 *    put:
 *      description: This should return all users
 */
function editConference(req, res,next) {
    Conference.findOneAndUpdate({
            _id: req.params.id
        },
        req.body, {
            upsert: true
        },
        function (err, doc) {
            if (err) return res.send(500, {
                error: err
            });
            return res.status(204);
        }
    );
}


/**
 * @swagger
 * /api/conferences/:id:
 *    delete:
 *      description: This should return all users
 */
function deleteConference(req, res,next) {
    Conference.findByIdAndRemove({
        _id: req.params.id
    }, (err, conference) => {
        // As always, handle any potential errors:
        if (err) return res.status(500).send(err);
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        return res.status(204).send();
    });
}


function pushAttendance(req,res,next){
    Conference.find({
        _id: req.params.id
    }, (err, conferences) => {
        if (err) res.status(400).send(err)
        if (conferences.length == 0) res.status(404).send('Not found')
        var att = conferences[0].attendance.filter(function(item){
            return item.userId == req.body.uid;
        });
        att.secondDuration += 5;
        att.lastTimeSeen = new Date();
        conferences[0].save().then(() => {});
        res.status(204).send();
    });
}

router.route('/').get(getConferences).post(addConference);
router.route('/:id').get(getConference).put(editConference).delete(deleteConference);
router.route('/:id/attendance').put(pushAttendance);

module.exports = router;
