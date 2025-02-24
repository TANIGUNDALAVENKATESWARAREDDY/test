const usersDatabase = require('../users.model/users.mongo');
const adminDatabase = require('./admin.mongo');

async function createNewAdminModel(adminData){
    try{

        const secResponse = await usersDatabase.create({
            username:adminData.adminregid,
            email:adminData.adminemail,
            mobile:adminData.adminmobilenumber,
            password:adminData.adminmobilenumber,
            role:'admin'
        });

        const response  = await adminDatabase.create({
            adminfirstname:adminData.adminfirstname,
            adminmiddlename:adminData.adminmiddlename,
            adminlastname:adminData.adminlastname,
            adminregid:adminData.adminregid,
            role:adminData.role,
            adminspecilizedsubject:adminData.adminspecilizedsubject,
            adminDOJ:adminData.adminDOJ,
            adminimgurl:adminData.adminimgurl,
            adminemail:adminData.adminemail,
            adminmobilenumber:adminData.adminmobilenumber,
            adminDOB:adminData.adminDOB,
            admingender:adminData.admingender,
            adminmaritalstatus:adminData.adminmaritalstatus,
            admintemporaryaddress:adminData.admintemporaryaddress,
            adminpermanentaddress:adminData.adminpermanentaddress,
            adminhighqualification:adminData.adminhighqualification,
            adminifotherquoalification:adminData.adminifotherquoalification,
            adminYOG:adminData.adminYOG,
            admingraduationclg:adminData.admingraduationclg,
            adminpreviouscompany:adminData.adminpreviouscompany,
            adminpreviousjobrole:adminData.adminpreviousjobrole,
            adminprevioussubjobrole:adminData.adminpreviousjobrole,
            adminworkexprienceyears:adminData.adminworkexprienceyears,
            adminpreviouskeyresponsibility:adminData.adminpreviouskeyresponsibility,
            emergencycontantname:adminData.emergencycontantname,
            emergencycontactrelationship:adminData.emergencycontactrelationship,
            emergencycontactnumber:adminData.emergencycontactnumber,
            emergencycontactemail:adminData.emergencycontactemail,
        });

        if(response && secResponse){
            return {success:true,message:"successfully created the admin"};
        }else{
            return {success:false, message:'error while adding admin'};
        }
    }catch(err){
        console.log('getting error in admin model',err);
        return {success:false,message:'getting error in admin model'};
    }
};

async function getAllAdminModel(){
    try{
        const response = await adminDatabase.find({});
        if(response){
            return {success:true , alladmins:response,message:'successfully fetched all admins'};
        }else{
            return {success:true, message:'error while fetching admins'};
        }
    }catch(err){
        console.log('getting error in admin model',err);
        return {success:false,message:'getting error in admin model'};
    }
}

async function getEachAdminData(adminid){
    try{
        const response = await adminDatabase.findOne({adminregid:adminid});
        if(response){
            return {success:true,admindata:response,message:'successfully fetched admin data'};
        }else{
            return {success:false,message:'user data not fetched'};
        }
    }catch(err){
        console.log('getting error while fetching admin data ',err);
        return {success:false, message:'getting error in amdin model'};
    }
}

module.exports ={
    createNewAdminModel,
    getAllAdminModel,
    getEachAdminData
}