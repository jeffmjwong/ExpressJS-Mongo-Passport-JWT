const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router();

const { requireJwt, login, register, signJwtForUser } = require('../middleware/auth');

router.get('/', (req, res) => {
  res.send('Anyone can view this page!');
});

router.get('/protected', requireJwt, (req, res) => {
  res.send('You have a valid token!');
});

router.post('/register', register, signJwtForUser);

router.post('/login', login, signJwtForUser);

// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

module.exports = router;
