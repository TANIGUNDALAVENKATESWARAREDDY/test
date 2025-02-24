const classSubjectsDatabase = require('./classSubjects.mongo');

async function AddSubjectToClass(subjectData){
    try{
        const response1 = await classSubjectsDatabase.findOne({class:subjectData.class,subjectid:subjectData.subjectid});
        if(response1===null){
            const response = await classSubjectsDatabase.create({
                class:subjectData.class,
                subjectid:subjectData.subjectid
            });
            if(response){
                return {success:true,message:'successfully added the subject'};
            }else{
                return {success:false,message:"getting error while adding subject"};
            }
        }else{
            return {success:false, message:'already subject added to class'};
        }
        

    }catch(err){
        console.log('getting error in class subjects model',err);
        return {success:false,message:"gettting an error in subjects model"};
    }
}

async function getClassesSubjects(){
    try{
        const response = await classSubjectsDatabase.find({});
        if(response){
            return {success:true,message:'successfully fetched the data', classsubjects:response};
        }else{
            return {success:true,message:'Error while fetching the data'};
        }
    }catch(err){
        console.log('getting error in class subjects model',err);
        return {success:false, message:'getting an error while fetching the all classes subjects'};
    }
}

async function deleteClassSubject(classname,subjectid){
    try{
        const response = await classSubjectsDatabase.deleteOne({class:classname,subjectid:subjectid});
        if(response){
            return {success:true, message:"successfully deleted the subject"};
        }else{
            return {success:false,message:"error when deleting the subject"};
        }
    }catch(err){
        console.log('getting an error in class subjects model',err);
        return {success:false, message:'getting an error in class subjects model'};
    }
}

module.exports={
    AddSubjectToClass,
    getClassesSubjects,
    deleteClassSubject
}