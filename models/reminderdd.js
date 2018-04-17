const mongoose = require('mongoose');

//Reminder Schema
const ReminderDDSchema = mongoose.Schema({
    name: {type: String, required: true},
    active: {type: Boolean, required: false}
});

//Export statement
const ReminderDD = module.exports = mongoose.model('ReminderDD', ReminderDDSchema);
