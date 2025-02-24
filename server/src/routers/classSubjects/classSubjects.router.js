const express = require('express');
const {AddClassSubject, GetAllClassesSubjects, 
    DeleteClassesSubjectController} = require('./classSubjects.controller');
const classSubjectRouter = express.Router();
classSubjectRouter.post('/addSubjectToClass',AddClassSubject);
classSubjectRouter.get('/getAllClassesSubjects',GetAllClassesSubjects);
classSubjectRouter.delete('/deleteaclasssubject/:classname/:subjectid',DeleteClassesSubjectController);

module.exports = classSubjectRouter;