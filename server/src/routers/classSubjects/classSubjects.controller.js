const {AddSubjectToClass, getClassesSubjects, deleteClassSubject} = require('../../models/classSubjects.model/classSubjects.model');
const { getSocketIO } = require('../../utils/socket');

async function AddClassSubject(req,res){
    try{
        const result = await AddSubjectToClass(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('addednewsubjecttoclass',{data:req.body});
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('you getting an error in controller subjects',err);
        res.status(500).json({success:false,message:"getting an error in controller"});
    }
}

async function GetAllClassesSubjects(req,res){
    try{
        const result = await getClassesSubjects();
        if(result.success){
            res.status(201).json(result);

        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting error in class subjects controller',err);
        res.status(500).json({success:false,message:'getting an error in classsubjects controller'});
    }
}

async function DeleteClassesSubjectController(req,res){
    try{
        const result = await deleteClassSubject(req.params.classname, req.params.subjectid);
        if(result.success){
            const io=  getSocketIO();
            io.emit('deleteasubjectfromclass',{data:{
                class:req.params.classname,
                subjectid:req.params.subjectid
            }})
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in the class subjectys controller',err);
        res.status(500).json({success:false,message:'getting an error in class subjects controller'});
    }
}

module.exports={
    AddClassSubject,
    GetAllClassesSubjects,
    DeleteClassesSubjectController
}