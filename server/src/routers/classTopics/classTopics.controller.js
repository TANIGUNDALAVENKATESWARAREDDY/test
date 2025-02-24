const { AddNewTopicToChapter, GetAllAddedTopicsOfChapter, DeleteAddedTopicOfAChapter, EditAddedTopicOfAChapter } = require( "../../models/classTopics.model/classTopics.model");
const { getSocketIO } = require("../../utils/socket");

async function AddTopicController(req,res){
    try{
        const result = await AddNewTopicToChapter(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('addNewTopicToChapter',{data:req.body});
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.error('getting an error in topic controller',err);
        return res.status(500).json({success:false, message:'getting an errorin topics controller'});
    }
}


async function GetAllTopicsController(req,res){
    try{
        const result = await GetAllAddedTopicsOfChapter(req.params.classid,req.params.subjectid,req.params.chapterid);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.error('getting an error in topic controller',err);
        return res.status(500).json({success:false, message:'getting an errorin topics controller'});
    }
}

async function DeleteTopicController(req,res){
    try{
        const result = await DeleteAddedTopicOfAChapter(req.params.classid,req.params.subjectid,req.params.chapterid,req.params.topicid);
        if(result.success){
            const io = getSocketIO();
            io.emit('deleteTopicToChapter',{data:{
                classid:req.params.classid,
                subjectid:req.params.subjectid,
                chapterid:req.params.chapterid,
                topicuid:req.params.topicid
            }});
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.error('getting an error in topic controller',err);
        return res.status(500).json({success:false, message:'getting an errorin topics controller'});
    }
}

async function EditTopicController(req,res){
    try{
        const result = await EditAddedTopicOfAChapter(req.params.classid,req.params.subjectid,req.params.chapterid,req.params.topicid,req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('editTopicToChapter',{data:req.body});
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.error('getting an error in topic controller',err);
        return res.status(500).json({success:false, message:'getting an errorin topics controller'});
    }
}

module.exports={
    AddTopicController,
    GetAllTopicsController,
    DeleteTopicController,
    EditTopicController
}

