const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


require('dotenv').load();

let env = process.env;

// Require the Twilio module and create a REST client
const twilio = require('twilio')(env.TWILIO_SID, env.TWILIO_AUTH);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
    // DOM: Show 'Messages' Page
    router.get('/', function(req,res){
        txtToPhone='';
        txtFullMsg='';
        res.render('page_messages', {
            title: 'Send a Message'
        });
    });

    // DOM: Show Preview Page for Messages
    router.get('/preview', function(req,res){
        res.render('page_preview', {
            title: 'Message Preview'
        });
    });

    // POST: Format Message and show preview page
    router.post('/preview', function(req, res) {
    txtToPhone = req.body.txtClient1;
    txtFullMsg = req.body.txtCustomMsg+' Frm '+req.body.txtCustomFrom+'. '+req.body.txtFromGrp+'. Call '+req.body.txtCallback+' with questions.';
    returnPage = 'messages';

    res.redirect('/messages/preview');
});

    // POST: Send a Message through Twilio service
    router.post('/send', function(req, res) {
        twilio.messages
            .create({
                to: req.body.txtClient1,
                from: env.TWILIO_NUM,
                body: req.body.txtCustomMsg+' Frm '+req.body.txtCustomFrom+'. '+req.body.txtFromGrp+'. Call '+req.body.txtCallback+' with questions.'
            })
            .then(message => console.log(message.sid));
        console.log('Message Sent!');
        res.redirect('/messages');
    });

    module.exports = router;

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
