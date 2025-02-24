const studentdatabase = require("../student.model/student.mongo");
const uuiddatabase = require("../uuid.model/uuid.mongo");
const transportFeehistoryDatabase = require("./transportFeeHistory.mongo");

async function transportFindStudenModel(studentData){
    try{
        const student = await studentdatabase.findOne({stdregid:studentData.studentid },
            {_id:0,stdregid:1,stdfirstname:1,stdmiddlename:1,stdlastname:1,stdclass:1,stdsectionid:1,
                stdtransportfeestatus:1,stdtransporttotalfee:1,stdtransportfeepaid:1,stdtransportfrom:1,
                stdparentorguard:1,stdfatherphone:1,stdguardphone:1,stdgender:1,stdtransportfrom:1
            });
        if(!student){
            return {success:false,message:'Student Not Found.'};
        }

        if(student.stdtransportfeestatus!=='yes'){
            return {success:false,message:`student doesn't have transport facility`};
        }

        return {success:true,message:'successfully fetched the student data',studentdata:student};
    }catch(err){
        console.log('getting an error while finding the student',err);
        return {success:false,message:'getting an error while finding the student'};
    }
}

async function transportClassStudentsModel(classData){
    try{
        const classStudents = await studentdatabase.find({stdclass:classData.class,stdsectionid:classData.section , stdtransportfeestatus:'yes'},{_id:0,stdregid:1,stdfirstname:1,stdmiddlename:1,stdlastname:1});
        if(classStudents){
            return {success:true, message:'successfully fetched' , students:classStudents};
        }else{
            return {success:false, message:'getting an error while fetching students'};
        }
    }catch(err){
        console.log('getting an error while fetching class students',err);
        return {success:false, message:'getting an error while fetching students'};

    }
}

async function getAllStudentsTransportFeeModel(){
    try{
        const allStudentsRes = await studentdatabase.find({stdtransportfeestatus:'yes'},{_id:0,stdregid:1,stdfirstname:1,stdmiddlename:1,stdlastname:1,stdclass:1,stdtransporttotalfee:1,stdtransportfeepaid:1,stdtransportfrom:1,stdfatherphone:1});
        if(allStudentsRes){
            return {success:true,message:'successfully fetched the data',transportfeestudents:allStudentsRes};
        }else{
            return {success:false,message:'getting an error in transport fee history model'};
        }
    }catch(err){
        console.log('getting an error while fetching the transport fee history students model',err);
        return {success:false, message:'getting an error while fetching the students fee history model'};
    }
}

async function enableStudentTransportModel(studentData){
    try{
        const student = await studentdatabase.findOne({stdregid:studentData.studentid },
            {_id:0,stdregid:1,stdfirstname:1,stdmiddlename:1,stdlastname:1,stdclass:1,stdsectionid:1,
                stdtransportfeestatus:1,stdtransporttotalfee:1,stdtransportfeepaid:1,stdtransportfrom:1
            });
        if(!student){
            return {success:false,message:'Student Not Found.'};
        }
        return {success:true,message:'successfully fetched the student data',studentdata:student};
    }catch(err){
        console.log('getting an error while finding the student',err);
        return {success:false,message:'getting an error while finding the student'};
    }
}

async function EnableEachStudentTransportModel(transportData){
    try{
        const today = new Date();
        const updateStdEnable = await studentdatabase.updateOne({stdregid:transportData.stdregid},{
            stdfirstname:transportData.stdfirstname,
            stdmiddlename:transportData.stdmiddlename,
            stdlastname:transportData.stdlastname,
            stdclass:transportData.stdclass,
            stdsectionid:transportData.stdsectionid,
            stdtransportfeestatus:'yes',
            stdtransporttotalfee:Number(transportData.stdtransporttotalfee),
            stdtransportfeepaid:Number(transportData.stdtransportfeepaid),
            stdtransportfrom:transportData.stdtransportfrom,
            transportstartdate:transportData.transportstartdate?transportData.transportstartdate:today
        });
        if(updateStdEnable){
            return {success:true,message:'successfully updated'};
        }else{
            return {success:false, message:'getting an error while updating the student transport'};
        }

    }catch(err){
        console.log('transport fee history enable student transport model: ',err);
        return {success:false, message:'getting an error while enable transport model'};
    }
}

async function DisableEachStudentTransportModel(transportData){
    try{
        const updateStdDisable = await studentdatabase.updateOne({stdregid:transportData.stdregid},{
            stdtransportfeestatus:'no',
            stdtransporttotalfee:0,
            stdtransportfeepaid:0,
            stdtransportfrom:'',
        });
        if(updateStdDisable){
            return {success:true, message:'successfully disable the transport'};
        }else{
            return {success:false, message:'getting error while disabling the transport'};
        }
    }catch(err){
        console.log('getting an error while disabling the studen transport',err);
        return {success:false, message:'getting error while disabling the student transport model'};
    }
}

