const classTopicDatabase = require('../classTopics.model/classTopics.mongo');
const classChapterDatabase = require('./classChapters.mongo');

async function addNewChapterToSubject(chapterData){
    try{
        const response = await classChapterDatabase.create({
            class:chapterData.class,
            subjectid:chapterData.subjectid,
            chapteruid:chapterData.chapteruid,
            chaptername:chapterData.chaptername,
            chapternumber:chapterData.chapternumber
        });
        if(response){
            return {success:true,message:'successfully added the chapter'};
        }else{
            return {success:false,message:'error in chapters model'};
        }
    }catch(err){
        console.log('getting error in class chapters model',err);
        return {success:false,message:'error in  chapters model'};
    }
}

async function getAllChaptersOfSubject(classname,subject){
    try{
        const response = await classChapterDatabase.find({subjectid:subject,class:classname});
        if(response){
            return {success:true,allchapters:response,message:'successfully gettin chapters'};
        }else{
            return {success:false,message:'getting error in class chapters mnodel'};
        }
    }catch(err){
        console.log('getting an error in class chapter model',err);
        return {success:false,message:'error in  chapters model'}
    }
}

async function deleteChapterFromASubject(classname,subject,chapterid){
    try{
        const response = await classChapterDatabase.deleteOne({class:classname,subjectid:subject,chapteruid:chapterid});
        const secRes = await classTopicDatabase.deleteMany({class:classname,subjectid:subject,chapterid:chapterid});
        if(response){
            return {success:true,message:'successfully deleted the chapter'};
        }else{
            return {success:false, message:'getting error while deleting the chapter'};
        }

    }catch(err){
        console.log('getting an error in class chapter model',err);
        return {success:false, message:'error in class chapter model'};
    }
}

async function updateAddedChapterToSubject(chapterData){
    try{
        const response = await classChapterDatabase.updateOne({class:chapterData.class,subjectid:chapterData.subjectid,chapteruid:chapterData.chapteruid},{...chapterData});
        if(response){
            return {success:true, message:'successfully updated the chapter'};
        }else{
            return {success:false,message:'error in class chapter model'};
        }
    }catch(err){
        console.log('getting an error in class chapter model ',err);
        return {success:false, message:'error in class chapter model'};
    }
}

module.exports={
    addNewChapterToSubject,
    getAllChaptersOfSubject,
    deleteChapterFromASubject,
    updateAddedChapterToSubject
}