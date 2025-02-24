const studentdatabase = require('./student.mongo');
const { getAndIncrementUuid } = require('../uuid.model/uuid.model');
const usersDatabase = require('../users.model/users.mongo');

async function createStudent(studentdata){
    

        //auto increment id code starts here
        const TodayDate = new Date();
        const tyear = TodayDate.getFullYear();
        let tempAutoIncrementId =1007;
        if(studentdata.stdautoregornot){
            tempAutoIncrementId =  await getAndIncrementUuid();
            if(tempAutoIncrementId===0){
                return { success: false, message: 'you got an error while compoleting the admission' };
            }
        }
        let autoIncrementId='';
        if(studentdata.stdclass>='1'||studentdata.stdclass<='9'){
            autoIncrementId=autoIncrementId+tyear+'0'+studentdata.stdclass+tempAutoIncrementId;
        }else if(studentdata.stdclass==='10'){
            autoIncrementId=autoIncrementId+tyear+studentdata.stdclass+tempAutoIncrementId;
        }else if(studentdata.stdclass==='nursery'){
            autoIncrementId=autoIncrementId+tyear+'11'+tempAutoIncrementId;
        }else if(studentdata.stdclass==='LKG'){
            autoIncrementId=autoIncrementId+tyear+'12'+tempAutoIncrementId;
        }else{
            autoIncrementId=autoIncrementId+tyear+'13'+tempAutoIncrementId;
        }
        //auto increment id ends here

    let response;
    try{
        // const responsecheck = await studentdatabase.find({stdregid:studentdata.stdautoregornot?autoIncrementId:studentdata.stdregid});
            response = await studentdatabase.create({
                stdautoregornot:studentdata.stdautoregornot,//student registration auto enerate or not
                stdregid:studentdata.stdautoregornot?autoIncrementId:studentdata.stdregid, //student registration id
                    //student details
                stdfirstname:studentdata.stdfirstname,//student first name
                stdmiddlename:studentdata.stdmiddlename,//student middle name
                stdlastname:studentdata.stdlastname,//student last name
                stddob:studentdata.stddob,//student date of birth
                stdgender:studentdata.stdgender,//student gender
                stdclass:studentdata.stdclass,//student class
                stdsectionid:studentdata.stdsectionid,//student section id
                stdjoingyear:studentdata.stdjoingyear,//student joing year
                stdprevschool:studentdata.stdprevschool,// student previous school if any
                stdprevschtc:studentdata.stdprevschtc,//previous school tc link
        
                stdparentorguard:studentdata.stdparentorguard,// student have guardian or parent-> false represents parent 
        
                    //parent details
        
                    //father details
                stdfatherfirstname:studentdata.stdfatherfirstname,//student father first name
                stdfathermiddlename:studentdata.stdfathermiddlename,//student father middle name
                stdfatherlastname:studentdata.stdfatherlastname,//student father last name
                stdfatheroccupation:studentdata.stdfatheroccupation,//student father occupation
                stdfatheremail:studentdata.stdfatheremail,//student father email
                    stdfatherphone:studentdata.stdfatherphone,//student father mobile number
        
                    //mother details
                    stdmotherfirstname:studentdata.stdmotherfirstname,//student mother first name
                    stdmothermiddlename:studentdata.stdmothermiddlename,//student mother middle name
                    stdmotherlastname:studentdata.stdmotherlastname,//student mother last name
                    stdmotheroccupation:studentdata.stdmotheroccupation,//student mother occupation
                    stdmotheremail:studentdata.stdmotheremail,//student mother email
                    stdmotherphone:studentdata.stdmotherphone,//student mother phone
        
        
                    //guardian details
                    stdguardfirstname:studentdata.stdguardfirstname,//student guardian first name
                    stdguardmiddlename:studentdata.stdguardmiddlename,//student guardian middle name
                    stdguardlastname:studentdata.stdguardlastname,//student guardian  last name
                    stdguardoccupation:studentdata.stdguardoccupation,//student guardian occupation name
                    stdguardemail:studentdata.stdguardemail,//student guardian email
                    stdguardphone:studentdata.stdguardphone,//student guardian mobile number
        
        
                    //Address Details
        
                    //temporary address
                    stdtempaddhousenum:studentdata.stdtempaddhousenum,//student temporary address house number
                    stdtempaddstreet:studentdata.stdtempaddstreet,//student temporary address street
                    stdtempaddcity:studentdata.stdtempaddcity,//student temporary address city
                    stdtempadddistrict:studentdata.stdtempadddistrict,//student temporary address district
                    stdtempaddstate:studentdata.stdtempaddstate,//student temporary address state
                    stdtempaddpincode:studentdata.stdtempaddpincode,//student temporary address pincode
                    stdtempaddcountry:studentdata.stdtempaddcountry,//student temporary address country
        
                    stdtempandpermsame:studentdata.stdtempandpermsame,// student permanent address and temporary address are same
                    //permanent address
                    stdpermaddhousenum:studentdata.stdpermaddhousenum,//student permanent address house number
                    stdpermaddstreet:studentdata.stdpermaddstreet,//student permanent address street
                    stdpermaddcity:studentdata.stdpermaddcity,//student permanent address city
                    stdpermadddistrict:studentdata.stdpermadddistrict,//student permanent address district
                    stdpermaddstate:studentdata.stdpermaddstate,//student permanent address state
                    stdpermaddpincode:studentdata.stdpermaddpincode,//student permanent address pincode
                    stdpermaddcountry:studentdata.stdpermaddcountry,//student permanent address country
        
                //fee details
                stdtotalfee:studentdata.stdtotalfee,//student total fee
                stdtotalpaid:studentdata.stdtotalpaid,//student total fee paid
                stdfeediscount:studentdata.stdfeediscount,//student fee discount

                //transportfee details
                stdtransportfeestatus:studentdata.stdtransportfeestatus,
                stdtransporttotalfee:studentdata.stdtransporttotalfee,
                stdtransportfeepaid:studentdata.stdtransportfeepaid,
                stdtransportfrom:studentdata.stdtransportfrom,
                transportstartdate:studentdata.transportstartdate,
                //referred by some one
                stdrefsomeone:studentdata.stdrefsomeone,//is some one referred the student
                stdreferredid:studentdata.stdreferredid//referred id
                });
       
        
        // console.log('Data saved successfully',response)
    }catch(error){
        console.error('Error while creating student : ',error);
        if(error.code===11000){
            return { success: false, message: 'student registration id alredy exist\'s' };
        }
        return { success: false, message: 'you got an error while compoleting the admission' };
    }

    if(response){
        try{
            const secondresponse = await usersDatabase.create({
                username:studentdata.stdautoregornot?autoIncrementId:studentdata.stdregid,//registration number
                email:studentdata.stdfatheremail,//teachers email
                mobile:studentdata.stdfatherphone,
                password:studentdata.stdautoregornot?autoIncrementId:studentdata.stdregid,
                role:'student'
            });
            if(secondresponse){
                return { success: true,studentregid:studentdata.stdautoregornot?autoIncrementId:studentdata.stdregid, message: 'admission  successfully completed' };
            }else{
                await studentdatabase.deleteOne({stdregid:studentdata.stdautoregornot?autoIncrementId:studentdata.stdregid});
                return {success:false,message:'getting an error while creating the user regid and password'};
            }
        }catch(err){
            await studentdatabase.deleteOne({stdregid:studentdata.stdautoregornot?autoIncrementId:studentdata.stdregid});
            if(err.code===11000){
                return {success:false,message:'the Registration number  already exists'};
            }else{
                return {success:false,message:'getting an error while creating the user regid and password'};
            }
            
        }
        
        
        
    }else{
        return {success:false,message:'getting error while creating the student in student table'};
    }
}

