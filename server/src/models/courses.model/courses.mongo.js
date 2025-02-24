const mongoose = require('mongoose');

const courseSchema = new  mongoose.Schema({
    courseuid:String,//unique id
    coursecode:String,//subject code
    coursename:String,//subject name
    coursecredits:Number,//subject credits
    coursedescription:String//subject description
});

const coursesdatabase = mongoose.model('courses',courseSchema);
module.exports = coursesdatabase;
