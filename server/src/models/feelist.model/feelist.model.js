const feelistdatabase = require("./feelist.mongo");

async function addClassFeeModel(feedata){
    try{
        const response = await feelistdatabase.create({
            class:feedata.class,
            fee:feedata.fee
        });

        if(response){
            return {success:true,message:'successfully added the item'};
        }
        return {success:false};
    }catch(err){
        console.error('getting an error while adding the class fee item',err);
        return {success:false};
    }
}

async function getAllClassesFee(){
    try{
        const feedata = await feelistdatabase.find({});
        if(feedata){
            return {success:true,classfeedata:feedata};
        }else{
            return {success:false};
        }
    }catch(err){
        console.log('you getting an error while fetching all the classes fee ',err);
        return {success:false};
    }
}

async function updateSingleClassFeeModel(feedata){
    try{
        const tempupdatefee = await feelistdatabase.updateOne({class:feedata.class},{
            ...feedata
        });
        if(tempupdatefee){
            return {success:true};
        }else{
            return {success:false};
        }
    }catch(err){
        console.log('getting an error while updating the fee data',err);
        return {success:false};
    }
}

module.exports= {
    addClassFeeModel,
    getAllClassesFee,
    updateSingleClassFeeModel
}