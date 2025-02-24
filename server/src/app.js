const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const admissionRouter = require('./routers/admission/admission.router');
const studentRouter = require('./routers/student/student.router');
const sectionsRouter = require('./routers/sections/sections.router');
const feelistRouter = require('./routers/feelist/feelist.router');
const feeHistoryRouter = require('./routers/feehistory/feehistory.router');
const coursesRouter = require('./routers/courses/courses.router');
const timetableRouter = require('./routers/timetable/timetable.router');
const teachersRouter = require('./routers/teachers/teachers.router');
const classSubjectRouter = require('./routers/classSubjects/classSubjects.router');
const classChapterRouter = require('./routers/classChapters/classChapters.router');
const classTopicsRouter = require('./routers/classTopics/classTopics.router');
const usersRouter = require('./routers/users/users.router');
const adminRouter = require('./routers/admin/admin.router');
const subjectTeachersRouter = require('./routers/subjectTeachers/subjectTeachers.router');
const { authMiddleware } = require('./middlewares/authentication/authMiddleware');
const staffRouter = require('./routers/staff/staff.router');
const teacherClassesRouter = require('./routers/teacherClasses/teacherClasses.router');
const townsRouter = require('./routers/towns/towns.router');
const transportFeeRouter = require('./routers/transportFeeHistory/transportFeeHistory.router');
// const checkdata = require('./checkdata');

const app = express();

const allowedOrigins =process.env.NODE_ENV === 'production'?['https://smsvis.netlify.app','https://sms.vivekanandainternationalschools.com']:['https://smsvis.netlify.app','http://localhost:3000','https://sms.vivekanandainternationalschools.com'];// website we are going to allow to access or request the methods
//here is the middleware to access the websites
app.use(cors({
    origin:function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS ${origin}`));
        }
    },
    credentials:true //allow credientials  to store 
}));

app.use(helmet());//security middlerware

app.use(express.json());
app.use(cookieParser());

//here we have some of the public routes and routes with protected
// app.get('/',checkdata);

app.use('/admissionform',admissionRouter);
app.use('/users',usersRouter);


app.use(authMiddleware);//authentication middleware

//here all the routes must protected
app.use('/staff',staffRouter);
app.use('/student',studentRouter);
app.use('/sections',sectionsRouter);
app.use('/feelist',feelistRouter);
app.use('/studentfee',feeHistoryRouter);//fee history
app.use('/courses',coursesRouter);
app.use('/timetable',timetableRouter);
app.use('/teachers',teachersRouter);
app.use('/teacherclasses',teacherClassesRouter);
app.use('/classSubjects',classSubjectRouter);
app.use('/classChapters',classChapterRouter);
app.use('/classTopics',classTopicsRouter);
app.use('/towns',townsRouter);
app.use('/transportHistory',transportFeeRouter);

app.use('/admin',adminRouter);
app.use('/subjectTeachers',subjectTeachersRouter)
module.exports = app;