const {createStudentController, getStudentsToAssignSections, 
    updateStudentSection, getStudentsClassAndSection,
    getParticularSectionStudents} = require('./student.controller');
const express = require('express');
const studentRouter = express.Router();
studentRouter.post('/createstudent',createStudentController);
studentRouter.post('/getstudentstoassignsection',getStudentsToAssignSections); //Get students To Assign Sections
studentRouter.post('/getstudents',getStudentsClassAndSection); //Here We Have to Get All The Students
studentRouter.put('/updatestudentsection',updateStudentSection); // Update The Student Section
studentRouter.post('/getstudentsofasection',getParticularSectionStudents); // to get the students of particular section

module.exports = studentRouter;