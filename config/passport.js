const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model');
const bcrypt = require('bcryptjs');

passport.use( new LocalStrategy( function( username, password, done ) {
    User.findOne({ username }, async function(err, user){
        if(err){
            console.log(err);
            return done(err);
        }
        if(!user){
            console.log(`user not found`);
            return done(null, false, { message: `user not found` });
        }
        // unhash password
        const comparePassword = await bcrypt.compare( password, user.password );
        if(!comparePassword){
            console.log('Incorrect password');
            done(null, false, { message: `Incorrect password` })
        }
        return done(null, user);
    })
}));

passport.serializeUser(function(user, cb){
    cb(null, user.id)
});
passport.deserializeUser(function(id, cb){
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

module.exports = passport;