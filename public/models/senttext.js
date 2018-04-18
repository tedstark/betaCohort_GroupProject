const mongoose = require('mongoose');

//Sent Text Schema
const SentTextSchema = mongoose.Schema({
    text: {type: String, required: true},
    client: {type: String, required: true},
    sentdate: {type: String, required: true},
    sid: {type: String, required: true}
});

//Export statement
const SentText = module.exports = mongoose.model('SentText', SentTextSchema);

