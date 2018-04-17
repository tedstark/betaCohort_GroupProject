const express = require('express');
const router = express.Router();
const passport = require('passport');
const dialog = require('dialog');

// Bring in models
let GroupDD = require('../models/groupdd');

// User Routes
    // DOM: Show Group Admin Page
    router.get('/', function(req,res){
      GroupDD.find({}, function(err, groupdds){
        if(err){
          console.log(err);
        } else {
            res.render('page_groupdd', {
                groupdds:groupdds,
                title: 'Workgroup Admin'
            });
          }
      })
    });

  // POST: Add a Group Dropdown to DB
  router.post('/add', function(req,res){
    req.checkBody('groupName', 'Workgroup name is required').notEmpty();
    // Error check and handling
    let errors = req.validationErrors();
    if(errors){
        // For Flash Messages
        res.render('page_groupdd',{
            errors:errors
        });
    } else {
      // If no errors, create new Group name in DB
      let groupdd = new GroupDD();
      groupdd.name = req.body.groupName,
      groupdd.active = true,
      groupdd.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
            req.flash('success alert-dismissible fade show', 'Workgroup "'+groupdd.name+'" added!');
            res.redirect('/groupdd');
          }
      });
    }
  });

  //DOM: Show 'Edit a Group' Page
  router.get('/edit/:id', function(req,res){
    GroupDD.findById(req.params.id, function(err, groupddFrmDB){
      res.render('page_groupddedit', {groupddInForm:groupddFrmDB});
    });
  });

  //POST: Edit a Group in the database
  router.post('/edit/:id', function(req,res){
      req.checkBody('groupName', 'Workgroup name is required').notEmpty();
      // Error check and handling
      let errors = req.validationErrors();
      if(errors){
          res.render('page_groupddedit',{
              errors:errors
          });
      } else {
          let groupdd = {};
            groupdd.name = req.body.groupName,
            groupdd.active = true
          let query = {_id:req.params.id};
          GroupDD.update(query, groupdd, function (err) {
              if(err){
                  console.log(err);
                  return;
              } else {
                  req.flash('success alert-dismissible fade show', 'Workgroup "'+groupdd.name+'" Updated!');
                  res.redirect('/groupdd');
                }
          });
      }
  });

  // DELETE: Removes user from database
  router.delete('/delete/:id', function (req,res) {
    let query = {_id:req.params.id}
    GroupDD.remove(query, function (err) {
      if(err){
        console.log(err);
      } else {
        res.send('Success');
        req.flash('success', 'Workgroup deleted!');
      }
    });
  });


// Export statement
module.exports=router;
