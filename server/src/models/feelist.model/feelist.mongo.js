const mongoose = require('mongoose');

const feelistSchema = new mongoose.Schema({
    class:String,
    fee:Number
});

const feelistdatabase = mongoose.model('feelist',feelistSchema);
module.exports = feelistdatabase;