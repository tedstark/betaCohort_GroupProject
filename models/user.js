const mongoose = require('mongoose');

//User Schema
const UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  openpwd: {type: String, required: false},
  active: {type: Boolean, required: true}
});

//Export statement
const User = module.exports = mongoose.model('User', UserSchema);
