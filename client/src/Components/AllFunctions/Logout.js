// import {useDispatch} from 'react-redux'
import { allAdminsClearData } from '../../ReduxStates/Adminsdata/AllAdminsData';
import { clearAllCoursesData } from '../../ReduxStates/Coursesdata/AllCoursesData';
import { clearClassChaptersData } from '../../ReduxStates/Coursesdata/ClassChaptersData';
import { clearClassSubjectsData } from '../../ReduxStates/Coursesdata/ClassSubjectsData';
import { clearClassTopicsData } from '../../ReduxStates/Coursesdata/ClassTopicsData';
import { clearSubjectTeachersData } from '../../ReduxStates/Coursesdata/subjectTeachersData';
import { clearAssignStudentSection } from '../../ReduxStates/Studentsdata/Assignstudentsec';
import { clearGetStudents } from '../../ReduxStates/Studentsdata/Getstudents';
import { clearStdFeeHistory } from '../../ReduxStates/Studentsdata/Stdfeehistory';
import { clearTeachersData } from '../../ReduxStates/Teachersdata/Teachersdata';
import { clearAllAdmissions } from '../../ReduxStates/Alladmissions';
import { clearAllApplications } from '../../ReduxStates/AllApplications';
import { clearBasicStates } from '../../ReduxStates/BasicStates';
import { clearFetchedFeeList } from '../../ReduxStates/Feelist';
import { clearFetchedSections } from '../../ReduxStates/Sections';
import { clearStoredUserData } from '../../ReduxStates/Userdata';
import { clearViewTimetableData } from '../../ReduxStates/Timetabledata/ViewTimetabledata';
import { socket } from '../../Data/Docs';
import { clearStudentsTransportFeehistory } from '../../ReduxStates/Transportfeedata/Transportfeehistory';
// import { useNavigate } from 'react-router-dom';

export const Logout = (dispatch,navigate) =>{
    socket.removeAllListeners();//removing all listeners
    //Adminsdata
    dispatch(allAdminsClearData());//clearing the admins data

    //Courses data
    dispatch(clearAllCoursesData());//clearing wholec ourses data
    dispatch(clearClassChaptersData());//clearing class chapters data
    dispatch(clearClassSubjectsData());//clearing the class subjects data
    dispatch(clearClassTopicsData());//clearing the class topics data
    dispatch(clearSubjectTeachersData());//clearing the subject teacher data


    //studentsdata
    dispatch(clearAssignStudentSection());//clearing the assign students section
    dispatch(clearGetStudents());//clearing the getting students
    dispatch(clearStdFeeHistory());//clearing the students fee history


    //teachersdata
    dispatch(clearTeachersData());//clearing the teachers data

    //timetable data
    dispatch(clearViewTimetableData());//clearing the timetable data

    //not in folders
    dispatch(clearAllAdmissions());//clearing all fetched admissions data
    dispatch(clearAllApplications());//clear all application data
    dispatch(clearBasicStates());//clearing all basic states
    dispatch(clearFetchedFeeList());//clearing all fetched feelist
    dispatch(clearFetchedSections());//clearing all stored sections
    dispatch(clearStoredUserData());//clearing all stored users data
    dispatch(clearStudentsTransportFeehistory());//clearing students transport fee history
    navigate('/');

    
}