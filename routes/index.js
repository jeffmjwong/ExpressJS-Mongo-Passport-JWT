const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  const message = `You are logged ${req.user ? 'in as ' + JSON.stringify(req.user) : 'out'}`;
  res.send(message);
});

router.post('/register', (req, res) => {
  User.register(new User({ email: req.body.email }), req.body.password, (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    // Log the new user in (Passport will create a session)
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
