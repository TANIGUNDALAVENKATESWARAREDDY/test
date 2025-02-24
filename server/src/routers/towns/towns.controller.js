const { addNewTown, getAllTowns, deleteATown, updateATown } = require("../../models/towns.model/towns.model");

async function addNewTownController(req,res){
    try{
        const result = await addNewTown(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while adding the town',err);
        return res.status(500).json({success:false,message:'getting error while adding the town'});
    }
}

async function getAllTownsController(req,res){
    try{
        const result = await getAllTowns();
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while fetching the data in controller ',err);
        return res.status(501).json({success:false,message:'getting an error while fetching the data'});
    }
}

async function deleteTownController(req,res){
    try{
        const result = await deleteATown(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while deleting the data',err);
        return res.status(501).json({success:false,message:'getting an error while deleting data'});
    }
}

async function updateTownController(req,res){
    try{
        const result = await updateATown(req.body);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while updating the data',err);
        return res.status(500).json({success:false,message:'getting an error while updating the data'});
    }
}

module.exports = {
    addNewTownController,
    getAllTownsController,
    deleteTownController,
    updateTownController
}