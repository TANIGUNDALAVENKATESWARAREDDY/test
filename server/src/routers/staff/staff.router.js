const express = require('express');
const { createNewStaffController } = require('./staff.controller');
const staffRouter = express.Router();
staffRouter.post('/createNewStaff',createNewStaffController);

module.exports = staffRouter;