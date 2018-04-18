const mongoose = require('mongoose');

//Reminder Schema
const SentTextSchema = mongoose.Schema({
    txtPhone: {type: String, required: true},
    txtBody: {type: String, required: true},
    userName: {type: String, required: true},
    sentDate: {type: Date, required: true},
    twilioSID: {type: String, required: false},
    twilioStatus: {type: String, required: false}
});

//Export statement
const SentText = module.exports = mongoose.model('SentText', SentTextSchema);
