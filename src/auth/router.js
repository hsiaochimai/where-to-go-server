'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function (user) {
    return jwt.sign({ user }, config.JWT_SECRET, {
      subject: '' + user.id,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    });
  };

  function localAuth(req, res, next) {
    passport.authenticate(
      'local',
      {
        session: false,
      },
      function (err, user, info) {
        if (err || !user) {
          let msg = info ? info.message : 'Invalid credentials'
          console.log("AUTH ERR !!!!", msg)
          return res.status(400).json({ error: msg })
        }
        req.user = user
        const authToken = createAuthToken(JSON.stringify(req.user));
        delete req.user.password
        res.json({ authToken, user: req.user });
      })(req, res, next)
  }
  router.use(bodyParser.json());
// The user provides a username and password to login
router.post('/login', localAuth)

const jwtAuth = passport.authenticate('jwt', { session: false });

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
