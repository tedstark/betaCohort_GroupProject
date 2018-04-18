const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const app = express();
const path = require('path');
const dateformat = require('dateformat');
const moment = require('moment-timezone');
const dialog = require('dialog');
const delay = require('delay');

// Bring in models
let SentText = require('./models/senttext');

// array to hold sent messages
// let logArr = {
//     logDT: "",
//     logTo: "",
//     logText: "",
//     logStatus: ""
// };

let logArr = [];

// copy twilio constants and TO/FROM numbers here - env file not working
const TEST_TO = '4802720635';
const TEST_FROM = '4803729908';
const accountSid = 'ACbba27afc23b7049bdd547dc86724bc78';
const authToken = '8e0a742139f4dd93463afcc1d9ba6098';
const client = require('twilio')(accountSid, authToken);

// Global Variables
app.use(function(req, res, next){
   res.locals.errors = "";
   res.locals.returnpage = "";
   res.locals.textMsg = "";
   res.locals.customMsg = "";
   res.locals.customFrom = "";
   res.locals.fromGroup = "";
   res.locals.callback = "";
   res.locals.clientcell = "";
   res.locals.standardMsg = "";
   res.locals.appDate = "";
   res.locals.appTime = "";
   res.locals.savesid = "";
   next();
});


app.use(express.static('public/images'));

// style.css path
app.get('/css/style.css', function(req, res){
    res.sendFile(__dirname + '/css/style.css');
});

// main.js path
app.get('/js/main.js', function(req, res){
    res.sendFile(__dirname + '/js/main.js');
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

// Express Validator Middleware - must be after bodyparser
app.use(validator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.');
        let root = namespace.shift();
        let formParam = root;

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

// text history button on index page
app.get('/textlogs', function(req, res){
    console.log("get /textlogs");

    // display all past messages - NO FILTERING
    //client.messages.each((message) => console.log(message.body));

    // Twilio API to retrieve messages with the filterOptions without a function
    //client.messages.each(filterOpts, (message) => console.log("sent" + message.DateSent + "sid: " + message.sid + " text: " + message.body));

    // create a date 7 days prior to today to use for Twilio filtering date
    let filterDate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
    console.log("filterDate = ", filterDate);

    // Filtering Options to get past messages by specific criteria
    const filterOpts = {
        To: 'TEST_TO',
        dateSentAfter: filterDate
    };

    // Twilio API to retrieve sent messages using filtering options
    client.messages.each(filterOpts, function(res) {

        let tempDate = dateformat(res.dateSent, 'shortDate');

        // format date sent field to format time from 24 military, i.e. 17:30 to 9:30pm
        let tempDteTime = moment.tz(res.dateSent, "America/Phoenix").format('h:ma');
        let textDateTime = tempDate + " " + tempDteTime;

        // show message fields
       // console.log("date sent: ", textDateTime, " sent to: ", res.to, " text: ", res.body, " status: ", res.status);

        logArr.push(res);
    });

    // delay page load until Twilio call is finished returning all records
    delay(1000)
        .then(() => {
            console.log(logArr);
            res.render('textlogs', { logArr: logArr });
        });

});

// submit text button on message page
app.post('/submitcus', function(req, res){
    console.log("post /submitcus");

    // do data validation
    req.checkBody('txtCustomMsg', 'Custom message is required').notEmpty();
    req.checkBody('txtCallback', 'Callback number is required').notEmpty();
    req.checkBody('txtClient', 'Client number is required').notEmpty();
    req.checkBody('txtClient','Enter a valid cell phone number.').isMobilePhone('en-US');

    // check for errors in data entry
    let errors = req.validationErrors();

    if (errors) {
            res.render('message', { errors: errors });
            return;

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
    req.checkBody('txtRClient','Enter a valid cell phone number.').isMobilePhone('en-US');

    // check for errors in data entry
    let errors = req.validationErrors();

    if (errors) {
        res.render('reminder', { errors: errors });
        return;

    } else {

        // save values from reminder page
        customMsg = req.body.txtRCustomMsg;
        standardMsg = req.body.txtRStandardMsg;
        customFrom = req.body.txtRCustomFrom;
        fromGroup = req.body.txtRFromGroup;
        callback = req.body.txtRCallback;
        clientcell = req.body.txtRClient;

        // Format date from yyyy-mm-dd to m-d-yy
        let tempDate = req.body.txtRAppDate + " MST";
        appDate = dateformat(tempDate, 'shortDate');

        // Format time from 24 military, i.e. 17:30 to 9:30pm
        let tempDteTime = ('2018-01-01' + "T" + req.body.txtRAppTime);
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
    // will display a popup window that text was sent - display sid
    // **** SOMETIMES SENT DIALOG SLOW TO DISPLAY - TWILLIO TEST SERVER SLOWER??
    client.messages.create(
    {   to: TEST_TO,
        from: TEST_FROM,
        body: textMsg
    },
        function(err, message) {

            if (err) {

            } else {
                savesid = message.sid;
                console.log("message = ", message);
                res.render(returnpage, { message: message });
                return;
               // console.log("savesid = " + message.sid);
               // dialog.info('Text has been sent.' + '\n' + 'SID Code: ' + savesid, 'Text Confirmation');

                //
                // // get current date and time for database
                // let d = new Date();
                // let date = (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
                // let time = (d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
                // let dateTime = date + ' ' + time;
                // console.log("dateTime = ", dateTime);
                //
                // // save sent text to DB
                // let senttext = new SentText();
                //     senttext.text = textMsg,
                //     senttext.client = clientcell,
                //     senttext.sentdate = dateTime,
                //     senttext.sid = savesid;
                // console.log('senttext object = ', senttext);
                //
                // senttext.save(function (err) {
                //     if (err) {
                //         console.log('error on .save function err= ', err);
                //     } else {
                //         console.log('sent text saved to DB');
                //     }

            }
        });
            // return to the page that called the Send Text
           // res.render(returnpage);
});

// Go back to home page
app.get('/home', function(req, res, next) {
    res.render('index');
});

// Cancel button on Preview Page - restore saved values back to message page
app.get('/cancelpreview', function(req, res, next) {
    res.render(returnpage);

    // if (returnpage == "messages") {
    //     // **** NEED TO GET DROP DOWN fromGroup TO RESET TO SAVED VALUE
    //     res.render(returnpage, {
    //         customMsg: customMsg,
    //         callback: callback,
    //         fromGroup: fromGroup,
    //         customFrom: customFrom,
    //         clientcell: clientcell
    //     });
    //
    // } else {
    //     // display reminder page
    //     // **** NEED TO GET DROP DOWNS TO RESET TO SAVED VALUE
    //     // **** NEED TO GET DATE & TIME TO RESET TO SAVED VALUE
    //     res.render(returnpage, {
    //         standardMsg: standardMsg,
    //         customMsg: customMsg,
    //         callback: callback,
    //         fromGroup: fromGroup,
    //         customFrom: customFrom,
    //         clientcell: clientcell,
    //         appTime: appTime,
    //         appDate: appDate
    //     });
    //}

});

app.listen(3000, function() {
    console.log('app.js-server started on port 3000');
});
