const mongoose = require('mongoose');

//Group Schema
const GroupDDSchema = mongoose.Schema({
    name: {type: String, required: true},
    active: {type: Boolean, required: false}
});

//Export statement
const GroupDD = module.exports = mongoose.model('GroupDD', GroupDDSchema);
