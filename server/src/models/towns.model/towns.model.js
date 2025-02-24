const townsDatabase = require("./towns.mongo")

async function addNewTown(townData){
    try{
        const response = await townsDatabase.create({
            townid:townData.townid,
            townname:townData.townname,
            towntransportfee:townData.towntransportfee
        });
        if(response){
            return {success:true,message:'successfully added the town'};
        }else{
            return {success:false,message:'getting error while adding the town'};
        }
    }catch(err){
        console.log('getting an error while adding the new town in model',err);
        return {success:false,message:'getting an error while adding the town'};
    }
}

async function getAllTowns(){
    try{
        const response = await townsDatabase.find({},{_id:0,townid:1,townname:1,towntransportfee:1});
        if(response){
            return {success:true,message:'successfully fetched' , alltownsdata:response};
        }else{
            return {success:false,message:'error while fetching'};
        }
    }catch(err){
        console.log('getting an error while fetching towns data in model: ',err);
        return {success:false,message:'error while fetching'};
    }
}

async function deleteATown(townData){
    try{
        const response = await townsDatabase.deleteOne({townid:townData.townid});
        if(response){
            return {success:true,message:'successfully deleted the town'};
        }else{
            return {success:true,message:'error while deleting town'};
        }
    }catch(err){
        console.log('getting an error while deleting the town',err);
        return {success:true,message:'error while deleting town'};
    }
}

async function updateATown(townData){
    try{
        const response = await townsDatabase.updateOne({townid:townData.townid},{
            townid:townData.townid,
            townname:townData.townname,
            towntransportfee:townData.towntransportfee
        });

        if(response){
            return {success:true,message:'successfully updated'};
        }else{
            return {success:false, message:'getting an error while updating the data'};
        }
    }catch(err){
        console.log('getting an error while updating the data',err);
        return {success:false, message:'getting an error while updating the data'};
    }
}

module.exports = {
    addNewTown,
    getAllTowns,
    deleteATown,
    updateATown
}