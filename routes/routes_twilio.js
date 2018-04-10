const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Secure Twilio Credentials
require('dotenv').load();
let env = process.env;

// require the Twilio module and create a REST client
const twilio = require('twilio')(env.TWILIO_SID, env.TWILIO_AUTH);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// GET: Show 'Messages' Page
router.get('/messages', function(req,res){
    res.render('page_messages', {
        title: 'Send a Message'
    });
});

// GET: Show 'Reminders' Page
router.get('/reminders', function(req,res){
    res.render('page_reminders', {
        title: 'Send a Reminder'
    });
});

// POST: Send a Message
router.post('/messages', function(req, res) {
    twilio.messages
        .create({
            to: '+1'+req.body.txtClient,
            from: '+16027867178',
            body: req.body.txtCustomMsg+'  From: '+req.body.txtCustomFrom+ ' with '+req.body.txtFromGrp+'. Please call '+req.body.txtCallback+' to cancel or change your appt.',
        })
        .then(message => console.log(message.sid));
    console.log('Submitted!');
    res.redirect('/twilio/messages');
});

// POST: Send several Messages
router.post('/moremessages', function(req, res) {
    // var values = $('.msgToNum').map(function() {return this.value; }).get();
    const numbers = ['+16236403640', '+14802720635', '+14804131123', '+16232524833']
    for (i in numbers) {
      console.log(numbers[i]);
      twilio.messages
        .create(
          {
            to: numbers[i],
            from: 'MG1eadb76e27a933ad7fff82a0a3af7313',
            body: '**DO NOT REPLY** Hey Team. I figured out how to send to multiple numbers at once through Twilio. This was sent to all of you via one POST route.'
          }
      )
        .then(message => {
          console.log(message.sid);
          console.log('Submitted!');
        });
      }
    res.redirect('/twilio/messages');
});

module.exports = router;
