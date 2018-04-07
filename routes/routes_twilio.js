var express = require('express');
var router = express.Router();

// Secure sensitive info in environment file
// require('dotenv').config();
// var env = process.env;

// Twilio Credentials
const accountSid = '';
const authToken = '';
// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_AUTH;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

/* GET twilio message send. */
router.post('/', function(req, res) {
        client.messages
            .create({
                to: '+16232524833',
                from: '+16027867178',
                body: 'Hello! This is from our FSWF application!',
            })
            .then(message => console.log(message.sid));
    });

router.get('/records', function (req,res) {
    client.usage.records.today
        .each({category: 'sms'}, (record) => console.log(record.usage));
});

module.exports = router;
