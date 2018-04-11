const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in models
let User = require('../models/user');

// User Routes
    // DOM: Show User Login block on page_home.pug
    router.get('/disclaimer',function (req,res) {
      res.render('page_login2');
    });

    // DOM: User logout process; shows Home page with Login block upon logout
    router.get('/logout', function (req,res) {
        req.logout();
        req.flash('success', 'You are logged out!');
        res.redirect('/');
    });

    // POST: User Login process
    router.post('/', function (req,res,next){
      passport.authenticate('local', {
        successRedirect: '/login/disclaimer',
        failureRedirect: '/',
        badRequestMessage: 'Please enter username and password.', //Default: Missing credentials
        failureFlash: true
      })
      (req,res,next);
    })

// Export statement
module.exports=router;
