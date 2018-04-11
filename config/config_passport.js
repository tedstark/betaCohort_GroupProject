var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var bcrypt = require('bcryptjs');

module.exports = function(passport){
  //local strategy implementation
  passport.use(new localStrategy(function(username, password, done){
    //Match single userName
    let query = {username:username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null,false, {message: 'Username not found!'});
      }
      //Match password with Database
      bcrypt.compare(password,user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Wrong password!'});
        }
      });
    });
  }));
  //Serialize User
  passport.serializeUser(function (user, done) {
      done(null, user.id);
  });
  //Deserialize User
  passport.deserializeUser(function (id, done) {
      User.findById(id, function (err,user) {
          done(err,user);
      });
  });
};
