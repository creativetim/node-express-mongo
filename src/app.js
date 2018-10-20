const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const app = express();
const port = 5000;


// MongoDB
mongoose
    .connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.error(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');


// Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: './src/views/layouts',
    partialsDir: './src/views/partials',
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser('rouge-uh-douge'));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'rouge-uh-douge',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

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
            .then(idea => {
                req.flash('success', 'Video Idea was added');
                res.redirect('/ideas');
            });
    }
});

app.put('/ideas/:id', (req, res) => {
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

app.delete('/ideas/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('error', 'Video Idea was deleted');
            res.redirect('/ideas');
        });
});

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            res.render('ideas/edit', {
                idea,
            });
        });
});


// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