async function getStudentsToSecAssign(classData){
    try{
        const response = await studentdatabase.find({stdclass:classData.class});
        if(response){
            return {success:true,studentsdata:response};
        }
        return {success:false};
    }catch(err){
        console.log('getting an error while fetching the students data to assign the sections in model',err);
        return {success:false};
    }
}

async function updateStudentSectionModel(studentData){
    try{
        const response = await studentdatabase.updateOne({stdregid:studentData.stdregid},{stdsectionid:studentData.stdsectionid});
        if(response){
            return {success:true};
        }else{
            return {success:false};
        }
    }catch(err){
        console.log('you getting an error while updating the student section model',err);
        return {success:false};
    }
}

async function getStudentsClassAndSectionModel(classInfo){
    try{
        const response = await studentdatabase.find({stdclass:classInfo.class,stdsectionid:classInfo.section});
        if(response){
            return {success:true,studentsdata:response};
        }else{
            return {success:false};
        }
    }catch(err){
        console.log('getting error in student model while fetching get students ',err);
        return {success:false};
    }
}

async function getParticularSectionStudentsModel(stdsecinfo){
    try{
        const response = await studentdatabase.find({stdclass:stdsecinfo.class,stdsectionid:stdsecinfo.section});
        if(response){
            return {success:true,studentsdata:response};
        }else{
            return {success:false};
        }
    }
    catch(err){
        console.log('getting an error while fetching section students data ',err);
        return {success:false};
    }
}

module.exports={
    createStudent,
    getStudentsToSecAssign,
    updateStudentSectionModel,
    getStudentsClassAndSectionModel,
    getParticularSectionStudentsModel
};