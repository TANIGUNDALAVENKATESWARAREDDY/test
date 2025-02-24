const { UpdateApplicationThreeField } = require('../../models/admission.model/admission.model');
const {createStudent ,getStudentsToSecAssign , 
    updateStudentSectionModel , getStudentsClassAndSectionModel , getParticularSectionStudentsModel} = require('../../models/student.model/student.model');
const {getSocketIO} = require('../../utils/socket');

async function createStudentController(req,res){
    const result = await createStudent(req.body);
    
    let secondrslt = {
        success:true
    }
    const io = getSocketIO();
    if(result.success && req.body.applicationid!==''){
        secondrslt = await UpdateApplicationThreeField('admstatus','approved',req.body.applicationid,'stdregid', result.studentregid,'parentregid','your parent reg_id');
        if(secondrslt.updatedApplicationData!==null){
            io.emit('updatingAdmissionData',{data:secondrslt.updatedApplicationData});
        }
    }
    if(result.success){
        io.emit('assignsectiondataassameclass',
            {data:{
            ...req.body,
            stdregid:result.studentregid
        }});
    }
    // console.log('second result data: ',req.body);
    if(result.success && secondrslt.success){
        return res.status(201).json({success:true,admission:'admission successfully completed'});
    }else{
        return res.status(500).json({success:false,admission:'Failed to complete the admission and create the student'});
    }
}

async function getStudentsToAssignSections(req,res){
    try{
        const result = await getStudentsToSecAssign(req.body);
        if(result.success){
            res.status(201).json(result)
        }else{
            res.status(500).json({success:false});
        }
        
    }catch(err){
        console.log('getting an error while fetching the students to assign sections',err);
         res.status(500).json({success:false});
    }
}

async function updateStudentSection(req,res){
    try{
        const result = await updateStudentSectionModel(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('updatestudentsection',{data:req.body});
            io.emit('updategetstudentdata',{data:req.body});
            res.status(201).json(result);
        }else{
            res.status(500).json({success:false});
        }
    }catch(err){
        console.log('getting an error while updating the student secction')
        res.status(500).json({success:false})
    }
}

async function getStudentsClassAndSection(req,res){
    try{
        const result = await getStudentsClassAndSectionModel(req.body);
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json({success:false});
        }
    }catch(err){
        console.log('getting an error while in student controller getstudents',err);
        res.status(500).json({success:false});
    }
}

async function getParticularSectionStudents(req,res){
    try{
        const result = await getParticularSectionStudentsModel(req.body);
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json({success:false});
        }
    }catch(err){
        console.log('getting an error while fetching the section students ', err);
        res.status(500).json({success:false});
    }
}

module.exports={
    createStudentController,
    getStudentsToAssignSections,
    updateStudentSection,
    getStudentsClassAndSection,
    getParticularSectionStudents
}