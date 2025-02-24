const express = require('express');
const { payStudentFee, getStudentsFeeHistory, getEachStudentHistory, tempUpdatefeeDiscountPaid, studentsFeeHistoryController } = require('./feehistory.controller');
const feeHistoryRouter = express.Router();
feeHistoryRouter.post('/paystudentfee',payStudentFee);
feeHistoryRouter.post('/getstudentsfeehistory',getStudentsFeeHistory);
feeHistoryRouter.post('/studentsfeehistory',studentsFeeHistoryController);
feeHistoryRouter.get('/eachStudentHistory/:classid/:regid',getEachStudentHistory);
feeHistoryRouter.post('/tempupdatefeediscountpaid',tempUpdatefeeDiscountPaid);
module.exports = feeHistoryRouter;
