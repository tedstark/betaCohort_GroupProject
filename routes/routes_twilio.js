const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

require('dotenv').load();

let env = process.env;

// Twilio Configuration
  // Require the Twilio module and create a REST client
  const twilio = require('twilio')(env.TWILIO_SID, env.TWILIO_AUTH);
  const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
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
  router.post('/multimsgs', function(req, res) {
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

  router.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    const message = twiml.message();
    message.body('This number does not accept messages. Please use the callback # mentioned in the text message you recieved. Thank you!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
module.exports = router;
