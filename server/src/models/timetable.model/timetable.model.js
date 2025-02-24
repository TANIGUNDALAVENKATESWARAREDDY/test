const timetabledatabase = require('./timetable.mongo');

async function addTimeTable(timetableData){
    try{
        const response  = await timetabledatabase.create(timetableData);
        if(response){
            return {success:true,message:"successfully added the time table"};
        }else{
            return {success:false,message:"error while adding time table"};
        }
    }catch(err){
        console.log('getting an error while adding the timetable in model',err);
        return {success:false,message:"getting error while adding timetable in model"};
    }
}

async function getTimeTable(classData){
    try{
        const response = await timetabledatabase.findOne({class:classData.class,sectionid:classData.sectionid});
        // console.log('here is the databse response : ',response);
        if(response){
            return {success:true,core:'edit',timetabledata:response};
        }else{
            return {success:true,core:'create'};
        }
    }catch(err){
        console.log('getting an error in getTimeTable model');
        return {success:false,message:'getting an error in model'};
    }
}

async function updateTimeTable(classData){
    try{
        const response = await timetabledatabase.updateOne({class:classData.class,sectionid:classData.sectionid},{
            ...classData
        });
        if(response){
            return {success:true,message:"successfully updated the time table"};
        }else{
            return {success:false,message:"getting an error while updaating the timetable"};
        }
    }catch(err){
        console.log('getting an error while updating the time table model ',err);
        return {success:false, message:"getting an error in model"};
    }
}


module.exports ={
    addTimeTable,
    getTimeTable,
    updateTimeTable
}
