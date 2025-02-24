const express = require('express');
const { addTeacherController, deleteTeacherController, getAllSubjectTeachersController } = require('./subjectTeachers.controller');
const subjectTeachersRouter = express.Router();
subjectTeachersRouter.post('/addSubjectTeacher',addTeacherController);
subjectTeachersRouter.delete('/deleteSubjectTeacher/:subjectid/:teacherid',deleteTeacherController);
subjectTeachersRouter.get('/getAllSubjectTeachers',getAllSubjectTeachersController);
module.exports = subjectTeachersRouter