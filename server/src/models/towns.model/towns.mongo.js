const mongoose = require('mongoose');
const townsSchema = new mongoose.Schema({
    townid:{
        type:String,
        required:true,
        unique:true
    },
    townname:String,
    towntransportfee:Number
});
townsSchema.index({townid:1});
const townsDatabase = mongoose.model('towns',townsSchema);
module.exports = townsDatabase;