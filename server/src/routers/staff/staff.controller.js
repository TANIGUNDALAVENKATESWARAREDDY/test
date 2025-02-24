const { createNewStaffModel } = require("../../models/staff.model/staff.model");

async function createNewStaffController(req,res){
    try{
        const result  = await createNewStaffModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting error in staff controller',err);
        return res.status(500).json({success:false,message:'getting an error in staff controller'});
    }
}

module.exports={
    createNewStaffController,
}