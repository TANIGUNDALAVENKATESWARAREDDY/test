const mongoose = require('mongoose');
const teachersSchema = new mongoose.Schema({
    teacherfirstname:String,
    teachersmiddlename:String,
    teacherslastname:String,
    teacherregid:String,
    role:String,
    teacherspecilizedsubject:String,
    teacherDOJ:{
        type:Date,
        default:Date.now
    },
    teacherimgurl:String,
    teacheremail:String,
    teachermobilenumber:Number,
    teacherDOB:Date,
    teachergender:String,
    teachermaritalstatus:String,
    teachertemporaryaddress:String,
    teacherpermanentaddress:String,
    teacherhighqualification:String,
    teacherifotherquoalification:String,
    teacherYOG:Date,
    teachergraduationclg:String,
    teacherpreviouscompany:String,
    teacherpreviousjobrole:String,
    teacherprevioussubjobrole:String,
    teacherworkexprienceyears:Number,
    teacherpreviouskeyresponsibility:String,
    emergencycontantname:String,
    emergencycontactrelationship:String,
    emergencycontactnumber:String,
    emergencycontactemail:String,
});

const teachersdatabase = mongoose.model('teachers',teachersSchema);
module.exports = teachersdatabase;