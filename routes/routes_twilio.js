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
    // POST: Send a Message/Reminder
    router.post('/send', function(req, res) {
        twilio.messages
            .create({
                to: req.body.previewPhone,
                from: env.TWILIO_NUM,
                body: req.body.previewMessage
            })
            .then(message => console.log('Text Sent: '+message.sid));
        req.flash('success alert-dismissible fade show', 'Your Reminder/Message was sent!');
        res.redirect('/'+returnPage);
    });

    // POST: Auto response from application for received text messages
    router.post('/sms', (req, res) => {
        const twiml = new MessagingResponse();
        const message = twiml.message();
        message.body('This number does not accept messages or calls. Please use the callback # in the text you received from FSWF. Thank you!');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    });

module.exports = router;

    // POST: Send a Reminder
    // router.post('/reminders', function(req, res) {
    //     let frmtdDate = dateformat((req.body.txtApptDate + ' MST'), 'shortDate');
    //     let tempTime = ('2018-01-01' + "T" + req.body.txtApptTime);
    //     let frmtTime = moment.tz(tempTime, "America/Phoenix").format('h:mm a');
    //     twilio.messages
    //         .create({
    //             to: req.body.txtClient1,
    //             from: '+16027867178',
    //             body: req.body.txtStdRmndr+' '+req.body.txtCustomRem+' Your appt is '+frmtdDate+', '+frmtTime+'. Frm '+req.body.txtCustomFrom+', '+req.body.txtFromGrp+'. Call '+req.body.txtCallback+' to make changes to your appt.'
    //         })
    //         .then(message => console.log(message.sid));
    //     console.log('Reminder Sent!');
    //     res.redirect('/reminders');
    // });

    // // POST: Send a Message
    // router.post('/messages', function(req, res) {
    //     twilio.messages
    //         .create({
    //             to: req.body.txtClient1,
    //             from: '+16027867178',
    //             body: req.body.txtCustomMsg+' Frm '+req.body.txtCustomFrom+'. '+req.body.txtFromGrp+'. Call '+req.body.txtCallback+' with questions.'
    //         })
    //         .then(message => console.log(message.sid));
    //     console.log('Message Sent!');
    //     res.redirect('/messages');
    // });
