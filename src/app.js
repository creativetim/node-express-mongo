const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const app = express();
const port = 5000;


// MongoDB
mongoose
    .connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.error(err));


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
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser('rouge-uh-douge'));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'rouge-uh-douge',
    resave: true,
    saveUninitialized: true,
}));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user || null;

    next();
});

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


// Routes
const ideasRoutes = require('./routes/ideas');
const usersRoutes = require('./routes/users');

app.use('/ideas', ideasRoutes);
app.use('/users', usersRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
