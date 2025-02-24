const express = require('express');
const { addNewCourseController , getAllCoursesData } = require('./courses.controller');
const coursesRouter = express.Router();
coursesRouter.post('/addnewcourse',addNewCourseController);
coursesRouter.get('/getallcourses', getAllCoursesData);

module.exports = coursesRouter;