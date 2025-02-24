const mongoose = require('mongoose');

const teacherClassesSchema = new mongoose.Schema({
    day:String,
    teacherid:String,
    class:String,
    sectionid:String,
    subjectid:String,
    period:String,
    starttime:String,
    endtime:String,
    startduration:Number,
    endduration:Number
});
teacherClassesSchema.index({day:1,teacherid:1,startduration:1,endduration:1});
teacherClassesSchema.index({day:1,class:1,sectionid:1,period:1});

const teacherClassesDatabase = mongoose.model('teacherClasses',teacherClassesSchema);

module.exports = teacherClassesDatabase;