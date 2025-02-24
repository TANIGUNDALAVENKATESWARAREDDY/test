const {addClassFeeModel , getAllClassesFee ,updateSingleClassFeeModel} = require('../../models/feelist.model/feelist.model');
const { getSocketIO } = require('../../utils/socket');

async function addFeelistNewItem(req,res){
   try{
        const result = await addClassFeeModel(req.body);
        if(result.success){
            res.status(201).json({success:true,message:'successfully added the new item'});
        }else{
            res.status(500).json({success:false,message:'getting error while adding the new item'});
        }
   }catch(err){
    console.log('getting an error while addinng the new item in feelist controller' , err);
   }
}

async function getAllFeeListItems(req,res){
    try{
        const result = await getAllClassesFee();
        if(result.success){
            res.status(201).json({success:true,classfeedata:result.classfeedata});
        }else{
            res.status(500).json({success:false})
        }
    }catch(err){
        console.log('you getting an error while fetching the classes data',err);
    }
}

async function updateSingleClassFeeItem(req,res){
    try{
        const result = await updateSingleClassFeeModel(req.body);
        if(result.success){
            const io = getSocketIO();
            io.emit('modifiedclassfeelist',{data:req.body});
            res.status(201).json({success:true});
        }else{
            res.status(500).json({success:false});
        }
        
    }catch(err){
        console.log('you getting an error while updating the class fee',err);
        res.status(500).json({success:false});
    }
}

module.exports = {
    addFeelistNewItem,
    getAllFeeListItems,
    updateSingleClassFeeItem
}