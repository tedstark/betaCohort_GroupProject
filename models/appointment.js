const mongoose = require('mongoose');

//Appointment Schema
const AppointmentSchema = mongoose.Schema({
  name: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  notification : {type: Number, required: true},
  timeZone: {type: String, required: true},
  time : {type:Date, index:true}
});

//Export statement
const Appointment = module.exports = mongoose.model('Appointment', AppointmentSchema);
