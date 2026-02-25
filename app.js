var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var db = require('./config/db');
var ensureAdminUser = require('./config/seedAdmin');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');

var app = express();
var mongoUri = process.env.MONGO_URI || 'mongodb://22205858:npfhc56a@192.168.24.1:27017/22205858_db?authSource=admin';

db.connectToDatabase(mongoUri).then(function(connection) {
    if (connection) {
        return ensureAdminUser();
    }
    return null;
}).catch(function() {
    // Error already logged by config/db.js or seedAdmin.js
});

/* ======================
   VIEW ENGINE
====================== */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Layouts */
app.use(expressLayouts);
app.set('layout', 'layouts/main');

/* ======================
   MIDDLEWARES
====================== */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'td2_change_this_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

/* static */
app.use('/static', express.static(path.join(__dirname, 'static')));

/* rendre variables globales */
app.use((req, res, next) => {
    res.locals.currentPage = req.path.split('/')[1] || 'index';
    res.locals.title = 'Core Lab';
    res.locals.user = req.session.user || null;
    next();
});

/* ======================
   ROUTES
====================== */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

/* ======================
   404
====================== */
app.use(function(req, res, next) {
    next(createError(404));
});

/* ======================
   ERROR HANDLER
====================== */
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
