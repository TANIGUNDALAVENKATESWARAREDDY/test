const express = require('express');
const { addNewTeacherController, getAllTeachersController, 
    getEachTeacherDataController } = require('./teachers.controller');

const teachersRouter = express.Router();
teachersRouter.post('/addnewteacher',addNewTeacherController);
teachersRouter.get('/getallteachers',getAllTeachersController);
teachersRouter.get('/getEachTeacher/:teacherid',getEachTeacherDataController);

module.exports = teachersRouter;