const { addNewTeacher, getAllTeachers, getEachTeacherData } = require("../../models/teachers.model/teachers.model");

async function addNewTeacherController(req,res){
    try{
        const result = await addNewTeacher(req.body);
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in teachers controller',err);
        res.status(500).json({success:false,message:"getting an error in teacher controller"});
    }
}

async function getAllTeachersController(req,res){
    try{
        const result = await getAllTeachers();
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting anm error in teachers controller',err);
        res.status(500).json({success:false,message:"getting an error in teachers controller"});
    }
}

async function getEachTeacherDataController(req,res){
    try{
        const result = await getEachTeacherData(req.params.teacherid);
        if(result.success){
            return res.status(201).json(result);
        }else{
           return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting anm error in teachers controller',err);
        res.status(500).json({success:false,message:"getting an error in teachers controller"});
    }
}

module.exports ={
    addNewTeacherController,
    getAllTeachersController,
    getEachTeacherDataController
}