const express = require('express')
const app = express()
const port = 3000
const passport = require('passport')
const mongoose = require('mongoose');
const userModel = require('./userModel')
const cookieSession = require('cookie-session')
const keys = require('./keys')

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.key]
}))
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGODB_URI || keys.mongodb.uri,
    {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('connected')
})

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    userModel.findById(id).then((user)=>{
        done(null, user);
    })
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
            new userModel(userData).save().then((newUser)=>{
                done(null,newUser)
            });
        else
            done(null,user)
    })
  }
));


//---------------Routes----------------------
const authCheck = (req,res,next) =>{
    if(req.user){
        res.redirect('/fail')
    }else
        next();
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/auth/facebook', passport.authenticate('facebook'))

app.get("/auth/facebook/callback",passport.authenticate("facebook", {
      successRedirect: "/success",
      failureRedirect: "/fail"
    })
);

app.get("/success",(req, res) => {
    res.send(req.user);
});
app.get("/fail", (req, res) => {
    res.send("Failed attempt");
});








//---------------------------------------------------------------------
app.listen(process.env.PORT || 3000, () => {
  console.log(`Authentication app listening at http://localhost:${port}`)
})