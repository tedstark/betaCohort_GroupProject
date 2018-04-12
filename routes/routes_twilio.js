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
                to: req.body.txtClient1,
                from: '+16027867178',
                body: req.body.txtCustomMsg+'| Frm '+req.body.txtCustomFrom+' w/ '+req.body.txtFromGrp+'. Call '+req.body.txtCallback+' to make changes to your appt.',
            })
            .then(message => console.log(message.sid));
        console.log(message)
        console.log('Submitted!');
        res.redirect('/messages');
    });

  // POST: Send several Messages
  // router.post('/multimsgs', function(req, res) {
  //     // var values = $('.msgToNum').map(function() {return this.value; }).get();
  //     let numbers = ['+1'+req.body.txtClient1,'+1'+req.body.txtClient2,'+1'+req.body.txtClient3,'+1'+req.body.txtClient4, '+1'+req.body.txtClient5]
  //     for (i in numbers) {
  //       twilio.messages
  //         .create(
  //           {
  //             to: numbers[i],
  //             from: 'MG1eadb76e27a933ad7fff82a0a3af7313',
  //             body: 'Multi-message testing'
  //           }
  //       )
  //         .then(message => {
  //           console.log(message);
  //           console.log('Submitted!');
  //         });
  //       }
  //     res.redirect('/messages');
  // });

    // POST: Send several Messages
//     router.post('/multimsgs', function(req, res) {
//         let numbers = [req.body.txtClient1,req.body.txtClient2,req.body.txtClient3,req.body.txtClient4,req.body.txtClient5];
//         Promise.all(
//             numbers.map(number => {
//                 return twilio.messages.create({
//                     to: number,
//                     from: 'MG1eadb76e27a933ad7fff82a0a3af7313',
//                     body: 'Multi-message testing'
//                 });
//             })
//         )
//             .then(messages => {
//                 console.log(message);
//                 console.log('Messages sent!');
//             })
//             .catch(err => console.error(err));
//         res.redirect('/messages');
//     });

  router.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    const message = twiml.message();
    message.body('This number does not accept messages or calls. Please use the callback # in the message you received. Thank you!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
module.exports = router;
