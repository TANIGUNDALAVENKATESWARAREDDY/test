const usersDatabase = require('../users.model/users.mongo');
const teachersdatabase = require('./teachers.mongo');

async function addNewTeacher(teacherData){
    try{
        const secResponse = await usersDatabase.create({
            username:teacherData.teacherregid,//registration number
            email:teacherData.teacheremail,//teachers email
            mobile:teacherData.teachermobilenumber,
            password:teacherData.teachermobilenumber,
            role:'teacher'
        });

        const response = await teachersdatabase.create({
            teacherfirstname:teacherData.teacherfirstname,
            teachersmiddlename:teacherData.teachersmiddlename,
            teacherslastname:teacherData.teacherslastname,
            teacherregid:teacherData.teacherregid,
            role:teacherData.role,
            teacherspecilizedsubject:teacherData.teacherspecilizedsubject,
            teacherDOJ:teacherData.teacherDOJ,
            teacherimgurl:teacherData.teacherimgurl,
            teacheremail:teacherData.teacheremail,
            teachermobilenumber:teacherData.teachermobilenumber,
            teacherDOB:teacherData.teacherDOB,
            teachergender:teacherData.teachergender,
            teachermaritalstatus:teacherData.teachermaritalstatus,
            teachertemporaryaddress:teacherData.teachertemporaryaddress,
            teacherpermanentaddress:teacherData.teacherpermanentaddress,
            teacherhighqualification:teacherData.teacherhighqualification,
            teacherifotherquoalification:teacherData.teacherifotherquoalification,
            teacherYOG:teacherData.teacherYOG,
            teachergraduationclg:teacherData.teachergraduationclg,
            teacherpreviouscompany:teacherData.teacherpreviouscompany,
            teacherpreviousjobrole:teacherData.teacherpreviousjobrole,
            teacherprevioussubjobrole:teacherData.teacherprevioussubjobrole,
            teacherworkexprienceyears:teacherData.teacherworkexprienceyears,
            teacherpreviouskeyresponsibility:teacherData.teacherpreviouskeyresponsibility,
            emergencycontantname:teacherData.emergencycontantname,
            emergencycontactrelationship:teacherData.emergencycontactrelationship,
            emergencycontactnumber:teacherData.emergencycontactnumber,
            emergencycontactemail:teacherData.emergencycontactemail,
        });

        

        if(response && secResponse){
            return {success:true,message:"Successfully added the teacher"};
        }else{
            return {success:false,message:"Error While Adding the Teacher"};
        }
    }catch(err){
        console.log('getting an error in teacher model',err);
        return {success:false,message:"getting an error in teachers model"};
    }
}

async function getAllTeachers(){
    try{
        const response = await teachersdatabase.find({});
        if(response){
            return {success:true,message:"successfully fetched all teachers data ",teachersdata:response};
        }else{
            return {success:false,message:"getting an error while fetching teachers data in model"};
        }
    }catch(err){
        console.log('getting an error in teachers model',err);
        return {success:false,message:"getting an error while fetching teachers data in model"};
    }
}

async function getEachTeacherData(teacherId){
    try{
        const response = await teachersdatabase.findOne({teacherregid:teacherId});
        if(response){
            return {success:true,message:'successfully fetched teacher data',teacherdata:response};
        }else{
            return {success:false,message:'getting error while fetching the teacher data'};
        }
    }catch(err){
        console.log('getting an error in teacher model',err);
        return {success:false,message:'getting an error while fetching teachers data'};
    }
}

module.exports ={
    addNewTeacher,
    getAllTeachers,
    getEachTeacherData
}