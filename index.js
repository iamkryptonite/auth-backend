const express = require('express')
const app = express()
const port = 3000

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const keys = require('./keys')

passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(... function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
));

app.listen(port, () => {
  console.log(`Authentication app listening at http://localhost:${port}`)
})