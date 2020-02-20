var express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

/* GET reset listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:token', auth.optional, (req, res, next) => {

  var secret = 'supersecret';
  var token = req.params.token; //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InR2ci5qb21hckBnbWFpbC5jb20iLCJpYXQiOjE1ODE2NTUwMDV9.WoBxtQ627cZ_A-il1bfjYZeOSfVwbL87Z5SehpzqEzI
  var decoded = jwt.verify(token, secret);
  return res.json({decodedEmail: decoded})
})

module.exports = router;
