const { saveFeeData ,getStudentsFeeHistoryModel, getEachStudentHistoryModel, tempUpdatefeeDiscountPaidModel, studentsFeeHistoryModel } = require("../../models/fee.model/fee.model");
const { getSocketIO } = require('../../utils/socket');

async function payStudentFee(req,res){
    try{
        const result = await saveFeeData(req.body);
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an an error while paying the fee in controller',err);
        res.status(500).json({success:false,message:'getting an error in controller'});
    }
}

async function getStudentsFeeHistory(req,res){
    try{
        const result = await  getStudentsFeeHistoryModel(req.body);
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while fetching students history in controller',err);
        res.status(500).json({success:false,message:'getting an error in controller'});
    }
}

async function studentsFeeHistoryController(req,res){
    try{
        const result = await studentsFeeHistoryModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.json(result);
        }
    }catch(err){
        console.log('getting an error while fetching students history in history page ',err);
        res.status(500).json({success:false,message:'getting an error in controller'});
    }
}

async function getEachStudentHistory(req,res){
    try{
        const result = await getEachStudentHistoryModel(req.params.classid,req.params.regid);
        if(result.success){
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while fetching students history in controller',err);
        res.status(500).json({success:false,message:'getting an error in controller'});
    }
}

async function tempUpdatefeeDiscountPaid(req,res){
    try{
        const result  = await tempUpdatefeeDiscountPaidModel(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('tempModifiystudentFee',{data:req.body});
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting error while updating the fee contoller',err);
        return res.status(500).json({success:false,message:'getting an error while updating the fee'});
    }
}

module.exports ={
    payStudentFee,
    getStudentsFeeHistory,
    studentsFeeHistoryController,
    getEachStudentHistory,
    tempUpdatefeeDiscountPaid
}