const { createOrUpdateTeacherClass, modifyTimeSubject } = require("../../models/teacherClasses.model/teacherClasses.model");
const { getSocketIO } = require("../../utils/socket");

async function handleUpdateTeacherClasses(req,res){
    try{
        const result = await createOrUpdateTeacherClass(req.body);
        // console.log('here is the controller response',result);
        if(result.success){
            const io = getSocketIO();
            io.emit('createtimetablelistening',{
                data:req.body
            });
            return res.status(201).json({success:true,message:'successfully completed'});
        }else{
            if(result.type==='teacherclasseserror'){
                return res.json(result);
            }else if(result.type==='alreadysoltbooked'){
                return res.json(result);
            }
            return res.status(500).json({success:false,message:'getting an error while updating the teacher classes'});
        }
    }catch(err){
        console.log('getting an error in teacherClass Controller',err);
        return res.status(500).json({success:false,message:'getting an error while update teacher classes'});
    }
}

async function  modifyTimeTableSubjectController(req,res){
    try{
        const result = await modifyTimeSubject(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('createtimetablelistening',{
                data:req.body
            });
            return res.status(201).json(result);
        }else{
            return res.status(result);
        }
    }catch(err){
        console.log('getting an error in teacherclasses controller',err);
        return res.status(500).json({success:false,message:'getting an error in teacher classes controller'});
    }
}

module.exports ={
    handleUpdateTeacherClasses,
    modifyTimeTableSubjectController
}