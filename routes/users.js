var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var jwtKey = process.env.JWT_KEY || '$EçRéTP@s$!\/\/||';


mongoose.connect('mongodb://127.0.0.1:27017/conference', {
  useNewUrlParser: true
})

const User = mongoose.model('User', {
  username: String,
  password: String
})

function index(req, res, next) {

  res.render('users/index', {
    title: 'Conference App'
  });
}

function signin(req, res, next) {
  User.find({
    username: req.body.username
  }, (err, users) => {
    if (err) res.status(401).send()
    if (users.length == 0) res.status(401).send()
    if (users[0].password !== req.body.password) res.status(401).send();
    var token = jwt.sign({
        name: users[0].username,
        sub: users[0]._id,
        issuer: "RLAConferenceApp"
      },
      jwtKey, {
        expiresIn: '12h'
      }
    );
    res.cookie('access_token', token);
    res.redirect('/');
  });
}

function signup(req, res, next) {
  let user = new User({
    username: req.body.username,
    password: req.body.password
  })
  user.save().then(() => {
    User.find({
      username: user.username
    }, (err, users) => {
      if (err) res.status(401).send()
      if (users.length == 0) res.status(401).send()
      if (users[0].password !== user.password) res.status(401).send();
      var token = jwt.sign({
          name: users[0].username,
          sub: users[0]._id,
          issuer: "RLAConferenceApp"
        },
        jwtKey, {
          expiresIn: '12h'
        }
      );
      res.cookie('access_token', token);
      res.redirect('/');
    });
  }).catch(err => {
    res.status(400).send(err);
  });
}

router.route('/account').get(index);
router.route('/signup').post(signup);
router.route('/signin').post(signin);

module.exports = router;