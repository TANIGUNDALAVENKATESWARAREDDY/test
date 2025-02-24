const classTopicDatabase = require('./classTopics.mongo');

async function AddNewTopicToChapter(topicData){
    try{
        const response = await classTopicDatabase.create({
            class:topicData.class,
            subjectid:topicData.subjectid,
            chapterid:topicData.chapterid,
            topicuid:topicData.topicuid,
            topicname:topicData.topicname,
            topicnumber:topicData.topicnumber,
            uploadtype:topicData.uploadtype,
            topiclink:topicData.topiclink,
            topicgeneratedurl:topicData.topicgeneratedurl
        });
        if(response){
            return {success:true, message:'successfully added the topic'};
        }else{
            return {success:false, message:'error in topics model'};
        }
    }catch(err){
        console.error('getting error in topics model',err);
        return {success:false, message:'getting error in topics model'};
    }
}

async function GetAllAddedTopicsOfChapter(classname,subject, chapter){
    try{
        const response = await classTopicDatabase.find({class:classname, subjectid:subject, chapterid:chapter});
        if(response){
            return {success:true, alltopics:response, message:'successfully fetched all topics'};
        }else{
            return {success:false, message:'getting error in topics model'};
        }
    }catch(err){
        console.error('getting error in topics model',err);
        return {success:false, message:'getting error in topics model'};
    }
}

async function DeleteAddedTopicOfAChapter(classname,subject, chapter,topic){
    try{
        const response = await classTopicDatabase.deleteOne({class:classname, subjectid:subject , chapterid:chapter , topicuid:topic});
        if(response){
            return {success:true, message:'successfully deleted the topic'};
        }else{
            return {success:false, message:'error while deleting topic in model'};
        }
    }catch(err){
        console.error('getting error in topics model',err);
        return {success:false, message:'getting error in topics model'};
    }
}

async function EditAddedTopicOfAChapter(classname,subject, chapter,topic,topicData){
    try{
        const response = await classTopicDatabase.updateOne({class:classname, subjectid:subject , chapterid:chapter , topicuid:topic},{
            class:topicData.class,
            subjectid:topicData.subjectid,
            chapterid:topicData.chapterid,
            topicuid:topicData.topicuid,
            topicname:topicData.topicname,
            topicnumber:topicData.topicnumber,
            uploadtype:topicData.uploadtype,
            topiclink:topicData.topiclink,
            topicgeneratedurl:topicData.topicgeneratedurl
        });
        if(response){
            return {success:true, message:'successfully edited the topic'};
        }else{
            return {success:false, message:'error while editing topic in model'};
        }
    }catch(err){
        console.error('getting error in topics model',err);
        return {success:false, message:'getting error in topics model'};
    }
}

module.exports={
    AddNewTopicToChapter,
    GetAllAddedTopicsOfChapter,
    DeleteAddedTopicOfAChapter,
    EditAddedTopicOfAChapter
};