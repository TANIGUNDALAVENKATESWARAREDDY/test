const studentdatabase = require('../student.model/student.mongo');
const uuiddatabase = require('../uuid.model/uuid.mongo');
const feehistorydatabase = require('./fee.mongo');
// const feehistroydatabase = require('./fee.mongo');
async function saveFeeData(feedata){
    
        const today = new Date();
        let tempuuid;
        let tempreceiptid = '';
        try{//in this try we not modified any data
            tempuuid = await uuiddatabase.findOne({uid:'saraswati234'});
            if(tempuuid){
                tempreceiptid = `VISNEW${tempuuid.feeinc}`;
            }
        }catch(err){
            console.log('getting error ',err);
            return {success:false,message:"you get an error while paying the fee"};
        }

        let response;               //here is the response
        try{ //in this try box we added the document
            if(tempreceiptid!==''){//checking the unquie id is generating or not
                 response = await feehistorydatabase.create({
                    stdclass:feedata.stdclass,//student class
                    stdsectionid:feedata.stdsectionid,//student section ID
                    stdname:feedata.stdname,//student name
                    stdregid:feedata.stdregid,//student register ID
                    stdamountpaidnow:feedata.stdamountpaidnow,//student amount paid now
                    feecomments:feedata.feecomments,//fee comments
                    feepaiddate:today,
                    feecollectedstaffid:feedata.feecollectedstaffid,
                    paidby:feedata.paidby,
                    modedata:feedata.modedata,
                    staffrole:feedata.staffrole,
                    receiptnumber:tempreceiptid,
                    totalfee:feedata.totalfee,//total fee
                    feediscount:feedata.feediscount,//fee discount
                    totalpaid:feedata.totalpaid,//total paid
                    nextfeedate:feedata.nextfeedate,//next fee date
                });
            }else{
                console.log('unquie id not generated');
                return {success:false,message:"you get an error while paying the fee"};
            }
        }catch(err){
            console.log('getting an error in fee model',err);
            return {success:false,message:"you get an error while paying the fee"};
        }
        let response2,response3;//response2 and response3
        try{
            if(response){ //response data comes for here
                 response2 = await studentdatabase.updateOne({stdregid:feedata.stdregid},{$inc:{stdtotalpaid:feedata.stdamountpaidnow}});
            }else{
                console.log('getting error in response');
                return {success:false,message:"you get an error while paying the fee"};
            }
        }catch(err){
            await feehistorydatabase.deleteOne({receiptnumber:tempreceiptid});
            console.log('getting an error in fee model',err);
            return {success:false,message:"you get an error while paying the fee"};
        }

        try{
            if(response2){
                response3 = await uuiddatabase.updateOne({uid:'saraswati234'},{$inc:{feeinc:1}});
                if(response3 ){
                    return {success:true,message:'successfully amount paid',studentfeeres:response};
                }else{
                    await studentdatabase.updateOne({stdregid:feedata.stdregid},{$inc:{stdtotalpaid:-feedata.stdamountpaidnow}});
                    await feehistorydatabase.deleteOne({receiptnumber:tempreceiptid});
                    return {success:false,message:"you get an error while paying the fee"};
                }
            }else{
                await feehistorydatabase.deleteOne({receiptnumber:tempreceiptid});
                console.log('getting error in response2');
                return {success:false,message:"you get an error while paying the fee"};
            }
        }catch(err){
            await studentdatabase.updateOne({stdregid:feedata.stdregid},{$inc:{stdtotalpaid:-feedata.stdamountpaidnow}});
            await feehistorydatabase.deleteOne({receiptnumber:tempreceiptid});
            console.log("getting an error while adding the fee history",err);
            return {success:false,message:"you get an error while paying the fee"};
        }
}

async function getStudentsFeeHistoryModel(classData){
    try{
        const response = await studentdatabase.find({stdclass:classData.class , stdsectionid:classData.section});
        if(response){
            return {success:true,message:'successfully getting the data' , studentsdata:response};
        }else{
            return {success:false , message:'getting error while fetching students data'};
        }
    }catch(err){
        console.log('getting an error while fetching the fee history model',err);
        return {success:false,message:"getting an error in model"};
    }
}

async function studentsFeeHistoryModel(classData){
    try{
        const response = await studentdatabase.find({stdclass:classData.class , stdsectionid:classData.section},{stdregid:1,stdfirstname:1,stdmiddlename:1,stdlastname:1,stdclass:1,stdsectionid:1,stdparentorguard:1,stdfatherphone:1,stdguardphone:1,stdtotalfee:1,stdtotalpaid:1,stdfeediscount:1});
        if(response){
            return {success:true,message:'successfully getting the data' , studentsdata:response};
        }else{
            return {success:false , message:'getting error while fetching students data'};
        }
    }catch(err){
        console.log('getting an error while fetching the fee history model',err);
        return {success:false,message:"getting an error in model"};
    }
}


async function getEachStudentHistoryModel(classid,studentid){
    let studentres;
    let studentdata={};
    try{
        studentres=await studentdatabase.findOne({stdregid:studentid});
        if(studentres){
            studentdata.stdregid = studentres.stdregid;
            studentdata.name = studentres.stdfirstname+''+studentres.stdmiddlename+''+studentres.stdlastname;
            studentdata.class = studentres.stdclass;
            studentdata.section = studentres.stdsectionid;
            studentdata.totalfee = studentres.stdtotalfee;
            studentdata.stdtotalpaid = studentres.stdtotalpaid;
            studentdata.feediscount = studentres.stdfeediscount;
            studentdata.stdgender = studentres.stdgender;
            studentdata.stdparentorguard=studentres.stdparentorguard;
            studentdata.stdfatherphone=studentres.stdfatherphone;
            studentdata.stdguardphone=studentres.stdguardphone;
        }else{
            return {success:false,message:'student doesn\'t exist'};
        }
    }catch(err){
        console.log('getting an error while fetching in fee model',err);
        return {success:false,message:'getting error which fetching data'};
    }

    if(studentres){
        try{
            const feehistres = await feehistorydatabase.find({stdclass:classid,stdregid:studentid});
            if(feehistres){
                return {success:true,message:'successfully fetched student fee data',studentdata:studentdata,feehistory:feehistres};
            }
        }catch(err){
            console.log('getting an error in fee model',err);
            return {success:false,message:'getting an error while fetching fee history'};
        }
        
        
    }
}

async function tempUpdatefeeDiscountPaidModel(updateData){
    // console.log(updateData)
    try{
        const response = await studentdatabase.updateOne({stdregid:updateData.stdregid},{
            stdtotalfee:updateData.totalfee,
            stdtotalpaid:updateData.totalpaid,
            stdfeediscount:updateData.feediscount
        });
        if(response){
            return {success:true,message:'successfully updated'};
        }
        return {success:false,message:'successfully updated'};
    }catch(err){
        console.log('getting an error while updating the fee data model: ',err);
        return {success:false,message:'getting an error while updating the fee in feemodel'};
    }
}
module.exports={
    saveFeeData,
    getStudentsFeeHistoryModel,
    studentsFeeHistoryModel,
    getEachStudentHistoryModel,
    tempUpdatefeeDiscountPaidModel
}