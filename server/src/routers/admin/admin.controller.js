const { createNewAdminModel, getAllAdminModel, getEachAdminData } = require("../../models/admin.model/admin.model");

async function createNewAdminController(req,res){
    try{
        const result = await createNewAdminModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting error in admin controller');
        return res.status(500).json({success:false , message:'getting error in admin controller'});
    }
}

async function getAllAdminController(req,res){
    try{
        const result = await getAllAdminModel(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting error in admin controller');
        return res.status(500).json({success:false , message:'getting error in admin controller'});
    }

}

async function getEachAdminDataController(req,res){
    try{
        const result = await getEachAdminData(req.params.adminid);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting error in admin controller',err);
        return res.status(500).json({success:false,message:'getting an error in admin controller'});
    }
}

module.exports={
    createNewAdminController,
    getAllAdminController,
    getEachAdminDataController
}