async function PayTransportFeeModel(transportFeeData){
    const today = new Date();
    let tempuuid;
    let tempreceiptid = '';
    try{//task 1 generating the unique receipt id
        tempuuid = await uuiddatabase.findOne({uid:'saraswati234'});
        if(tempuuid){
            tempreceiptid = `VISNEW${tempuuid.feeinc}`;
        }
    }catch(err){
        console.log('getting an error in payment transport fee ',err);
        return {success:false, message:'getting an error while paying the transport fee'};
    }

    let response;
    try{ // task 2 creating the doc in fee transport history
        if(tempreceiptid!==''){//checking the unique id generated or not
            response = await transportFeehistoryDatabase.create({
                stdclass:transportFeeData.stdclass, //student class
                stdsectionid:transportFeeData.stdsectionid, //student section
                stdname:transportFeeData.stdname, //student name
                stdregid:transportFeeData.stdregid , //student regid
                stdamountpaidnow:transportFeeData.stdamountpaidnow ,//student amount paid now
                transportfeecomments:transportFeeData.transportfeecomments, // transport fee comments
                transportfeepaiddata:today,// transport fee paid date
                transportfeecollectedstaffid:transportFeeData.transportfeecollectedstaffid,
                paidby:transportFeeData.paidby,
                modedata:transportFeeData.modedata,
                staffrole:transportFeeData.staffrole,
                receiptnumber:tempreceiptid,
                totaltransportfee:transportFeeData.totaltransportfee,
                totalpaid:transportFeeData.totalpaid,
                transportnextfeedate:transportFeeData.transportnextfeedate,
                stdtransportfrom:transportFeeData.stdtransportfrom,// transport from
                stdgender:transportFeeData.stdgender,// student gender
                stdmobile:transportFeeData.stdmobile,//father or guardian mobile number
            });
        }else{
            console.log('unquie id not generated');
            return {success:false, message:'you getting an error while paying the transport fee'};
        }
    }catch(err){
        console.log('getting an error in transport fee model ',err);
        return {success:false, message:'getting an error while paying transport fee'};
    }

    let response2 , response3;
    try{//task 3
        if(response){
            response2 = await studentdatabase.updateOne({stdregid:transportFeeData.stdregid},{$inc:{stdtransportfeepaid:transportFeeData.stdamountpaidnow}});
        }else{
            console.log('getting an error in transport fee response');
            return {success:false, message:'getting an error while paying the transport fee'};
        }
    }catch(err){
        await transportFeehistoryDatabase.deleteOne({receiptnumber:tempreceiptid});
        console.log('getting an error in paying transport fee model ',err);
        return {success:false, message:'getting an error while paying the transport fee'};
    }

    try{
        if(response2){
            response3 = await uuiddatabase.updateOne({uid:'saraswati234'},{$inc:{feeinc:1}});
            if(response3){
                return {success:true, message:'successfully amount paid',stdTransRes:response};
            }else{
                await studentdatabase.updateOne({stdregid:transportFeeData.stdregid},{$inc:{stdtransportfeepaid:-transportFeeData.stdamountpaidnow}});
                await transportFeehistoryDatabase.deleteOne({receiptnumber:tempreceiptid});
                return {success:false, message:'getting an error while paying the transport fee'};
            }
        }else{
            await transportFeehistoryDatabase.deleteOne({receiptnumber:tempreceiptid});
            console.log('getting a error in response 2');
            return {success:false, message:'getting an error while paying the transpor fee'};
        }
    }catch(err){
        await studentdatabase.updateOne({stdregid:transportFeeData.stdregid},{$inc:{stdtransportfeepaid:-transportFeeData.stdamountpaidnow}});
        await transportFeehistoryDatabase.deleteOne({receiptnumber:tempreceiptid});
        console.log('getting an error while adding the transport fee history' ,err);
        return {success:false, message:'getting an error while paying the transport fee'};
    }
}

async function EachStudentTransportHistoryModel(StdID){
    try{
        const response = await studentdatabase.findOne({stdregid:StdID},{_id:0,stdregid:1,stdfirstname:1,stdmiddlename:1,stdlastname:1,stdclass:1,stdsectionid:1,
            stdtransportfeestatus:1,stdtransporttotalfee:1,stdtransportfeepaid:1,stdtransportfrom:1,
            stdparentorguard:1,stdfatherphone:1,stdguardphone:1,stdgender:1,stdtransportfrom:1});
        if(response){
            const response2 = await transportFeehistoryDatabase.find({stdregid:StdID});
            if(response2){
                return {success:true,message:'successfully fetched',studentdata:response, transporthistory:response2};
            }else{
                return {success:false, message:'getting an error while fetching the transport history'};
            }
        }else{
            return {success:false, message:'getting an error while fetching the transport student data'};
        }
    }catch(err){
        console.log('getting an error while fetching the students transport fee history Model', err);
        return { success:false, message:'getting error in transport fee history model'};
    }
}

module.exports = {
    transportFindStudenModel,
    transportClassStudentsModel,
    getAllStudentsTransportFeeModel,
    enableStudentTransportModel,
    EnableEachStudentTransportModel,
    DisableEachStudentTransportModel,
    PayTransportFeeModel,
    EachStudentTransportHistoryModel
}