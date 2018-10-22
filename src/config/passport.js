const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../models/User');
const User = mongoose.model('users');

module.exports = passport => {
    const localStart = new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
            User.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'No user found' });
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user, { message: 'Welcome, back!' });
                        } else {
                            return done(null, false, { message: 'Password is incorrect' });
                        }
                    });
                });
        }
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });

    passport.use(localStart);
};
