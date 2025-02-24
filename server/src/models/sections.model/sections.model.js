const sectionsdatabase = require("./sections.mongo");

async function addNewSectionModel(sectiondata){
    try{
        const response = await sectionsdatabase.create({
            class:sectiondata.class,
            sectionname:sectiondata.sectionname,
            classteacherid:sectiondata.classteacherid,
            schoolstarttime:sectiondata.schoolstarttime,
            Schoolendtime:sectiondata.Schoolendtime
        });
        if(response){
            return {success:true,data:'successfully completed'};
        }
        return {success:false,data:'section not added'};
    }catch(err){
        console.log('you getting an error while adding section in the model',err);
        return {success:false , data:'getting error while adding the section'};
    }
}

async function getAllSectionsModel(){
    try{
        const allSections = await sectionsdatabase.find({});
        if(allSections){
            return {allSections:allSections,success:true};
        }else{
            console.log('gettitng an error while fetching all the sections');
            return {success:false};
        }
    }catch(err){
        console.log('getting an error while fetching the all sections ',err);
        return {success:false};
    }
}

async function editEachSectionModel(sectiondata){
    try{
        const response = await sectionsdatabase.updateOne({_id:sectiondata._id},{
            class:sectiondata.class,
            sectionname:sectiondata.sectionname,
            classteacherid:sectiondata.classteacherid,
            schoolstarttime:sectiondata.schoolstarttime,
            Schoolendtime:sectiondata.Schoolendtime
        });
        if(response){
            return {success:true,editdata:response,message:'successfully modified the data'};
        }else{
            return {success:false, message:'getting error while modifing data in model'}
        }
    }catch(err){
        console.log('getting error while modifing data in model ',err);
        return {success:false , message:'getting error while modifing data in model'};
    }
}

async function deleteEachSectionModel(id){
    try{
        const response = await sectionsdatabase.deleteOne({_id:id});
        if(response){
            return {success:true,message:'successfully deleted the section'};
        }else{
            return {success:false,message:'getting error while deleting the section'};
        }
    }catch(err){
        console.log('getting error while model delete',err);
        return {success:false,message:'getting an error while deleting in model'};
    }
}

module.exports={
    addNewSectionModel,
    getAllSectionsModel,
    editEachSectionModel,
    deleteEachSectionModel
}