import { configureStore } from "@reduxjs/toolkit";
import BasicStates from "./BasicStates";
import AllApplications from "./AllApplications";
import Alladmissions from "./Alladmissions";
import Sections from "./Sections";
import Feelist from "./Feelist";
import Assignstudentsec from "./Studentsdata/Assignstudentsec";
import Getstudents from "./Studentsdata/Getstudents";
import Stdfeehistory from "./Studentsdata/Stdfeehistory";
import AllCoursesData from "./Coursesdata/AllCoursesData";
import ClassSubjectsData from "./Coursesdata/ClassSubjectsData";
import ViewTimetabledata from "./Timetabledata/ViewTimetabledata";
import  ClassChaptersData from "./Coursesdata/ClassChaptersData";
import ClassTopicsData  from "./Coursesdata/ClassTopicsData";
import Userdata from "./Userdata";
import AllAdminsData from "./Adminsdata/AllAdminsData";
import subjectTeachersData from "./Coursesdata/subjectTeachersData";
import Teachersdata from "./Teachersdata/Teachersdata";
import townsData from "./Townsdata/Townsdata";
import Transportfeehistory from "./Transportfeedata/Transportfeehistory";


export const Store = configureStore({
    reducer:{
        basicstates:BasicStates,
        allapplications:AllApplications,
        alladmissions:Alladmissions,
        sections:Sections,
        feelist:Feelist,
        assignstudentsec:Assignstudentsec,
        getstudents:Getstudents,
        stdfeehistory:Stdfeehistory,
        allcoursesdata:AllCoursesData,
        classsubjectsdata:ClassSubjectsData,
        viewtimetabledata:ViewTimetabledata,
        classchaptersdata:ClassChaptersData,
        classtopicsdata:ClassTopicsData,
        userdata:Userdata,
        alladminsdata:AllAdminsData,
        subjectteachersdata:subjectTeachersData,
        teachersdata:Teachersdata,
        townsdata:townsData,
        transportfeehistory:Transportfeehistory
    },
});
