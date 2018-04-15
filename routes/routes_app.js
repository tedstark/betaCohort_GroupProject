const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//App Routes

    // DOM: Show 'Home' Page
    router.get('/login2', function(req,res){
        res.render('page_login2', {
          title: 'Disclaimer'
        });
    });

    // DOM: Show 'Monkey' Page
    router.get('/monkey', function(req,res){
        res.render('monkey', {
            title: 'Monkey Test'
        });
    });

    // DOM: Show 'Preview' Page
    router.get('/preview', function(req,res){
        res.render('page_preview', {
            title: 'Preview Page'
        });
    });
    // // DOM: Show 'Reminders' Page
    // router.get('/reminders', function(req,res){
    //     res.render('page_reminders', {
    //       title: 'Send a Reminder'
    //     });
    // });
    //
    // // DOM: Show 'Messages' Page
    // router.get('/messages', function(req,res){
    //     res.render('page_messages', {
    //       title: 'Send a Message'
    //     });
    // });

    // DOM: Show '/' Page
    router.get('/', function(req,res){
      res.render('page_login', {
        title: 'Login Page'
      });
    });

// Export statement
module.exports=router;
