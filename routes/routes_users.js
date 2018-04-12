const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const dialog = require('dialog');

// Bring in models
let User = require('../models/user');

// User Routes
  // DOM: Show 'Add a User' Page
  router.get('/add', function(req,res){
    res.render('page_useradd', {
      title: 'Add a User'
    })
  })

  // POST: Add a User to DB
  router.post('/add', function(req,res){
    req.checkBody('username', 'User name is required').notEmpty();
    req.checkBody('role', 'User role is required').notEmpty();
    req.checkBody('password', 'A password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    // Error check and handling
    let errors = req.validationErrors();
    if(errors){
      // For Flash Messages
        // res.render('page_useradd',{
        //     errors:errors
      // For Dialog popup window
        let string = ''
        for (i in errors) {
          string+=errors[i].msg+'\n'
        }
        dialog.info(string);
    } else {
      // If no errors, create new user in DB
      let user = new User();
        user.username = req.body.username,
        user.password = req.body.password,
        user.role = req.body.role,
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
                    res.redirect('/users/list');
                  }
              });
          });
      })
    }
  });

  //DOM: Show 'User List' Page
  router.get('/list', function(req,res){
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
    User.findById(req.params.id, function(err, userFrmDB){
      res.render('page_useredit', {userInForm:userFrmDB});
    });
  });

  //POST: Edit a User in the database
  router.post('/edit/:id', function(req,res){
    req.checkBody('username', 'User name is required').notEmpty();
    req.checkBody('role', 'User role is required').notEmpty();
    req.checkBody('password', 'A password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    // Error check and handling
    let errors = req.validationErrors();
    if(errors){
        res.render('page_useredit',{
          errors:errors
        });
    } else {
      let user = {};
        user.username = req.body.username,
        user.password = req.body.password,
        user.role = req.body.role,
        user.openpwd = req.body.password,
        user.active = true,
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
                  res.redirect('/users/list');
                }
            });
          }
        });
      })
    }
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
