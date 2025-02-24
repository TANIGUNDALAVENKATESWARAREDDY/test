const { transportFindStudenModel, transportClassStudentsModel, getAllStudentsTransportFeeModel, 
    enableStudentTransportModel, EnableEachStudentTransportModel, DisableEachStudentTransportModel, 
    PayTransportFeeModel, EachStudentTransportHistoryModel } = require("../../models/transportFeeHistory.model/transportFeeHistory.model");

async function transportFindStudentController(req,res){
    try{
        const result = await transportFindStudenModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while finding the student',err);
        return res.status(500).json({success:false, message:'getting an error in fee history controller'});
    }
}

async function transportClassStudentsController(req,res){
    try{
        const result = await transportClassStudentsModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while fetching class students',err);
        return res.status(500).json({success:false, message:'getting an error while fetching class students'});
    }
}

async function getAllStudentsTransportFeeController(req,res){
    try{
        const result = await getAllStudentsTransportFeeModel();
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while fetching all students transport fee histroy',err);
        return res.status(500).json({success:false, message:'getting an error while fetching the all students transport fee hsitory'});
    }
}

async function enableStudentTransportController(req,res){
    try{
        const result = await enableStudentTransportModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while fetching the student data in enable transport fee history controller',err);
        return res.status(500).json({success:false, message:'getting an error while fetching the student data in controller'});
    }
}

async function EnableEachStudentTransportController(req,res){
    try{
        const result = await EnableEachStudentTransportModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while enabling the student transport ',err);
        return res.status(500).json({success:false,message:'getting an error while enabling transport in controller'});
    }
}

async function DisableEachStudentTransportController(req,res){
    try{
        const result = await DisableEachStudentTransportModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while disabling the student transport ',err);
        return res.status(500).json({success:false, message:'getting an error while disabling student transport'});
    }
}

async function PayTransportFeeController(req,res){
    try{
        const result = await  PayTransportFeeModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while paying transport fee',err);
        return res.status(500).json({success:false, message:'getting an error while paying trnsport fee controller '});
    }
}

async function EachStudentTransportHistory(req,res){
    try{
        const result = await EachStudentTransportHistoryModel(req.params.stdid);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while fetching each student tranport history controller : ',err);
        return res.status(500).json({success:false, message:'getting an error while fetching each student history controller'});
    }
}

module.exports={
    transportFindStudentController,
    transportClassStudentsController,
    getAllStudentsTransportFeeController,
    enableStudentTransportController,
    EnableEachStudentTransportController,
    DisableEachStudentTransportController,
    PayTransportFeeController,
    EachStudentTransportHistory
}