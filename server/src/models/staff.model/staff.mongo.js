const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    stafffirstname:String,
    staffmiddlename:String,
    stafflastname:String,
    staffregid:{
        type: String,
        unique: true,
        required: true,
        index: true
    },
    role:String,
    staffDOJ:{
        type:Date,
        default:Date.now
    },
    staffimgurl:String,
    staffemail:String,
    staffmobilenumber:Number,
    staffDOB:Date,
    staffgender:String,
    staffmaritalstatus:String,
    stafftemporaryaddress:String,
    staffpermanentaddress:String,
    staffhighqualification:String,
    staffpreviouswork:String,//just take input
    staffpreviousrole:String,
    staffworkexperienceyears:Number,
    emergencycontactname:String,
    emergencycontactrelationship:String,
    emergencycontactnumber:Number,
    emergencycontactemail:String
});

const staffDatabase = mongoose.model('staffs',staffSchema);
module.exports =  staffDatabase;