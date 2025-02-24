const usersDatabase = require("../users.model/users.mongo");
const staffDatabase = require("./staff.mongo");

async function createNewStaffModel(staffData){
    let response;
    try{
        response = await usersDatabase.create({
            username:staffData.staffregid,
            email:staffData.staffemail,
            mobile:staffData.staffmobilenumber,
            password:staffData.staffmobilenumber,
            role:'staff'
        })
    }catch(err){
        console.log('gettin an error while creating the staff',err);
        return {success:false,message:'getting error in staff model '};
    }

    let response2;
    try{
        if(response){
            response2 = await staffDatabase.create({
                stafffirstname:staffData.stafffirstname,
                staffmiddlename:staffData.staffmiddlename,
                stafflastname:staffData.stafflastname,
                staffregid:staffData.staffregid,
                role:staffData.role,
                staffDOJ:staffData.staffDOJ,
                staffimgurl:staffData.staffimgurl,
                staffemail:staffData.staffemail,
                staffmobilenumber:staffData.staffmobilenumber,
                staffDOB:staffData.staffDOB,
                staffgender:staffData.staffgender,
                staffmaritalstatus:staffData.staffmaritalstatus,
                stafftemporaryaddress:staffData.stafftemporaryaddress,
                staffpermanentaddress:staffData.staffpermanentaddress,
                staffhighqualification:staffData.staffhighqualification,
                staffpreviouswork:staffData.staffpreviouswork,//just take input
                staffpreviousrole:staffData.staffpreviousrole,
                staffworkexperienceyears:staffData.staffworkexperienceyears,
                emergencycontactname:staffData.emergencycontactname,
                emergencycontactrelationship:staffData.emergencycontactrelationship,
                emergencycontactnumber:staffData.emergencycontactnumber,
                emergencycontactemail:staffData.emergencycontactemail
            });
            if(response2){
                return {success:true,message:'successfully created the staff'};
            }
        }
        return {success:false,message:'getting an error while creating the staff'};
    }catch(err){
        await usersDatabase.deleteOne({username:staffData.staffregid});
        console.log('getting an error while creaing the staff ',err);
        return {success:false,message:'getting an error while creating the staff'};
    }
}

module.exports={
    createNewStaffModel
}