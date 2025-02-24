const express = require('express');
const { createNewAdminController, getAllAdminController, getEachAdminDataController } = require('./admin.controller');
const adminRouter = express.Router();
adminRouter.post('/createadmin',createNewAdminController);
adminRouter.get('/getalladmins',getAllAdminController);
adminRouter.get('/getEachAdmin/:adminid',getEachAdminDataController);

module.exports = adminRouter;