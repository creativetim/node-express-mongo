const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000;


// MongoDB
mongoose
    .connect('mongodb://localhost/vidjot-dev')
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.error(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');


// Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());


// Routes
app.get('/', (req, res) => {
    const title = 'Welcome';

    res.render('index', {
        title,
    });
});
app.get('/about',(req, res) => {
    res.render('about');
});

app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => res.render('ideas/index', {
            ideas,
        }));
});
app.post('/ideas', (req, res) => {
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
            .then(idea => res.redirect('/ideas'));
    }
});
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});


// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
