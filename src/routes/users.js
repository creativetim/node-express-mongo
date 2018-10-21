const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
//const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {
    const errors = [];
    const { name, email, password, password2 } = req.body;

    password !== password2 && errors.push({ message: 'Passwords do not match' });
    password.length < 4 && errors.push({ message: 'Password must be at least 4 characters' });

    if (errors.length) {
        res.render('users/register', {
            errors,
            messages: { errors },
            name,
            email,
            password,
            password2,
        });
    } else {
        const newUser = { name, email, password };

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                new User(newUser)
                    .save()
                    .then(() => {
                        req.flash('success', 'Created new user');
                        res.redirect('/ideas');
                    })
                    .catch(err => {
                        req.flash('error', 'There was a problem creating the user');
                        console.error(err);
                        res.redirect('/');
                    });
            });
        });
    }
});

module.exports = router;
