const express = require('express');
const { transportFindStudentController, transportClassStudentsController, getAllStudentsTransportFeeController, enableStudentTransportController, 
    EnableEachStudentTransportController, DisableEachStudentTransportController, PayTransportFeeController, EachStudentTransportHistory } = require('./transportFeeHistory.controller');
const transportFeeRouter = express.Router();
transportFeeRouter.post('/findStudentTransport',transportFindStudentController); //finding the student transport
transportFeeRouter.post('/fetchTransportClassStudents',transportClassStudentsController); //fetch students who have transport yes
transportFeeRouter.get('/getAllStudentsTransportFeeHistory',getAllStudentsTransportFeeController);//fetching all students who have transport fee facility
transportFeeRouter.post('/EnableTransport',enableStudentTransportController);//each student transport enable get router
transportFeeRouter.post('/EnableEachStudentTransport',EnableEachStudentTransportController);//enablingthe student transport
transportFeeRouter.post('/DisableEachStudentTransport',DisableEachStudentTransportController); //disabling the student transport
transportFeeRouter.post('/PayStudentTransportFee',PayTransportFeeController);//paying the student transport fee
transportFeeRouter.get('/getEachStudentTranportHistory/:stdid',EachStudentTransportHistory);//lets the each student transport fee history


module.exports = transportFeeRouter