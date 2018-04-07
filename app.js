const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

//For Timestamp messages in console
require('console-stamp')(console, 'HH:MM:ss');

let app = express();
let env = process.env;
let indexRouter = require('./routes/routes_app');
let usersRouter = require('./routes/routes_users');
let twilioRouter = require('./routes/routes_twilio');

// Route statements
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/twilio', twilioRouter);

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Set Public folder path
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    //Body Parser Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

// Error Handler
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      // render the error page
      res.status(err.status || 500);
      res.render('page_error');
    });

module.exports = app;
