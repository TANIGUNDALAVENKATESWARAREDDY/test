// const usersDatabase = require('../users.model/users.mongo');
const admissionsdatabase = require('./admission.mongo');
async function saveAdmission(admissiondata){
    try{
        const today = new Date();

        function getRandomNumber(min, max){
            return Math.floor(Math.random() * (max - min) + min);
        }

        async function getLatestAdmissionNumber(){
            const DEFAULT_FLIGHT_NUMNER=2140110;

            const latestnumber = await admissionsdatabase.findOne().sort({'admissionid':-1});
            if(!latestnumber){
                return  DEFAULT_FLIGHT_NUMNER;
            }

            return latestnumber.admissionid;
        }

        const templatestnumber = parseInt(await getLatestAdmissionNumber())+getRandomNumber(0,3);

        // console.log('latest number is : ',templatestnumber);

        

        const response = await admissionsdatabase.create({
            academicyear:admissiondata.academicyear,
            class:admissiondata.class!==''?admissiondata.class:'nursery',
            surname:admissiondata.surname,
            gender:admissiondata.gender,
            studentname:admissiondata.studentname,
            dob:admissiondata.dob,
            age:Number(admissiondata.age),
            placeofbirth:admissiondata.placeofbirth,
            nationality:admissiondata.nationality,
            nameofps:admissiondata.nameofps,
            fathername:admissiondata.fathername,
            mothername:admissiondata.mothername,
            mobileno:Number(admissiondata.mobileno),
            altmobileno:admissiondata.altmobileno!==''?Number(admissiondata.altmobileno):0,
            emailid:admissiondata.emailid,
            city:admissiondata.city,
            state:admissiondata.state,
            pincode:Number(admissiondata.pincode),
            admissionid:templatestnumber,
            dateofsub:today,
            admamtpaidornot:true,
            stdregid:admissiondata.stdregid,
            parentregid:admissiondata.parentregid,
            admstatus:admissiondata.admstatus,
            appstatus:admissiondata.appstatus
        });
        
        return { success: true,applicationId:templatestnumber, message: 'application  successfully completed' };
    }catch(error){
        console.error('Error saving admission data:', error);
        return { success: false, message: 'you got an error while taking the admission' };
    }
}

async function checkapplicationstatus(checkappdtls){
    try{
        const application = await admissionsdatabase.findOne({admissionid:checkappdtls.appid,dob:checkappdtls.dob});
        if(application){
            // console.log('here is your application: ',application);
            return {success:true ,application:application, message:'application found'};
        }else{
            return {success:false , message :'application not found'};
        }
        
        
    }catch(error){
        console.error('Error while check application details: ',error);
        return {success:false, message:'you getting error while checking the application status'};
    }
}

async function AllApplicationsData(){
    try{
        const allApplications =  await admissionsdatabase.find({});
        if(allApplications){
            
            return {allApplications:allApplications,success:true};
        }else{
            console.log('getting an error while fetching all the all applications');
            return {success:false};
        }
    }catch(err){
        console.log('Getting Error While Fetching all applications data: ',err);
    }
}

async function AllAdmissionsData(){
    try{
        const alladmissionsdata = await admissionsdatabase.find({appstatus:'approved'});
        // console.log('here is the approved admissions data',alladmissionsdata);
        if(alladmissionsdata){
            return {alladmissionsdata:alladmissionsdata,success:true};
        }else{
            console.log("getting error while fetching all the approved applications");
            return {success:false};
        }
    }catch(err){
        console.log('Getting Error While Fetching Approved Applications Data: ',err);
    }
}

async function UpdateApplicationData(data){
    try{
        const updatedApplicationData = await admissionsdatabase.updateOne({admissionid:data.admissionid},
            {
                ...data,
                pincode:Number(data.pincode),
                altmobileno:data.altmobileno!==''?Number(data.altmobileno):0,
                mobileno:Number(data.mobileno),
                age:Number(data.age)

            });
        if(updatedApplicationData){
            return {updatedApplicationData:updatedApplicationData,success:true};
        }else{
            console.log('getting error while updating the application data');
            return {success:false};
        }
    }catch(err){
        console.log('getting error while updating the application data',err);
    }
}

async function UpdateApplicationThreeField(field1 , value1 , id, field2 , value2 , field3, value3){
    try{
        const updatedApplicationData = await admissionsdatabase.updateOne({admissionid:Number(id)},
            {
                [field1]:value1,
                [field2]:value2,
                [field3]:value3,
                
            });
        if(updatedApplicationData){
            const oneApplicationData = await admissionsdatabase.findOne({admissionid:Number(id)});
            if(oneApplicationData){
                return {updatedApplicationData:oneApplicationData,success:true};
            }
            return {updatedApplicationData:null,success:true}
            
        }else{
            console.log('getting error while updating the application data');
            return {success:false};
        }
    }catch(err){
        console.log('getting error while updating the application data',err);
    }
}

module.exports = {
    saveAdmission,
    checkapplicationstatus,
    AllApplicationsData,
    AllAdmissionsData,
    UpdateApplicationData,
    UpdateApplicationThreeField
};