const express = require('express');
const { handleUpdateTeacherClasses, modifyTimeTableSubjectController } = require('./teacherClasses.controller');
const teacherClassesRouter = express.Router();
teacherClassesRouter.post('/modifyteacherclass',handleUpdateTeacherClasses);
teacherClassesRouter.post('/modifyClassAndTeacherSubject',modifyTimeTableSubjectController);
module.exports=teacherClassesRouter;