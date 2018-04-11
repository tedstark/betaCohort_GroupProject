const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const moment = require('moment-timezone');
require('dotenv').config(); //dotenv

//For Timestamp messages in console
require('console-stamp')(console, 'HH:MM:ss');

//Variable statements
let app = express();
let env = process.env;
let db = mongoose.connection;

//Set Public folder path
app.use(express.static(path.join(__dirname, 'public')));

//Database related
  //DB Connection
  mongoose.connect(env.db_string);
  //Check DB connection
  db.once('open', function(err){
    console.log('Connection made to Database: '+env.db_name);
  })
  //Check for DB errors
  db.on('error', function(err){
    console.log(err);
  })

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Middleware
    app.use(logger('dev'));
    // app.use(express.json());
    // app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    //Body Parser Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //Express Session Middleware
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        // cookie: {secure: true}
    }));

    //Express Messages Middleware
    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    // Express Validator Middleware
    app.use(expressValidator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
            while(namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param : formParam,
                msg   : msg,
                value : value
            };
        }
    }));

    // Passport config
    require('./config/config_passport')(passport);
    // Passport Middleware
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('*', function(req,res,next){
      res.locals.user=req.user || null;
      next();
    })

// Routes
  // Route variables
  let twilioRouter = require('./routes/routes_twilio');
  let usersRouter = require('./routes/routes_users');
  let appRouter = require('./routes/routes_app');
  let loginRouter = require('./routes/routes_login');

  // Route statements
  // app.use('/messages', appRouter);
  // app.use('/reminders', appRouter);
  app.use('/users', usersRouter);
  app.use('/login', loginRouter);
  app.use('/twilio', twilioRouter);
  app.use('/', appRouter);

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
