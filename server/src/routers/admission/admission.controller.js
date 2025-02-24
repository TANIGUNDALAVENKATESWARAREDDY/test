const {saveAdmission,checkapplicationstatus , AllApplicationsData, AllAdmissionsData, UpdateApplicationData} = require('../../models/admission.model/admission.model');
const {getSocketIO} = require('../../utils/socket');
async function addAdmissionData(req,res){
    console.log('You requested with the POST method from the frontend');
    const result = await saveAdmission(req.body);
    if (result.success) {
        return res.status(201).json({success:true,applicationId:result.applicationId, message: 'Application completed successfully' });
    } else {
        return res.status(500).json({success:false, message: 'Failed to save admission data' });
    }
}

async function getAdmissionData(req,res){
    const result = await AllApplicationsData();
    if(result.success){
        return res.status(201).json({data:result.allApplications});
    }
    return res.status(404).json({data:[]});
}

async function getApplicationStatus(req,res){
    console.log('you requested the application status...');
    const appstatus = await checkapplicationstatus(req.body);
    if(appstatus.success){
        return res.status(201).json({success:true,application:appstatus.application, message: appstatus.message });
    }else{
        return res.status(500).json({success:false,message:appstatus.message});
    }
}

async function getApprovedData(req,res){
    const result = await AllAdmissionsData();
    if(result.success){
        return res.status(201).json({data:result.alladmissionsdata});
    }
    return res.status(404).json({data:[]});
}

async function updateApplicationData(req,res){
    const result = await UpdateApplicationData(req.body);
    if(result.success){
        const io = getSocketIO();

        io.emit('applicationDataUpdated',{data:req.body,});
        if(req.body.appstatus==='approved'){
            io.emit('applicationToAdmission',{data:req.body});
        }

        return res.status(201).json({data:result.updatedApplicationData});
    }
    return res.status(404).json({data:{}});
}

async function updatingAdmissionData(req,res){
    const result = await UpdateApplicationData(req.body);
    if(result.success){
        const io = getSocketIO();
        io.emit('updatingAdmissionData',{data:req.body});
        return res.status(201).json({data:result.updatedApplicationData});
    }
    return res.status(404).json({data:{}});
}

module.exports = {
    addAdmissionData,
    getAdmissionData,
    getApplicationStatus,
    getApprovedData,
    updateApplicationData,
    updatingAdmissionData
};