const express = require('express');
const bodyParser = require('body-parser');
const expresValidator = require('express-validator');
const app = express();
const path = require('path');
const dateformat = require('dateformat');
const moment = require('moment-timezone');
const dialog = require('dialog');
// const accountSid = TWILIO_SID;
// const authToken = TWILIO_AUTH;
const client = require('twilio')(accountSid, authToken);


// Global Variables
app.use(function(req, res, next){
   res.locals.errors = "";
   res.locals.textMsg = "";
   res.locals.returnpage = "";
   res.locals.ccustomMsg = "";
   res.locals.ccustomFrom = "";
   res.locals.cfromGroup = "";
   res.locals.ccallback = "";
   res.locals.cclient = "";
   next();
});


app.use(express.static('public/images'));

// style.css path
app.get('/css/style.css', function(req, res){
    res.sendFile(__dirname + '/css/style.css');
});

// preview.pug path
app.get('/views/preview.pug', function(req, res){
    res.sendFile(__dirname + '/views/preview.pug');
});

// View Engine
app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator Middleware
app.use(expresValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while (namespace.length) {
            formParm += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// loads index page when app.js is run
app.get('/', function(req, res){
   console.log("get / index");
   res.render('index');
});

// reminder button on index page
app.get('/reminder', function(req, res){
    console.log("get /reminder");
    res.render('reminder');
});

// message button on index page
app.get('/message', function(req, res){
    console.log("get /message");
    res.render('message');
});

// submit text button on message page
app.post('/submitcus', function(req, res){
    console.log("post /submitcus");

    // do data validation
    req.checkBody('txtCustomMsg', 'Custom message is required').notEmpty();
    req.checkBody('txtCallback', 'Callback number is required').notEmpty();
    req.checkBody('txtClient', 'Client number is required').notEmpty();

    // check for errors in data entry
    var cerrors = req.validationErrors();

    if (cerrors) {
        errmsgs = "Please provide all required fields";
        // display error warning popup window
        dialog.warn(errmsgs, "Errors:" );

    } else {
        // save field values from page
        ccustomMsg = req.body.txtCustomMsg;
        ccustomFrom = req.body.txtCustomFrom;
        cfromGroup = req.body.txtFromGroup;
        ccallback = req.body.txtCallback;
        cclient = req.body.txtClient;

        // combine fields to make text message
        textMsg = ccustomMsg + " If you have any questions please call us at " + ccallback + ". Message sent by " +
        ccustomFrom + " " + cfromGroup;

        // save page name for returning back to from preview page
        returnpage = 'message';
        res.render('preview', { title:textMsg });

    }  // if errors
}); // app.post

//  submit button on reminder page
app.post('/submitrem', function(req, res){
    console.log("post submitrem");

    // do data validation
    req.checkBody('txtRStandardMsg', 'Standard message is required').notEmpty();
    req.checkBody('txtRCallback', 'Callback number is required').notEmpty();
    req.checkBody('txtRClient', 'Client number is required').notEmpty();

    // check for errors in data entry
    var rerrors = req.validationErrors();

    if (rerrors) {
        errmsgs = "Please provide all required fields";
        // display error warning popup window
        dialog.warn(errmsgs, "Errors:" );

    } else {

        // save values from reminder page
        var rcustomMsg = req.body.txtRCustomMsg;
        var rstandardMsg = req.body.txtRStandardMsg;
        var rcustomFrom = req.body.txtRCustomFrom;
        var rfromGroup = req.body.txtRFromGroup;
        var rcallback = req.body.txtRCallback;
        var rclient = req.body.txtRClient;


        // Format date from yyyy-mm-dd to m-d-yy
        var tempDate = req.body.txtRAppDate + " MST";
        var rappDate = dateformat(tempDate, 'shortDate');

        // Format time from 24 military, i.e. 17:30 to 9:30pm
        var tempDteTime = ('2018-01-01' + "T" + req.body.txtRAppTime);
        var rappTime = moment.tz(tempDteTime, "America/Phoenix").format('h:ma');

        // combine fields to make text message
        textMsg = rcustomMsg + " " + rstandardMsg + rappDate + " at " + rappTime + "." +
        " If you have any questions please call us at " + rcallback + ". Message sent by " +
            rcustomFrom + " " + rfromGroup;

        // save page name for returning to it from preview page
        returnpage = 'reminder';
        res.render('preview', { title: textMsg });

    } // if errors
}); // app.post submitrem

// Send text message via Twillio
app.post('/send', function(req, res, next) {
    console.log("post /send");
    console.log("textMsg = " + textMsg);
    client.messages.create({
        to: '+14802720635',
        from: '+14803729908',
        body: textMsg
    })
        .then((message) => console.log(message.sid))

    // return to the page that called the Send Text
    res.render(returnpage);
});

// Go back to home page
app.get('/home', function(req, res, next) {
    res.render('index');
});

// Cancel button on Preview Page - restore saved values back to message page
// Need logic added to do the same for the reminder page
app.get('/cancelpreview', function(req, res, next) {
    console.log("ccustomMsg = ", ccustomMsg);
    res.render(returnpage,{ccustomMsg:ccustomMsg, ccallback:ccallback,cfromGroup:cfromGroup, ccustomFrom:ccustomFrom, cclient:cclient});
});

app.listen(3000, function() {
    console.log('app.js-server started on port 3000');
});
