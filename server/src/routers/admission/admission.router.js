const express = require('express');
const {addAdmissionData,getAdmissionData,
    getApplicationStatus, getApprovedData,
    updateApplicationData,
    updatingAdmissionData} = require('./admission.controller');
const { authMiddleware } = require('../../middlewares/authentication/authMiddleware');
const admissionRouter = express.Router();
admissionRouter.get('/',authMiddleware,getAdmissionData);//protect route for getting application data
admissionRouter.post('/',addAdmissionData);//application form data adding here
admissionRouter.post('/checkappstatus',getApplicationStatus);//users check their application status
admissionRouter.get('/admissionsdata',authMiddleware,getApprovedData);//protected route for get approvedthe application data
admissionRouter.put('/updateapplicationdata',authMiddleware,updateApplicationData);//protected for pdating the application data
admissionRouter.put('/updatingadmissiondata',authMiddleware,updatingAdmissionData);//protected the routing for updating the admission data
module.exports=admissionRouter;