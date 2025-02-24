const express = require('express');
const { addtimeTableController, getTimeTableController, updateTimeTableController } = require('./timetable.controller');
const timetableRouter = express.Router();
timetableRouter.post('/addtimetable',addtimeTableController);
timetableRouter.post('/gettimetable',getTimeTableController);
timetableRouter.put('/updatetimetable',updateTimeTableController);
module.exports = timetableRouter;