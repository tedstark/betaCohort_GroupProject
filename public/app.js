const express = require('express');
const bodyParser = require('body-parser');
const expresValidator = require('express-validator');
const app = express();
const path = require('path');
const dateformat = require('dateformat');
const moment = require('moment-timezone');
const dialog = require('dialog');
// copy twilio constants and TO/FROM numbers here - env file not working

const client = require('twilio')(accountSid, authToken);

// Global Variables
app.use(function(req, res, next){
   res.locals.errors = "";
   res.locals.textMsg = "";
   res.locals.returnpage = "";
   res.locals.customMsg = "";
   res.locals.customFrom = "";
   res.locals.fromGroup = "";
   res.locals.callback = "";
   res.locals.clientcell = "";
   res.locals.standardMsg = "";
   res.locals.appDate = "";
   res.locals.appTime = "";
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
    //req.checkBody('txtClient', 'Client number is required').notNumeric();
   // req.checkBody('txtClient', 'Client number is required').isMobilePhone({options:['en-US']});

    // check for errors in data entry
    var cerrors = req.validationErrors();

    if (cerrors) {
        errmsgs = "Please provide all required fields";
        // display error warning popup window
        dialog.err(errmsgs, "Errors:" );

    } else {
        // save field values from page
        customMsg = req.body.txtCustomMsg;
        customFrom = req.body.txtCustomFrom;
        fromGroup = req.body.txtFromGroup;
        callback = req.body.txtCallback;
        clientcell = req.body.txtClient;

        // combine fields to make text message
        textMsg = customMsg + " If you have any questions please call us at " + callback + ". Message sent by " +
        customFrom + " " + fromGroup;

        // save page name for returning back to from preview page
        returnpage = 'message';
        res.render('preview', { textMsg });

    }  // if errors
}); // app.post

//  submit button on reminder page
app.post('/submitrem', function(req, res){
    console.log("post submitrem");

    // do data validation
    req.checkBody('txtRStandardMsg', 'Standard message is required').notEmpty();
    req.checkBody('txtRCallback', 'Callback number is required').notEmpty();
    req.checkBody('txtRClient', 'Client number is required').notEmpty();
   // req.checkBody('txtRClient', 'Client number is required').notNumeric();
   // req.checkBody('txtRClient', 'Client number is required').isMobilePhone({options:['en-US']});


    // check for errors in data entry
    var rerrors = req.validationErrors();

    if (rerrors) {
        errmsgs = 'Please provide all required fields';
        // display error warning popup window
        dialog.err(errmsgs, 'Errors:' );

    } else {

        // save values from reminder page
        customMsg = req.body.txtRCustomMsg;
        standardMsg = req.body.txtRStandardMsg;
        customFrom = req.body.txtRCustomFrom;
        fromGroup = req.body.txtRFromGroup;
        callback = req.body.txtRCallback;
        clientcell = req.body.txtRClient;

        // Format date from yyyy-mm-dd to m-d-yy
        var tempDate = req.body.txtRAppDate + " MST";
        appDate = dateformat(tempDate, 'shortDate');

        // Format time from 24 military, i.e. 17:30 to 9:30pm
        var tempDteTime = ('2018-01-01' + "T" + req.body.txtRAppTime);
        appTime = moment.tz(tempDteTime, "America/Phoenix").format('h:ma');

        // combine fields to make text message
        textMsg = customMsg + " " + standardMsg + appDate + " at " + appTime + "." +
        " If you have any questions please call us at " + callback + ". Message sent by " +
            customFrom + " " + fromGroup;

        // save page name for returning to it from preview page
        returnpage = 'reminder';
        res.render('preview', { textMsg });

    } // if errors
}); // app.post submitrem

// Send text message via Twillio
app.post('/send', function(req, res, next) {
    console.log("post /send");

    // would be changed as follows:
    //    to: clientcell
    //    from: env variable for twillio approved number
    // will display a popup window that text was sent - display sid
    // **** SOMETIMES SENT DIALOG SLOW TO DISPLAY - TWILLIO TEST SERVER SLOWER??
    client.messages.create({
        to: TEST_TO,
        from: TEST_FROM,
        body: textMsg
    })
        .then((message) => dialog.info('Text has been sent. ' + '/n' + 'SID Code: ' + message.sid, 'Text Confirmation'));

    // was hoping this sent back a call log list - not sure what Twillio uses this for
    // something to investigate further??
    // got some errors from this during testing - might be used to confirm delivery?
    client.messaging.services.list()
        .then(function(response) {
            console.log("client.messaging response = ", response);
        }).catch(function(error) {
        console.log("client.messageing error = ", error);
    });

    // return to the page that called the Send Text
    res.render(returnpage);
});

// Go back to home page
app.get('/home', function(req, res, next) {
    res.render('index');
});

// Cancel button on Preview Page - restore saved values back to message page
app.get('/cancelpreview', function(req, res, next) {

    if (returnpage == "messages") {
        // **** NEED TO GET DROP DOWN fromGroup TO RESET TO SAVED VALUE
        res.render(returnpage, {
            customMsg: customMsg,
            callback: callback,
            fromGroup: fromGroup,
            customFrom: customFrom,
            clientcell: clientcell
        });

    } else {
        // display reminder page
        // **** NEED TO GET DROP DOWNS TO RESET TO SAVED VALUE
        // **** NEED TO GET DATE & TIME TO RESET TO SAVED VALUE
        res.render(returnpage, {
            standardMsg: standardMsg,
            customMsg: customMsg,
            callback: callback,
            fromGroup: fromGroup,
            customFrom: customFrom,
            clientcell: clientcell,
            appTime: appTime,
            appDate: appDate
        });
    }
    });

app.listen(3000, function() {
    console.log('app.js-server started on port 3000');
});
