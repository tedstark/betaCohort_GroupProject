const express = require('express');
const router = express.Router();
const passport = require('passport');
const dialog = require('dialog');

// Bring in models
let ReminderDD = require('../models/reminderdd');

// User Routes
    // DOM: Show Reminder Admin Page
    router.get('/', function(req,res){
      ReminderDD.find({}, function(err, reminderdds){
        if(err){
          console.log(err);
        } else {
            res.render('page_reminderdd', {
                reminderdds:reminderdds,
                title: 'Standard Reminders Admin'
            });
          }
      })
    });

  // POST: Add a Reminder DD to DB
  router.post('/add', function(req,res){
    req.checkBody('reminderMsg', 'Reminder message is required!').notEmpty();
    // Error check and handling
    let errors = req.validationErrors();
    if(errors){
        // For Flash Messages
        res.render('page_reminderdd',{
            errors:errors
        });
    } else {
      // If no errors, create new reminder message in DB
      let reminderdd = new ReminderDD();
      reminderdd.name = req.body.reminderMsg,
      reminderdd.active = true,
      reminderdd.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
            req.flash('success alert-dismissible fade show', 'Reminder message "'+reminderdd.name+'" added!');
            res.redirect('/reminderdd');
          }
      });
    }
  });

  //DOM: Show 'Edit a Reminder' Page
  router.get('/edit/:id', function(req,res){
    ReminderDD.findById(req.params.id, function(err, reminderddFrmDB){
      res.render('page_reminderddedit', {
        reminderddInForm:reminderddFrmDB,
        title: 'Edit a Reminder'
      });
    });
  });

  //POST: Edit a Reminder in the database
  router.post('/edit/:id', function(req,res){
      req.checkBody('reminderMsg', 'Reminder message is required').notEmpty();
      // Error check and handling
      let errors = req.validationErrors();
      if(errors){
          res.render('page_reminderddedit',{
              errors:errors
          });
      } else {
          let reminderdd = {};
            reminderdd.name = req.body.reminderMsg,
            reminderdd.active = true
          let query = {_id:req.params.id};
          ReminderDD.update(query, reminderdd, function (err) {
              if(err){
                  console.log(err);
                  return;
              } else {
                  req.flash('success alert-dismissible fade show', 'Reminder message "'+remainderdd.name+'" updated!');
                  res.redirect('/reminderdd');
                }
          });
      }
  });

  // DELETE: Removes user from database
  router.delete('/delete/:id', function (req,res) {
    let query = {_id:req.params.id}
    ReminderDD.remove(query, function (err) {
      if(err){
        console.log(err);
      } else {
        res.send('Success');
        req.flash('success', 'Reminder message deleted!');
      }
    });
  });


// Export statement
module.exports=router;
