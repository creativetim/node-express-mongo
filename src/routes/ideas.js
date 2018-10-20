const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


require('../models/Idea');
const Idea = mongoose.model('ideas');


router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => res.render('ideas/index', {
            ideas,
        }));
});

router.post('/', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }

    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }

    if (errors.length) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details,
        });
    } else {
        const newUser = {
            details: req.body.details,
            title: req.body.title,
        };

        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success', 'Video Idea was added');
                res.redirect('/ideas');
            });
    }
});

router.put('/:id', (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success', 'Video Idea was edited');
                    res.redirect('/ideas');
                });
        })
});

router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('error', 'Video Idea was deleted');
            res.redirect('/ideas');
        });
});

router.get('/add', (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            res.render('ideas/edit', {
                idea,
            });
        });
});


module.exports = router;
