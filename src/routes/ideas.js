const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
        user: req.user.id,
    })
        .sort({ date: 'desc' })
        .then(ideas => res.render('ideas/index', {
            ideas,
        }));
});

router.post('/', ensureAuthenticated, (req, res) => {
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
            user: req.user.id,
        };

        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success', 'Video Idea was added');
                res.redirect('/ideas');
            });
    }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            if (idea.user !== req.user.id) {
                req.flash('error', 'Not authorized');
                res.redirect('/ideas');
            } else {
                idea.title = req.body.title;
                idea.details = req.body.details;

                idea.save()
                    .then(idea => {
                        req.flash('success', 'Video Idea was edited');
                        res.redirect('/ideas');
                    });
            }
        })
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            if (idea.user !== req.user.id) {
                req.flash('error', 'You are not authorized');
                res.redirect('/');
            }

            if (idea) {
                Idea.remove({ _id: req.params.id })
                    .then(() => {
                        req.flash('error', 'Video Idea was deleted');
                        res.redirect('/ideas');
                    })
            } else {
                req.flash('error', 'Video could not be deleted');
                res.redirect('/ideas');
            }
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            if (idea.user !== req.user.id) {
                req.flash('error', 'You are not authorized');
                res.redirect('/ideas');
            }

            if (idea) {
                res.render('ideas/edit', { idea });
            } else {
                req.flash('error', 'Video could not be edited');
                res.redirect('/ideas');
            }
        });
});

module.exports = router;
