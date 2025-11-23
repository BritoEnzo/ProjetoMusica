const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'mock',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock', 
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    
    const user = await User.findOne({ email: profile.emails[0].value });
    return done(null, user || { name: 'Usuário Google', email: profile.emails[0].value });
}));

passport.serializeUser((user, done) => {
    done(null, user.id || user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
module.exports = passport;