const mongoose = require('mongoose');

const uuidSchema = new mongoose.Schema({
    uid:String,
    adminc:Number,
    feeinc:Number
});

const uuiddatabase = mongoose.model('uuids',uuidSchema);
module.exports = uuiddatabase;