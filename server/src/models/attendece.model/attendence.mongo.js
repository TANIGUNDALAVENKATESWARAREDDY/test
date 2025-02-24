const mongoose = require('mongoose');

attendenceSchema = new mongoose.Schema({
    studentid:String,//1 => 40bytes
    class:String,//2 => 12bytes
    subjectid:String,//3 =>40bytes
    sectionid:String,//4 =>40bytes
    date:String,//5 =>20bytes
    status:{
        type:String,
        enum:['present','absent'],
        required:true
    },//6 =>15bytes
    markedby:String,//7 => 40 bytes
    period:String,//8 =>10bytes
    periodstarttime:String,//9 =>20bytes
    periodendtime:String,//10 =>20bytes
    month:String,//11 =>10bytes
    year:String,//12 =>10bytes
});

attendenceSchema.index({studentid:1,class:1});
attendenceSchema.index({studentid:1,class:1,date:1});
attendenceSchema.index({class:1,studentid:1,subjectid:1});
attendenceSchema.index({class:1,studentid:1,subjectid:1,status:1});


// attendenceSchema.index({month:1});
// attendenceSchema.index({year:1});
function createAttendencDatabase(classId){
    return mongoose.model(`class${classId}`,attendenceSchema);

}

module.exports = createAttendencDatabase;