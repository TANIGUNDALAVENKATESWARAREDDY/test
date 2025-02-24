const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    adminfirstname:String,
    adminmiddlename:String,
    adminlastname:String,
    adminregid:String,
    role:String,
    adminspecilizedsubject:String,
    adminDOJ:{
        type:Date,
        default:Date.now
    },
    adminimgurl:String,
    adminemail:String,
    adminmobilenumber:Number,
    adminDOB:Date,
    admingender:String,
    adminmaritalstatus:String,
    admintemporaryaddress:String,
    adminpermanentaddress:String,
    adminhighqualification:String,
    adminifotherquoalification:String,
    adminYOG:Date,
    admingraduationclg:String,
    adminpreviouscompany:String,
    adminpreviousjobrole:String,
    adminprevioussubjobrole:String,
    adminworkexprienceyears:Number,
    adminpreviouskeyresponsibility:String,
    emergencycontantname:String,
    emergencycontactrelationship:String,
    emergencycontactnumber:String,
    emergencycontactemail:String,

});

const adminDatabase = mongoose.model('admins',adminSchema);

module.exports = adminDatabase;