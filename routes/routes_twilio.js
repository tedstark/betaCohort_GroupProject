const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Secure Twilio Credentials
require('dotenv').load();
let env = process.env;

// require the Twilio module and create a REST client
const client = require('twilio')(env.TWILIO_SID, env.TWILIO_AUTH);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// GET: Show 'Messages' Page
router.get('/messages', function(req,res){
    res.render('page_messages', {
        title: 'Send a Message'
    });
});


// POST: Send a Message
router.post('/messages', function(req, res) {
    client.messages
        .create({
            to: '+1'+req.body.msgToNum,
            from: '+16027867178',
            body: req.body.msgCustom+'  From: '+req.body.msgFrom+' Please call '+req.body.msgCBkNum+' with any changes.',
        })
        .then(message => console.log(message.sid));
    console.log('Submitted!')
    res.redirect('/twilio/messages');
});

module.exports = router;
