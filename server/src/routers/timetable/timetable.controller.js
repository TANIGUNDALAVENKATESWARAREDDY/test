const { getTimeTable, addTimeTable, updateTimeTable } = require("../../models/timetable.model/timetable.model");
const { getSocketIO } = require("../../utils/socket");

async function addtimeTableController(req,res){
    try{
        const result = await addTimeTable(req.body);
        if(result.success){
            const io= getSocketIO();
            io.emit('updatetimetable',{data:req.body});
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
        
    }catch(err){
        console.log('getting an error in controller',err);
        res.status(500).json({success:false,message:"getting error in controller"});
    }
}

async function getTimeTableController(req,res){
    try{
        const result = await getTimeTable(req.body);
        // console.log('controller result: ',result);
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
        
    }catch(err){
        console.log('getting an error in controller',err);
        res.status(500).json({message:'sorry you getting an error'});
    }
}

async function updateTimeTableController(req,res){
    try{
        const result = await updateTimeTable(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('updatetimetable',{data:req.body});
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error in controller',err);
        res.status(500).json({success:false,message:"getting an error in controller"});
    }
}

module.exports ={
    addtimeTableController,
    getTimeTableController,
    updateTimeTableController
}