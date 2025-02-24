const { addNewSectionModel , getAllSectionsModel, editEachSectionModel, deleteEachSectionModel } = require("../../models/sections.model/sections.model");
const { getSocketIO } = require("../../utils/socket");

async function addNewSection(req,res){
    try{
        const addSectionResponse = await addNewSectionModel(req.body);
        if(addSectionResponse.success){
            const io = getSocketIO();
            io.emit('addedNewSection',{data:req.body});
            return res.status(201).json(addSectionResponse);
        }else{
            return res.status(500).json(addSectionResponse);
        }
    }catch(err){
        console.error('you getting an error while adding the new section',err);
        return res.status(500).json({success:false, message: 'Failed to save new section data' });
    }
}

async function getAllSections(req,res){
    try{
        const getallsectionsres = await getAllSectionsModel();
        if(getallsectionsres.success){
            return res.status(201).json(getallsectionsres);
        }else{
            return res.status(500).json(getallsectionsres);
        }
    }catch(err){
        console.log('getting an error while fetching all sections ',err);
        return res.status(500).json({success:false,message:'error while fetching all sections'});
    }
}

async function editEachSection(req,res){
    try{
        const result = await editEachSectionModel(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('sectionModified',{data:req.body});
            res.status(201).json(result);
        }else{
            res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while updating all sections ',err);
        return res.status(500).json({success:false,message:'error while updating all sections'});
    }
}

async function deleteEachSection(req,res){
    try{
        const result = await deleteEachSectionModel(req.params.id);
        if(result.success){
            return res.status(201).json(result);
        }else{
            return res.status(500).json(result);
        }
    }catch(err){
        console.log('getting an error while deleting the section', err);
        return res.status(500).json({success:false, message:'error while deleting in controller'});
    }
}

module.exports ={
    addNewSection,
    getAllSections,
    editEachSection,
    deleteEachSection
}