const passport = require('passport');
const PassportJwt = require('passport-jwt');
const JWT = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = 'doggo123'; // Should come from ENV
const jwtAlgorithm = 'HS256';
const jwtExpiresIn = '6h';

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// Tell Passport to process JWT
passport.use(new PassportJwt.Strategy({
  jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  algorithms: [jwtAlgorithm]
}, (payload, done) => {
  User.findById(payload.sub)
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(error => {
      done(error, false);
    });
}));

const register = (req, res, next) => {
  User.register(new User({ email: req.body.email }), req.body.password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    // Add user to request so that later middleware can access it
    req.user = user;
    next();
  });
};

// Create a JWT (user just logged in or registered)
const signJwtForUser = (req, res) => {
  // Use JWT to create a signed token
  const token = JWT.sign(
    // Payload
    {
      email: req.user.email
    },
    // Secret
    jwtSecret,
    // Header
    {
      subject: req.user._id.toString(),
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn
    }
  );

  res.json({ token: token });
};

module.exports = {
  initializePassport: passport.initialize(),
  requireJwt: passport.authenticate('jwt', { session: false }),
  login: passport.authenticate('local', { session:false }),
  register,
  signJwtForUser
};
