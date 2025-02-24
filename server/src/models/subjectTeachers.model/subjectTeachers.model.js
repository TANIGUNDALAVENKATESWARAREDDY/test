const subjectTeachersDatabase  = require('./subjectTeachers.mongo');

async function addTeacherToSubject(teacherData){
    try{
        const findres = await subjectTeachersDatabase.findOne({subjectid:teacherData.subjectid,teacherid:teacherData.teacherid});
        if(findres===null){
            const response = await subjectTeachersDatabase.create({
                subjectid:teacherData.subjectid,
                teacherid:teacherData.teacherid
            });
    
            if(response){
                return {success:true,message:'successfully added the teacher'};
            }else{
                return {success:false,message:'error in subject teacher model'};
            }
        }else{
            return {success:false, message:'already teacher added to the subject'};
        }
        
    }catch(err){
        console.log('getting an error in add subject teacher model',err);
        return {success:false,message:'error in subjectteacher model'};
    }
}

async function deleteTeacherOfASubject(subject,teacher){
    try{
        const response = await subjectTeachersDatabase.deleteOne({subjectid:subject,teacherid:teacher});
        if(response){
            return {success:true,message:'successfully deleted'};
        }else{
            return {success:false,message:'error while deleting'};
        }
    }catch(err){
        console.log('getting an error while deleting in subjectTeachers model: ',err);
        return {success:true,message:'error in subjectTeachers model'};
    }
}

async function getAllSubjectTeachers(){
    try{
        const response = await subjectTeachersDatabase.find({});
        if(response){
            return {success:true,message:'successfully fetched',allSubTeachersData:response}
        }else{
            return {success:false,message:'error while fetching'};
        }
    }catch(err){

    }

}

module.exports={
    addTeacherToSubject,
    deleteTeacherOfASubject,
    getAllSubjectTeachers
}