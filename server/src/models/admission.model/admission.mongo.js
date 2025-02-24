const mongoose = require('mongoose');
//admission form schema we will write here
const admissionSchema =  new mongoose.Schema({
    academicyear:{
        type:String,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    studentname:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        default:Date.now,
    },
    age:Number,
    placeofbirth:String,
    nationality:String,
    nameofps:String,
    admstatus:String,
    parentregid:String,
    stdregid:String,
    fathername:{
        type:String,
        required:true
    },
    mothername:{
        type:String,
        required:true
    },
    mobileno:{
        type:Number,
        required:true
    },
    altmobileno:Number,
    emailid:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:String,
    pincode:{
        type:Number,
        required:true
    },
    admissionid:{
        type:Number,
        required:true
    },
    dateofsub:{
        type:Date,
        default:Date.now
    },
    appstatus:{
        type:String,
        default:"pending"
    },

    admamtpaidornot:Boolean
});

const admissionsdatabase = mongoose.model('admissions',admissionSchema);
module.exports = admissionsdatabase;