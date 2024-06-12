// Copyright (c) 2024 Dwayne Hans Jr
//
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

// User model
const User = require('./models/User');

const app = express();

app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for local-login
passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    });
  }
));

// Serialize user
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(express.json());

app.post('/register', [
  // username must be an email
  body('username').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitize input
  req.body.username = req.sanitize(req.body.username);
  req.body.password = req.sanitize(req.body.password);
// Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.send(errors);
  } else {
    User.findOne({ username: username }).then(user => {
      if (user) {
        errors.push({ msg: 'Username already exists' });
        res.send(errors);
      } else {
        const newUser = new User({
          username,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                res.send('You are now registered and can log in');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login route
app.post('/login', (req, res, next) => {
  passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(5000, () => console.log('Server started on port 5000'));
