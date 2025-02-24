const { addTeacherToSubject, deleteTeacherOfASubject, getAllSubjectTeachers } = require("../../models/subjectTeachers.model/subjectTeachers.model");
const { getSocketIO } = require("../../utils/socket");

async function addTeacherController(req,res){
    try{
        const result = await addTeacherToSubject(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('addnewsubjectteacher',{data:req.body});
            return res.status(201).json(result);
         }else{
            return res.status(500).json(result);
         }
    }catch(err){
        console.log('getting an error while adding the teacher in subjectTeacher Model',err);
        return res.status(500).json({success:false,message:'getting error subjectteacher controller'});
    }
}

async function deleteTeacherController(req,res){
    try{
        const result = await deleteTeacherOfASubject(req.params.subjectid, req.params.teacherid);
        if(result.success){
            const io = getSocketIO();
            io.emit('deleteAddedSubjectTeacher',{data:{
                subjectid:req.params.subjectid,
                teacherid:req.params.teacherid
            }});
           return res.status(201).json(result);
        }else{
           return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while deleting the teacher',err);
        return res.status(500).json({success:false,message:'getting error subjectteacher controller'});
    }
}

async function getAllSubjectTeachersController(req,res){
    try{
        const result = await getAllSubjectTeachers();
        if(result.success){
            return res.status(201).json(result);
         }else{
            return res.status(500).json(result);
         }
    }catch(err){
        console.log('getting error while fetching all subject teachers',err);
        return res.status(500).json({success:true,message:'getting error while getting subject teachers'});
    }
}

module.exports={
    addTeacherController,
    deleteTeacherController,
    getAllSubjectTeachersController
}