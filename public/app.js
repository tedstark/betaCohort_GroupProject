const express = require('express');
const bodyParser = require('body-parser');
const expresValidator = require('express-validator');
const app = express();
const path = require('path');
const dateformat = require('dateformat');
const moment = require('moment-timezone');

//const popupS = require('popups');

// Global Vars
app.use(function(req, res, next){
   res.locals.errors = "";
   res.locals.textMsg = "";
   res.locals.errors = "";
   res.locals.customMsg = "";
   res.locals.customFrom = "";
   res.locals.fromGroup = "";
   res.locals.callback = "";
   res.locals.client = "";
   res.locals.appDate ="";
   res.locals.appTime = "";

   next();
});

app.use(express.static('public/images'));

app.get('/css/style.css', function(req, res){
    res.sendFile(__dirname + '/css/style.css');
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
   res.render('message');
});

app.post('/msg/add', function(req, res){

    req.checkBody('txtCustomMsg', 'Custom message is required').notEmpty();
    req.checkBody('txtCallback', 'Custom message is required').notEmpty();
    req.checkBody('txtClient', 'Client number is required').notEmpty();

    errors = req.validationErrors();
    var err1 = errors.txtCustomMsg;
    var err2 = errors.txtCallback;
    var err3 = errors.txtClient;

    if (errors) {
        errmsgs = "Error: Must provide all required fields";
        console.log(errmsgs);

       // console.log("errors.txtCustomMsg:" + err1);
      //  console.log("errors.txtCallback:" + err2);
       // console.log("errors.txtClient:" + err3);


        //for (let i = 0; i < 3; i++) {
        //     errmsgs = errmsgs + " " + errors(i);
        //}
        //res.render('message',{
        //  err: errors,
        //});

    } else {

        customMsg = req.body.txtCustomMsg;
        customFrom = req.body.txtCustomFrom;
        fromGroup = req.body.txtFromGroup;
        callback = req.body.txtCallback;
        client = req.body.txtClient;

        // Format date from yyyy-mm-dd to m-d-yy
        var tempDate = req.body.txtAppDate + " MST";
        console.log("yyyy-mm-dd txtAppDate + MST = ", tempDate);
        appDate = dateformat(tempDate, 'shortDate');
        console.log("m-d-yyyy appDate=", appDate);

        // Format time from 24 military, i.e. 17:30 to 9:30pm
        console.log("txtAppTime= ", req.body.txtAppTime);
        var tempDteTime = req.body.txtAppDate + "T" + req.body.txtAppTime + ":00";
        console.log("txtAppDate + T + txtAppTime + :00 =", tempDteTime);
        appTime = moment.tz(tempDteTime, "America/Phoenix").format('h:ma');
        console.log("moment appTime= ", appTime);

        textMsg = customMsg + " " + "Reminder for your appointment on " + appDate + " at " + appTime + "."
            " If you have any questions please call us at " +
            callback + ". Message sent by " + customFrom + " " + fromGroup;

        console.log(textMsg);
    }
});

app.listen(3000, function() {
    console.log('app.js-server started on port 3000');
});
