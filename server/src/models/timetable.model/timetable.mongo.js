const mongoose = require('mongoose');

const periodSchema =new mongoose.Schema({
    subjectid:String,
    teacherid:String
});

const daySchema = new mongoose.Schema({
    period1:periodSchema,
    period2:periodSchema,
    period3:periodSchema,
    period4:periodSchema,
    period5:periodSchema,
    period6:periodSchema,
    period7:periodSchema,
    period8:periodSchema,
    period9:periodSchema,
    period10:periodSchema
});


const timetableSchema = new mongoose.Schema({
    class:String,
    sectionid:String,
    totalperiods:Number,
    totalbreaks:Number,
    break1:{
        starttime:String,
        endtime:String,
        duration:Number
    },
    break2:{
        starttime:String,
        endtime:String,
        duration:Number
    },
    break3:{
        starttime:String,
        endtime:String,
        duration:Number
    },
    lunchbreak:{
        starttime:String,
        endtime:String,
        duration:Number
    },
    period1:{starttime:String,endtime:String,duration:Number},
    period2:{starttime:String,endtime:String,duration:Number},
    period3:{starttime:String,endtime:String,duration:Number},
    period4:{starttime:String,endtime:String,duration:Number},
    period5:{starttime:String,endtime:String,duration:Number},
    period6:{starttime:String,endtime:String,duration:Number},
    period7:{starttime:String,endtime:String,duration:Number},
    period8:{starttime:String,endtime:String,duration:Number},
    period9:{starttime:String,endtime:String,duration:Number},
    period10:{starttime:String,endtime:String,duration:Number},
    monday:daySchema,
    tuesday:daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema
});

const timetabledatabase = mongoose.model('timetable',timetableSchema);
module.exports = timetabledatabase;