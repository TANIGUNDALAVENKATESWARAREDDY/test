const timetabledatabase = require("../timetable.model/timetable.mongo");
const teacherClassesDatabase = require("./teacherClasses.mongo");

const timeToMinutes = time => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const checkTeacherAvailability = async (day, teacherid, inputStartTime, inputEndTime) => {
    const inputStartMinutes = timeToMinutes(inputStartTime);
    const inputEndMinutes = timeToMinutes(inputEndTime);

    const result = await teacherClassesDatabase.findOne({
        day: day,
        teacherid: teacherid,
        $and: [
            { startduration: { $lt: inputEndMinutes } }, // Starts before the new class ends
            { endduration: { $gt: inputStartMinutes } } // Ends after the new class starts
        ]
    });
    return result;
};

async function createOrUpdateTeacherClass(TeacherClassData){
    const checkTeacherSlot = await checkTeacherAvailability(TeacherClassData.day ,TeacherClassData.teacherid , TeacherClassData.starttime,TeacherClassData.endtime);
    try{
        if(!checkTeacherSlot){
            //finding teache ris exist or not
            const findTeacher = await teacherClassesDatabase.findOne({day:TeacherClassData.day,class:TeacherClassData.class,sectionid:TeacherClassData.sectionid,period:TeacherClassData.period});
            
            //first of all change the timetable 
            const changeTimetabledata = await timetabledatabase.updateOne({class:TeacherClassData.class,sectionid:TeacherClassData.sectionid},{
                $set:{
                    [`${TeacherClassData.day}.${TeacherClassData.period}.teacherid`]:TeacherClassData.teacherid
                }
            });
            
            //after that adding the teachers timetable
            if(changeTimetabledata){
                const responseCreate = await teacherClassesDatabase.findOneAndUpdate({day:TeacherClassData.day,class:TeacherClassData.class,sectionid:TeacherClassData.sectionid,period:TeacherClassData.period},{
                    day:TeacherClassData.day,
                    teacherid:TeacherClassData.teacherid,
                    class:TeacherClassData.class,
                    sectionid:TeacherClassData.sectionid,
                    subjectid:TeacherClassData.subjectid,
                    period:TeacherClassData.period,
                    starttime:TeacherClassData.starttime,
                    endtime:TeacherClassData.endtime,
                    startduration:timeToMinutes(TeacherClassData.starttime),
                    endduration:timeToMinutes(TeacherClassData.endtime)
                },{upsert:true,new: true, runValidators: true});
                const sendData={};
                if(findTeacher){
                    sendData.findTeacher=true;
                    sendData.foundTeacherData = findTeacher;
                }
                // console.log('here is the respponse data',responseCreate)
                if(responseCreate){
                    return {success:true,type:'success',message:'successfully modified', deleteTeacherData:sendData , addedTeacherData:TeacherClassData};
                }else{
                    console.log('modifying the teacher classes you getting the wrong');
                    return {success:false,type:'teacherclasseserror',message:'successfully modified', deleteTeacherData:sendData , addedTeacherData:TeacherClassData};
                }

            }
        }else{
            // console.log('teacher already allocated the slot');
            return {success:false,type:'alreadysoltbooked',message:'teacher have already scheduled the tiem slot',data :checkTeacherSlot};
        }
    }catch(err){
        console.log('getting an error in teacherClassesModel : ',err);
        return {success:false,type:'error',message:'getting an error in teacher classes model'};
    }    
}

async function modifyTimeSubject(subjectData){
    try{
        const responseOne = await teacherClassesDatabase.deleteOne({day:subjectData.day,class:subjectData.class,sectionid:subjectData.sectionid,period:subjectData.period});
        
        if(responseOne){
            try{
                //changing the timetable 
                const changeTimetabledata = await timetabledatabase.updateOne({class:subjectData.class,sectionid:subjectData.sectionid},{
                    $set:{
                        [`${subjectData.day}.${subjectData.period}.subjectid`]:subjectData.subjectid,
                        [`${subjectData.day}.${subjectData.period}.teacherid`]:''
                    }
                });
                if(changeTimetabledata){
                    return {success:'success',type:'success',message:'successfully modify the data'};
                }
            }catch(err){
                console.log('getting an error while changing the time table',err);
                return {success:false,type:'timtableerror',message:'getting error while deleting the teacher classes'};
            }
        }
        
    }catch(err){
        console.log('getting an error in teacher class model while deleting the teacher classes');
        return {success:false,type:'teacherclasserror',message:'getting error while deleting the teacher classes'};
    }
}

module.exports = {
    createOrUpdateTeacherClass,
    modifyTimeSubject
}