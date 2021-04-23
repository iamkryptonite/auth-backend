const express = require('express')
const app = express()
const port = 3000

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const keys = require('./keys')
console.log(keys)
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: "/auth/facebook/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));


//---------------Routes----------------------
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/auth/facebook', passport.authenticate('facebook'))

app.get("/auth/facebook/callback",passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/fail"
    })
);

app.get("/fail", (req, res) => {
    res.send("Failed attempt");
});








//---------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Authentication app listening at http://localhost:${port}`)
})