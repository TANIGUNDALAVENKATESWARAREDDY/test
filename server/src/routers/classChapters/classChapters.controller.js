const { addNewChapterToSubject, getAllChaptersOfSubject, deleteChapterFromASubject, updateAddedChapterToSubject } = require("../../models/classChapters.model/classChapters.model");
const { getSocketIO } = require("../../utils/socket");

async function addNewChapterController(req,res){
    try{
        const result = await addNewChapterToSubject(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('addedNewChapterToSubject',{data:req.body});
           return  res.status(201).json(result);
        }else{
           return  res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in chapter controller',err);
        res.status(500).json({success:false,message:'error in controller'});
    }
}

async function getAllChaptersController(req,res){
    try{
        const result = await getAllChaptersOfSubject(req.params.classid, req.params.subjectid);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in class chapters controller',err);
        res.status(500).json({success:false,message:'getting an error in class chapter controller'});
    }
}

async function deleteChapterController(req,res){
    try{
        const result = await deleteChapterFromASubject(req.params.classid,req.params.subjectid, req.params.chapterid);
        if(result.success){
            const io = getSocketIO();
            io.emit('deletedAddedChapterOfSubject',{data:{
                classid:req.params.classid,
                subjectid:req.params.subjectid, 
                chapterid:req.params.chapterid
            }});
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in class chapter controller',err);
        res.status(500).json({success:false, message:'getting an error in class chapter controller'});
    }
}

async function updateAddedChapterController(req,res){
    try{
        const result = await updateAddedChapterToSubject(req.body);
        if(result.success){
            const io= getSocketIO();
            io.emit('updateAddedChapterOfSubject',{data:req.body});
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in class chapter controller');
        return res.status(500).json({success:false, message:'error in class chapter controller'});
    }

}

module.exports ={
    addNewChapterController,
    getAllChaptersController,
    deleteChapterController,
    updateAddedChapterController
}