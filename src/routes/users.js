const express = require('express');
const router = express.Router();


router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {
    const errors = [];
    const {
        name,
        email,
        password,
        password2,
    } = req.body;

    if (password !== password2) {
        errors.push({ message: 'Passwords do not match' });
    }

    if (password.length < 4) {
        errors.push({ message: 'Password must be at least 4 characters' });
    }

    if (errors.length) {
        res.render('users/register', {
            errors,
            messages: {
                errors,
            },
            name,
            email,
            password,
            password2,
        });
    } else {
        res.send('register me!');
    }
});


module.exports = router;
