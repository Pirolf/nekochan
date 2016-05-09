const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./user');
const configAuth = require('../config/config');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['emails', 'displayName']
    },

    function(token, refreshToken, profile, done) {
        process.nextTick(() => {
            User.findOne({ 'facebook.id' : profile.id }, (err, user) => {
                if (err) return done(err);
                if (user) return done(null, user);

                const {id, displayName, emails} = profile;
                const newUser = new User();
                
                newUser.facebook.id = id;                   
                newUser.facebook.token = token;
                newUser.facebook.name = displayName;
                newUser.facebook.email = emails[0].value;

                newUser.save((err) => {
                    if (err) throw err;
                    return done(null, newUser);
                });
            });
        });
    }));
};