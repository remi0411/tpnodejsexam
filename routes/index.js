var express = require('express');
var router = express.Router();
var axios = require('axios');
var dateFormat = require('dateformat');
var jwt = require('jsonwebtoken');
var jwtKey = process.env.JWT_KEY || '$EçRéTP@s$!\/\/||';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Attendee = require('../models/attendee_model');
var Conference = require('../models/conference_model');

var mapDateString = function () {
  dateFormat.i18n = {
    dayNames: [
      'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam',
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ],
    monthNames: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    timeNames: [
      'a', 'p', 'am', 'pm', 'A', 'P', '', ''
    ]
  };
}

/* GET home page. */
function index(req, res, next) {
  mapDateString();
  var response = {};
  if (req.cookies.access_token != null) {
    response.userDatas = jwt.verify(req.cookies.access_token, jwtKey);
  }
  response.title = 'Conference App';
  response.dateformat = dateFormat;

  axios.get('http://localhost:3010/api/conferences')
    .then((body) => {
      response.conferences = body.data;
      res.render('conference/index',
        response
      );
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
};

function getCreateConferenceView(req, res, next) {
  res.render('conference/addConference', {
    title: 'Ajouter une conférence'
  });
};

function createConference(req, res, next) {
  axios.post('http://localhost:3010/api/conferences',
    req.body
  ).then((data) => {
    res.redirect('/');
  }).catch(function (error) {
    res.render('error', {
      message: error.message
    });
  });
};


function viewConference(req, res, next) {
  var userDatas = '';
  if (req.cookies.access_token != null) {
    userDatas = jwt.verify(req.cookies.access_token, jwtKey);
  }else{
    redirect('/users/account');
  }

  Conference.find({
    _id: req.params.id
  }, (err, conferences) => {
    if (err) res.status(400).send(err);
    if (conferences.length == 0) res.status(404).send('Not found');    
    if(!conferences[0].attendance.some(a => a.userId == jwt.verify(req.cookies.access_token, jwtKey).sub)){
      return res.render('error', { 'message':'Veuillez vous inscrire à la conférence avant'});
    }
    else{
      return res.render('conference/view', {conference : conferences[0], userDatas : userDatas});
    };
  });
};

function signupConference(req, res, next) {
  Conference.find({
    _id: req.params.id
  }, (err, conferences) => {
    if (err) res.status(400).send(err);
    if (conferences.length == 0) res.status(404).send('Not found');

    var attendee = {
      secondDuration: 0,
      lastTimeSeen: new Date(),
      userId: jwt.verify(req.cookies.access_token, jwtKey).sub
    };
    
    if(!conferences[0].attendance.some(a => a.userId == attendee.userId)){
      conferences[0].attendance.push(attendee);
      conferences[0].save(function (err) {});
    };
    return res.redirect('/');
  });
}

router.route('/').get(index);
router.route('/conferences/attend/:id').get(signupConference);
router.route('/conferences/:id/view').get(viewConference);
router.route('/conferences/add').post(createConference).get(getCreateConferenceView);
module.exports = router;
