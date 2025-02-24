const { addNewCourseModel , getAllCoursesDataModel} = require("../../models/courses.model/courses.model");
const { getSocketIO } = require("../../utils/socket");


async function addNewCourseController(req,res){
    try{
        const result = await addNewCourseModel(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('addednewcourse',{data:req.body});
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in controller',err);
        res.status(500).json({success:false,message:"getting an error in controller"});
    }
}

async function getAllCoursesData(req,res){
    try{
        const result  = await getAllCoursesDataModel();
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in controller',err);
        res.status(500).json({success:false,message:"getting an error in controller"});

    }
}

module.exports = {
    addNewCourseController,
    getAllCoursesData
}