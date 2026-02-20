var createError = require('http-errors');
var express = require('express');
const expressLayouts = require("express-ejs-layouts");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/* ======================
   VIEW ENGINE
====================== */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* IMPORTANT : layouts */
app.use(expressLayouts);

/* chemin du layout (sans extension) */
app.set('layout', 'layouts/main');

/* OPTIONNEL MAIS RECOMMANDÉ */
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

/* ======================
   MIDDLEWARES
====================== */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* static */
app.use('/static', express.static(path.join(__dirname, 'static')));

/* rendre variables globales */
app.use((req, res, next) => {
    res.locals.currentPage = req.path.replace("/", "") || "index";
    res.locals.title = "Core Lab"; // évite title undefined
    next();
});

/* ======================
   ROUTES
====================== */
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
