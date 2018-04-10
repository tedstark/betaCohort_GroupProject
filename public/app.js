const express = require('express');
const bodyParser = require('body-parser');
const expresValidator = require('express-validator');
const app = express();
const path = require('path');
const dateformat = require('dateformat');
const moment = require('moment-timezone');
const dialog = require('dialog');


// Global Variables
app.use(function(req, res, next){
   res.locals.errors = "";
   res.locals.textMsg = "";
   next();
});

app.use(express.static('public/images'));

app.get('/css/style.css', function(req, res){
    res.sendFile(__dirname + '/css/style.css');
});

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

app.get('/', function(req, res){
   console.log("get / index");
   res.render('index');
});

app.get('/reminder', function(req, res){
    console.log("get /reminder");
    res.render('reminder');
});

app.get('/message', function(req, res){
    console.log("get /message");
    res.render('message');
});

app.post('/submitcus', function(req, res){
    console.log("post /submitcus");

    req.checkBody('txtCustomMsg', 'Custom message is required').notEmpty();
    req.checkBody('txtCallback', 'Callback number is required').notEmpty();
    req.checkBody('txtClient', 'Client number is required').notEmpty();

    var cerrors = req.validationErrors();

    if (cerrors) {
        errmsgs = "Error: Must provide all required fields";
        console.log(errmsgs);
        // display error warning popup window
        dialog.info('Please provide all required fields.');

    } else {

        var ccustomMsg = req.body.txtCustomMsg;
        var ccustomFrom = req.body.txtCustomFrom;
        var cfromGroup = req.body.txtFromGroup;
        var ccallback = req.body.txtCallback;
        var cclient = req.body.txtClient;

        textMsg = ccustomMsg + " If you have any questions please call us at " + ccallback + ". Message sent by " +
        ccustomFrom + " " + cfromGroup;

        console.log(textMsg);

        res.render('preview', { title:textMsg });

    }  // if errors

}); // app.post

app.post('/submitrem', function(req, res){
    console.log("post submitrem");

    req.checkBody('txtRStandardMsg', 'Standard message is required').notEmpty();
    req.checkBody('txtRCallback', 'Callback number is required').notEmpty();
    req.checkBody('txtRClient', 'Client number is required').notEmpty();

    var rerrors = req.validationErrors();

    if (rerrors) {
        errmsgs = "Error: Must provide all required fields";
        console.log(errmsgs);
        // display error warning popup window
        dialog.info('Please provide all required fields.');

    } else {

        var rcustomMsg = req.body.txtRCustomMsg;
        var rstandardMsg = req.body.txtRStandardMsg;
        var rcustomFrom = req.body.txtRCustomFrom;
        var rfromGroup = req.body.txtRFromGroup;
        var rcallback = req.body.txtRCallback;
        var rclient = req.body.txtRClient;


        // Format date from yyyy-mm-dd to m-d-yy
        var tempDate = req.body.txtRAppDate + " MST";
        console.log("yyyy-mm-dd txtRAppDate + MST = ", tempDate);
        var rappDate = dateformat(tempDate, 'shortDate');
        console.log("m-d-yyyy appDate=", rappDate);

        // Format time from 24 military, i.e. 17:30 to 9:30pm
        console.log("txtRAppTime= ", req.body.txtRAppTime);
        var tempDteTime = ('2018-01-01' + "T" + req.body.txtRAppTime);
        console.log("2018-01-01 + T + txtRAppTime =", tempDteTime);
        var rappTime = moment.tz(tempDteTime, "America/Phoenix").format('h:ma');
        console.log("moment rappTime= ", rappTime);

        textMsg = rcustomMsg + " " + rstandardMsg + rappDate + " at " + rappTime + "." +
        " If you have any questions please call us at " + rcallback + ". Message sent by " +
            rcustomFrom + " " + rfromGroup;

        console.log(textMsg);

        res.render('preview', { title: textMsg });

    } // if errors
}); // app.post submitrem


app.post('/send', function(req, res, next) {
    console.log("post /send");
    console.log("textMsg = " + textMsg);
    res.render('index');

});

app.get('/home', function(req, res, next) {
    console.log("get /home");
    res.render('index');

});


app.listen(3000, function() {
    console.log('app.js-server started on port 3000');
});
