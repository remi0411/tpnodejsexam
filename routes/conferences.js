var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/conference', {
    useNewUrlParser: true
})

const Conference = mongoose.model('Conference', {
    name: String,
    begin: Date,
    end: Date
});

/**
 * @swagger
 * /api/conferences:
 *    post:
 *      description: This should return all users
 */
function addConference(req, res) {
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
function getConferences(req, res) {
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
function getConference(req, res) {
    Conference.find({
        _id: req.params.id
    }, (err, conferences) => {
        if (err) res.status(400).send(err)
        if (conferences.length == 0) res.status(404).send('Not found')
        res.status(200).send(conferences[0])
    })
}


/**
 * @swagger
 * /api/conferences/:id:
 *    put:
 *      description: This should return all users
 */
function editConference(req, res) {
    Conference.findOneAndUpdate(
        {
            _id: req.params.id
        }, 
        req.body, 
        {
            upsert:true
        }, 
        function(err, doc){
            if (err) return res.send(500, { error: err });
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
function deleteConference(req, res) {
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


router.route('/').get(getConferences).post(addConference);
router.route('/:id').get(getConference).put(editConference).delete(deleteConference);


module.exports = router;
