const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in models
let User = require('../models/user');

// User Routes
  // DOM: Show User Login block on page_home.pug
  // router.get('/login',function (req,res) {
  //     res.render('page_userlogin');
  // });

  // // POST: User Login process
  // router.post('/login', function (req,res,next){
  //   passport.authenticate('local', {
  //     successRedirect: '/home',
  //     failureRedirect: '/',
  //     badRequestMessage: 'Please enter username and password.', //Default: Missing credentials
  //     failureFlash: true
  //   })
  //   (req,res,next);
  // })
  //
  // // DOM: Logout and show Home page with Login block
  // router.get('/logout', function (req,res) {
  //     req.logout();
  //     req.flash('success', 'You are logged out!');
  //     res.redirect('/');
  // });

  // DOM: Show 'Add a User' Page
  router.get('/add', function(req,res){
    res.render('page_useradd')
    title: "User Registration"
  })

  // POST: Add a User to DB
  router.post('/add', function(req,res){
    req.checkBody('username', 'User name is required').notEmpty();
    req.checkBody('password', 'A password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    // Error check and handling
    let errors = req.validationErrors();
    if(errors){
        res.render('page_useradd',{
            errors:errors
        });
    } else {
      // If no errors, create new user in DB
      let user = new User();
        user.username = req.body.username,
        user.password = req.body.password,
        user.openpwd = req.body.password,
        user.active = true,
      bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(user.password, salt, function (err, hash) {
              if (err) {
                  console.log(err);
              }
              user.password = hash;
              user.save(function(err){
                if(err){
                  console.log(err);
                  return;
                } else {
                    req.flash('success', 'User '+user.username+' added!');
                    res.redirect('/users/view');
                  }
              });
          });
      })
    }
  });

  //DOM: Show 'User List' Page
  router.get('/view', function(req,res){
    User.find({}, function(err, users){
      if(err){
        console.log(err);
      } else {
        res.render('page_userlist', {
          users: users
        });
      }
    })
  });

  //DOM: Show 'Edit a User' Page
  router.get('/edit/:id', function(req,res){
    User.findById(req.params.id, function(err, user){
      res.render('page_useredit', {
        user:user
      });
    });
  });

  //POST: Edit a User in the database
  router.post('/edit/:id', function(req,res){
    req.checkBody('input_username', 'User name is required').notEmpty();
    req.checkBody('input_password', 'A password is required').notEmpty();
    req.checkBody('input_password2', 'Passwords do not match').equals(req.body.input_password);
    // Error check and handling
    let errors = req.validationErrors();
    if(errors){
        res.render('page_useredit',{
          errors:errors
        });
    } else {
      let user = {};
        user.username = req.body.input_username,
        user.password = req.body.input_password,
        user.openpwd = req.body.input_password,
        user.active = true
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            console.log(err);
            return;
          } else {
            user.password = hash;
            let query = {_id:req.params.id};
            User.update(query, user, function (err) {
              if(err){
                console.log(err);
                return;
              } else {
                  req.flash('success', 'User '+user.username+' Updated!');
                  res.redirect('/users/view/:id');
                }
            });
          }
        });
      })
    }
});
  //DOM: Show a single User page
  router.get('/view/:id', function(req,res){
    User.findById(req.params.id, function(err, user){
      res.render('page_user', {
        user:user,
        username:user.username
      });
    });
  });

  // DELETE: Removes user from database
  router.delete('/delete/:id', function (req,res) {
    let query = {_id:req.params.id}
    User.remove(query, function (err) {
      if(err){
        console.log(err);
      } else {
        res.send('Success');
        req.flash('success', 'User deleted!');
      }
    });
  });


// Export statement
module.exports=router;
