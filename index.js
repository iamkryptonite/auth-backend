const express = require('express')
const app = express()
const port = 3000
const passport = require('passport')
const mongoose = require('mongoose');
const userModel = require('./userModel')

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys')

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(keys.mongodb.uri,{useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('connected')
})
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
    profileFields: ["emails", "name","id","displayName"]
  },
  function(accessToken, refreshToken, profile, done) {
    const { id, first_name, last_name ,name} = profile._json;
    const userData = {
      facebook_id : id,
      first_name : first_name,
      last_name : last_name,
      username : name
    };
    userModel.findOne({facebook_id:id}).then((user)=>{
        if(!user)
            new userModel(userData).save();
    })
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