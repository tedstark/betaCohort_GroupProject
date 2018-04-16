const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dateformat = require('dateformat');
const moment = require('moment-timezone');

require('dotenv').load();

let env = process.env;

// Require the Twilio module and create a REST client
const twilio = require('twilio')(env.TWILIO_SID, env.TWILIO_AUTH);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
    // DOM: Show 'Reminders' Page
    router.get('/', function(req,res){
        txtToPhone='';
        txtFullMsg='';
        res.render('page_reminders', {
            title: 'Send a Reminder'
        });
    });

//     // DOM: Show Preview Page for Reminder
    router.get('/preview', function(req,res){
        res.render('page_preview', {
            title: 'Reminder Preview'
        });
    });
//
// POST: Format Reminder message and show preview page
    router.post('/preview', function(req, res) {
        // Do data validation
        // req.checkBody('txtStdRmndr', 'Standard reminder is required').notEmpty();
        // req.checkBody('txtApptDate', 'Appt. Date is required').notEmpty();
        // req.checkBody('txtApptTime', 'Appt. Time is required').notEmpty();
        // req.checkBody('txtFromGrp', 'Group is required').notEmpty();
        // req.checkBody('txtClient1', 'Client Phone # is required').notEmpty();
        // req.checkBody('txtCallback', 'Callback # is required').notEmpty();
        // let errors = req.validationErrors();

        let frmtdDate = dateformat((req.body.txtApptDate + ' MST'), 'shortDate');
        let tempTime = ('2018-01-01' + "T" + req.body.txtApptTime);
        let frmtdTime = moment.tz(tempTime, "America/Phoenix").format('h:mm a');

        txtToPhone = req.body.txtClient1;
        txtFullMsg = req.body.txtStdRmndr+' '+req.body.txtCstmRmndr+' Your appt is '+frmtdDate+', '+frmtdTime+'. Frm '+req.body.txtCustomFrom+' '+req.body.txtFromGrp+'. Call '+req.body.txtCallback+' to make changes to your appt.';
        returnPage = 'reminders';

        res.redirect('/reminders/preview');
    });

    // POST: Send a Reminder through Twilio service
    router.post('/send', function(req, res) {
        let frmtdDate = dateformat((req.body.txtApptDate + ' MST'), 'shortDate');
        let tempTime = ('2018-01-01' + "T" + req.body.txtApptTime);
        let frmtTime = moment.tz(tempTime, "America/Phoenix").format('h:mm a');
        twilio.messages
            .create({
                to: req.body.txtClient1,
                from: env.TWILIO_NUM,
                body: req.body.txtStdRmndr+' '+req.body.txtCstmRmndr+' Your appt is '+frmtdDate+', '+frmtTime+'. Frm '+req.body.txtCustomFrom+', '+req.body.txtFromGrp+'. Call '+req.body.txtCallback+' to make changes to your appt.'
            })
            .then(message => console.log(message.sid));
        console.log('Reminder Sent!');
        res.redirect('/reminders');
    });

module.exports = router;
