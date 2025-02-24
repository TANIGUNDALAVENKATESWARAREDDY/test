import React, { useEffect, useRef, useState } from "react";
import './Createtimetable.css';
import Sidenav from "../../../Sidenav/Sidenav";
import Topnav from "../../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addedNewSection, sectionModified, updateSections } from "../../../../ReduxStates/Sections";
import { API_URL, socket } from "../../../../Data/Docs";
import { storeAllCoursesData, updateAddNewCourseData } from "../../../../ReduxStates/Coursesdata/AllCoursesData";
import { addNewSubjectToClass, deleteSubjectFromClass, storeClassSubjectsData } from "../../../../ReduxStates/Coursesdata/ClassSubjectsData";
import { storeAllTeachersData } from "../../../../ReduxStates/Teachersdata/Teachersdata";
import { addNewTeacherToSubject, deleteAddedTeacherOfSubject, storeAllSubjectTeachersData } from "../../../../ReduxStates/Coursesdata/subjectTeachersData";
// import Edittimetable from "../Edittimetable/Edittimetable";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
function Createtimetable(){
    const navigate = useNavigate();
    //actual timetable data
    const [timetableData , setTimetableData] = useState({
        class:'',
        sectionid:'',
        totalperiods:7,
        totalbreaks:2,
        break1:{
            starttime:'',
            endtime:'',
            duration:0
        },
        break2:{
            starttime:'',
            endtime:'',
            duration:0
        },
        break3:{
            starttime:'',
            endtime:'',
            duration:0
        },
        lunchbreak:{
            starttime:'',
            endtime:'',
            duration:0
        },
        period1:{starttime:'',endtime:'',duration:0},
        period2:{starttime:'',endtime:'',duration:0},
        period3:{starttime:'',endtime:'',duration:0},
        period4:{starttime:'',endtime:'',duration:0},
        period5:{starttime:'',endtime:'',duration:0},
        period6:{starttime:'',endtime:'',duration:0},
        period7:{starttime:'',endtime:'',duration:0},
        period8:{starttime:'',endtime:'',duration:0},
        period9:{starttime:'',endtime:'',duration:0},
        period10:{starttime:'',endtime:'',duration:0},
        monday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        tuesday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
          wednesday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        thursday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        friday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        saturday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
    });

    //storing the temparory data
    const [previousTimetableData , setPreviousTimetableData] = useState({
        class:'',
        sectionid:'',
        totalperiods:7,
        totalbreaks:2,
        break1:{
            starttime:'',
            endtime:'',
            duration:0
        },
        break2:{
            starttime:'',
            endtime:'',
            duration:0
        },
        break3:{
            starttime:'',
            endtime:'',
            duration:0
        },
        lunchbreak:{
            starttime:'',
            endtime:'',
            duration:0
        },
        period1:{starttime:'',endtime:'',duration:0},
        period2:{starttime:'',endtime:'',duration:0},
        period3:{starttime:'',endtime:'',duration:0},
        period4:{starttime:'',endtime:'',duration:0},
        period5:{starttime:'',endtime:'',duration:0},
        period6:{starttime:'',endtime:'',duration:0},
        period7:{starttime:'',endtime:'',duration:0},
        period8:{starttime:'',endtime:'',duration:0},
        period9:{starttime:'',endtime:'',duration:0},
        period10:{starttime:'',endtime:'',duration:0},
        monday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        tuesday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
          wednesday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        thursday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        friday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
        saturday: {
            period1: { subjectid: '', teacherid: '' },
            period2: { subjectid: '', teacherid: '' },
            period3: { subjectid: '', teacherid: '' },
            period4: { subjectid: '', teacherid: '' },
            period5: { subjectid: '', teacherid: '' },
            period6: { subjectid: '', teacherid: '' },
            period7: { subjectid: '', teacherid: '' },
            period8: { subjectid: '', teacherid: '' },
            period9: { subjectid: '', teacherid: '' },
            period10: { subjectid: '', teacherid: '' }
          },
    });

    //stroing the temp class and section storing the data
    // const [tempClassSec,setTempClassSec] = useState({
    //     class:'',
    //     sectionid:''
    // });

    const [findResponse , setFindResponse] = useState('');
    const[showloading ,setShowloading] = useState(false);
    const fetchCheckOnlyOnce = useRef(false);

    const classSections = useSelector((state)=>state.sections.data); //here is the class sections data
    const allCoursesData = useSelector((state)=>state.allcoursesdata.data);//here is the all courses data
    const classSubjectsData = useSelector((state)=>state.classsubjectsdata.data);// here is the class Subjects data
    const AllTeachersData = useSelector((state)=>state.teachersdata.data);
    const AllSubjectTeachers = useSelector((state)=>state.subjectteachersdata.data);



    const dispatch  = useDispatch();



    async function handleFindTimeTable(e){// to find the time table 
        e.preventDefault();
        try{
            if(timetableData.class!=='' && timetableData.sectionid!==''){
                const response = await fetch(`${API_URL}/timetable/gettimetable`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        class:timetableData.class,
                        sectionid:timetableData.sectionid
                    }),
                    credentials:'include'
                });
                const resData = await response.json();
                if(resData.success){
                    if(resData.core==='edit'||resData.core==='create'){
                        setFindResponse(resData.core);
                        if(resData.core==='edit'){
                            setTimetableData(prev=>({
                                ...prev,
                                ...resData.timetabledata
                            }));

                            setPreviousTimetableData(prev=>({
                                ...prev,
                                ...resData.timetabledata
                            }));

                            // console.log('here is the timetable data : ',resData);
                        }
                    }else{
                        setFindResponse('');
                    }
                    
                }
                // console.log('here is the response data : ',resData);
            }else{
                alert('please fill the required fields');
            }
        }catch(err){
            console.log('getting an error while fetching the class timetable',err);
        }
    }

    function handleTimeDifference(time1,time2){//time  diference , i mean duration
        const [starthours , startminutes] = time1.split(':').map(Number);
        const [endhours , endminutes] = time2.split(':').map(Number);
        const startTotalMinutes = starthours*60+startminutes;
        const endTotalMinutes = endhours*60+endminutes;
        return Math.abs(startTotalMinutes-endTotalMinutes);
    }

    function handleClassStartTimeInput(e,period){
        setTimetableData(prev=>({
            ...prev,
            [period]:{
                ...prev[period],
                starttime:e.target.value
            }
        }))

        if(timetableData[period].endtime!=='' && e.target.value!==''){
            const temptimediff = handleTimeDifference(e.target.value,timetableData[period].endtime);
            setTimetableData(prev=>({
                ...prev,
                [period]:{
                    ...prev[period],
                    duration:temptimediff
                }
            }))
        }
    }

    function handleClassEndTimeInput(e,period){
        setTimetableData(prev=>({
            ...prev,
            [period]:{
                ...prev[period],
                endtime:e.target.value
            }
        }))

        if(timetableData[period].starttime!=='' && e.target.value!==''){
            const temptimediff = handleTimeDifference(timetableData[period].starttime,e.target.value);
            setTimetableData(prev=>({
                ...prev,
                [period]:{
                    ...prev[period],
                    duration:temptimediff
                }
            }))
        }
    }

    async function handleCreateNewTimeTable(e){
        e.preventDefault();
        setShowloading(true);
        try{
            if(timetableData.class!=='' && timetableData.sectionid!=='' && timetableData.totalperiods!=='' && timetableData.totalbreaks!==''){
                const response = await fetch(`${API_URL}/timetable/addtimetable`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(timetableData),
                    credentials:'include'
                });
                const resData = await response.json();
                if(resData.success){
                    // setTimetableData(prev=>({
                    //     ...prev,
                    //     class:'',
                    //     sectionid:''
                    // }));
                    // setFindResponse('');
                    await handleFindTimeTable(e);

                }else{
                    alert('getting an error while adding the timetable');
                }
            }else{
                alert('please fill all required fields');
            }
        }catch(err){
            console.log('getting an error while adding the new time table',err);
        }
        setShowloading(false);
    }

    async function handleUpdateTimeTable(e){
        e.preventDefault();
        setShowloading(true);
        try{
            // console.log('requested for update time table')
            const response = await fetch(`${API_URL}/timetable/updatetimetable`,{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(timetableData),
                credentials:'include'
            });
            const resData = await response.json();
            if(resData.success){
                setTimetableData(prev=>({
                    ...prev,
                    class:'',
                    sectionid:''
                }));
                setFindResponse('');
                alert('successfully updated the data');
            }
        }catch(err){
            console.log('getting an error while pdating the timetable ',err);
        }
        setShowloading(false);
    }

    function getSubjectName(subID){//send the subject name
        const subjectname = allCoursesData.find(item=>item.courseuid===subID);
        return subjectname?subjectname.coursename:'no subject';
    }

    function getTeacherFullName(teacherID){//send the teachers name
        const teachersname = AllTeachersData.find(item=>item.teacherregid===teacherID);
        return teachersname?`${teachersname.teacherfirstname} ${teachersname.teachersmiddlename} ${teachersname.teacherslastname}`:'teacher not found';
    }

    //function to change the subject in timetable and mofiy teachers displaying
    async function modifyTimetablesubject(subjectData){
        setShowloading(true);
        try{
            const subjectres = await fetch(`${API_URL}/teacherclasses/modifyClassAndTeacherSubject`,{
                method:'POST',
                headers:{
                    "Content-Type":'application/json'
                },
                credentials:'include',
                body:JSON.stringify(subjectData)
            });
            const resData = await subjectres.json();
            if(!resData.success){
                alert(`${resData.message}`);
            }else{
                setTimetableData(prev=>({
                    ...prev,
                    [`${subjectData.day}`]:{
                        ...prev[`${subjectData.day}`],
                        [`${subjectData.period}`]:{
                            ...prev[`${subjectData.day}`][`${subjectData.period}`],
                            subjectid:subjectData.subjectid,
                            teacherid:''
                        }
                    }
                    }));
            }
        }catch(err){
            console.log('getting an error while changing the subject',err);
            alert('getting an error while updating the subject');
        }
        setShowloading(false);
    }


    //function to change the teacher timetabel and student timetable
    async function modifyTeacherClassesTime(teacherClassData){
        setShowloading(true);
        if(teacherClassData.starttime!=='' && teacherClassData.endtime!==''){
            try{
                const response = await fetch(`${API_URL}/teacherclasses/modifyteacherclass`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json",
                    },
                    credentials:'include',
                    body:JSON.stringify(teacherClassData)
                });
                const resData = await response.json();
                if(!resData.success){
                    alert(`${resData.message}`);
                }else{
                    // console.log('enter the dragon');
                    setTimetableData(prev=>({
                        ...prev,
                        [`${teacherClassData.day}`]:{
                            ...prev[`${teacherClassData.day}`],
                            [`${teacherClassData.period}`]:{
                                ...prev[`${teacherClassData.day}`][`${teacherClassData.period}`],
                                teacherid:teacherClassData.teacherid
                            }
                        }
                    }));
                }
            }catch(err){
                console.log('getting an error while updating the class teacher',err);
            }
        }else{
            alert('please provide the period start time and end time');
        }
        setShowloading(false)
    }
    
    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            // if(!socket.hasListeners('createtimetablelistening')){
            //     socket.on('createtimetablelistening',(subdata)=>{
            //         console.log('vclass data : ',timetableData.class);
            //         // if(timetableData.class===subdata.data.class){
            //             // console.log('here is the subdata',subdata.data);
            //         // }
            //     });
            // }

            //all class subjects data comes here
            if(classSubjectsData.length===0){
                const handleDeleteSubjectFromClass = (data) =>{
                    dispatch(deleteSubjectFromClass(data.data));
                }
                if(!socket.hasListeners('deleteasubjectfromclass')){
                    socket.on('deleteasubjectfromclass',handleDeleteSubjectFromClass);
                }

                const handleAddNewSubjectToClass = (data) =>{
                    dispatch(addNewSubjectToClass(data.data));
                }

                if(!socket.hasListeners('addednewsubjecttoclass')){
                    socket.on('addednewsubjecttoclass',handleAddNewSubjectToClass);
                }

                async function handleFetchAllClassSubjects(){
                    try{
                        const response = await fetch(`${API_URL}/classSubjects/getAllClassesSubjects`,{
                            credentials:'include'
                        });
                        const resdata = await response.json();
                        // console.log('here is the response data: ',resdata);
                        if(resdata.success){
                            // setClassSubjects(resdata.classsubjects);
                            dispatch(storeClassSubjectsData(resdata.classsubjects));
                        }else{
                            dispatch(storeClassSubjectsData([]));
                        }
                    }catch(err){
                        console.log('getting while fetching classes subjects',err);
                    }
                }
                handleFetchAllClassSubjects();
            }

            //all courses data comes here
            if(allCoursesData.length===0){
                const handleUpdateNewCourse = (data) =>{
                    dispatch(updateAddNewCourseData(data.data));
                }
                if(!socket.hasListeners('addednewcourse')){
                    socket.on('addednewcourse',handleUpdateNewCourse);
                }

                async function handleFetchAllCoursesData(){
                    try{
                        const response = await fetch(`${API_URL}/courses/getallcourses`,{
                            credentials:'include'
                        });
                        const resdata = await response.json();
                        if(resdata.success){
                            // console.log(resdata.allcourses);
                            dispatch(storeAllCoursesData(resdata.allcourses))
                        }
                    }catch(err){
                        console.log('getting an error while fetching all courses data',err);
                    }
                }
                handleFetchAllCoursesData();
            }
            
            //all class sections data
            if(classSections.length===0){

                const handleModifiedSection = (data)=>{//if data modified this function will triggered
                    dispatch(sectionModified(data.data));
                }

                if(!socket.hasListeners('sectionModified')){
                    socket.on('sectionModified',handleModifiedSection);
                }

                const handleAddedNewSection = (data) =>{//if new section is added this function will triggered
                    dispatch(addedNewSection(data.data));
                }

                if(!socket.hasListeners('addedNewSection')){
                    socket.on('addedNewSection',handleAddedNewSection);
                }

                async function fetchSections(){
                    try{
                        const response = await fetch(`${API_URL}/sections/getsections`,{
                            credentials:'include'
                        });
                        if(!response.ok){
                            throw new Error(`Httkp error! status: ${response.status}`);
                        }
                        const tempSections = await response.json();
                        if( tempSections.allSections.length>0){
                             dispatch(updateSections(tempSections.allSections));
                        }
                        // console.log('here is the all sections data',tempSections);
                    }catch(err){
                        console.log('getting error while fetching the sections data',err);
                    }
                }
                fetchSections();
            }

            //fetch all teachers data
            if(AllTeachersData.length===0){ //get all teachers data here
                async function fetchAllTeachersData(){
                    try{
                        // console.log('fetcing the teachers data');
                        const response = await fetch(`${API_URL}/teachers/getallteachers`,{
                            credentials:'include'
                        });
                        const resData = await response.json();
                        if(resData.success){
                            // console.log('teachers Data',resData);
                            dispatch(storeAllTeachersData(resData.teachersdata));
                        }
                    }catch(err){
                        console.log('getting an error while fetching teachers data',err);
                    }
                }
                fetchAllTeachersData();
            }

            //fetch all subject teachers
            if(AllSubjectTeachers.length===0){
                const handleAddNewSubjectTeacher =(data)=>{
                    dispatch(addNewTeacherToSubject(data.data));
                }
                if(!socket.hasListeners('addnewsubjectteacher')){
                    socket.on('addnewsubjectteacher',handleAddNewSubjectTeacher);
                }

                const handleDeleteAddedSubjectTeacher =(data)=>{
                    dispatch(deleteAddedTeacherOfSubject(data.data));
                }
                if(!socket.hasListeners('deleteAddedSubjectTeacher')){
                    socket.on('deleteAddedSubjectTeacher',handleDeleteAddedSubjectTeacher);
                }
                async function fetchAllSubjectTeacher(){
                    try{
                        const response = await fetch(`${API_URL}/subjectTeachers/getAllSubjectTeachers`,{
                            credentials:'include'
                        });
                        const resData = await response.json();
                        if(resData.success){
                            dispatch(storeAllSubjectTeachersData(resData.allSubTeachersData))
                        }else{
                            alert(`${resData.message}`);
                        }
                    }catch(err){
                        console.log('getting an error while fetching all subject teachers data',err);
                    }
                }
                fetchAllSubjectTeacher();
            }


            fetchCheckOnlyOnce.current = true;
        }

    },[classSections.length,AllTeachersData.length ,allCoursesData.length, AllSubjectTeachers.length,
        classSubjectsData.length, dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}

                        <div className='admissionform-top-back-btn' style={{marginBottom:5,marginTop:15}} onClick={()=>navigate(-1)} >
                            <KeyboardArrowLeftIcon/>
                            <p>back</p>
                        </div>

                        <form className="studentfeehistory-form" style={{marginBottom:20}}>
                            {/* form heading */}
                            <div className="studentfeehistory-form-heading">
                                <p>Create/Edit Class Timetable</p>
                            </div>

                            <div className="studentfeehistory-collecting-data">
                                <div className="studentfeehistory-collecting-data-each">
                                    <label>class</label>
                                    <select value={timetableData.class} onChange={(e)=>{
                                        setFindResponse('');
                                        setTimetableData(prev=>({
                                        ...prev,
                                        class:e.target.value
                                        }));
                                        
                                    }
                                }>
                                    <option value=''>Select Class</option>
                                        <option value="nursery">Nursery</option>
                                        <option value="LKG">LKG</option>
                                        <option value="UKG">UKG</option>
                                        <option value="1">Class 1</option>
                                        <option value="2">Class 2</option>
                                        <option value="3">Class 3</option>
                                        <option value="4">Class 4</option>
                                        <option value="5">Class 5</option>
                                        <option value="6">Class 6</option>
                                        <option value="7">Class 7</option>
                                        <option value="8">Class 8</option>
                                        <option value="9">Class 9</option>
                                        <option value="10">Class 10</option>
                                    </select>
                                </div>

                                <div className="studentfeehistory-collecting-data-each">
                                    <label>Section</label>
                                    <select value={timetableData.sectionid} onChange={(e)=>{
                                            setFindResponse('');
                                            setTimetableData(prev=>({
                                            ...prev,
                                            sectionid:e.target.value
                                            }));
                                        }
                                    }>
                                        <option value=''>select section</option>
                                        {
                                            classSections.filter((item)=>item.class===timetableData.class).map((item,idx)=>(
                                                <option key={idx} value={item._id}>{item.sectionname}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                {findResponse==='' && 
                                <div className="studentfeehistory-collecting-data-each">
                                    <button style={{whiteSpace:'nowrap'}} onClick={(e)=>handleFindTimeTable(e)}>Find</button>
                                </div>} 
                            </div>
                             {/* create time table */}
                             {findResponse!=='' && findResponse==='edit'?
                                <div className="createtimetable-create-ttdiv">
                                    {
                                        findResponse==='create'?
                                        <div className="createtimetable-create-tt-header">
                                            <h2>create time table</h2>
                                        </div>:
                                        <div className="createtimetable-create-tt-header">
                                            <h2>update time table</h2>
                                        </div>

                                    }
                                    

                                    <div className="studentfeehistory-collecting-data create-timetable-create-tt-whole-div">
                                        <div className="studentfeehistory-collecting-data-each">
                                            <label>Total classes (per day):</label>
                                            <input type='number' value={timetableData.totalperiods} onChange={(e)=>setTimetableData(prev=>({
                                                ...prev,
                                                totalperiods:e.target.value>10?10:e.target.value<0?0:e.target.value
                                            }))}/>
                                        </div>
                                        <div className="studentfeehistory-collecting-data-each">
                                            <label>total breaks (per day):</label>
                                            <input type='number' value={timetableData.totalbreaks} onChange={(e)=>setTimetableData(prev=>({
                                                ...prev,
                                                totalbreaks:e.target.value>3?3:e.target.value<0?0:e.target.value
                                            }))}/>

                                        </div>
                                        <div className="studentfeehistory-collecting-data-each">
                                            <label>lunch break</label>
                                            <input type='number' value={1} readOnly/>
                                        </div>
                                    </div>

                                    <h3 className="createtimetable-create-tt-sideheading">lunch break details</h3>
                                    <div className="studentfeehistory-collecting-data create-timetable-create-tt-whole-div">
                                        <div className="studentfeehistory-collecting-data-each">
                                            <label>lunch start time</label>
                                            <input type='time' value={timetableData.lunchbreak.starttime}
                                            onChange={(e)=>setTimetableData(prev=>({
                                                ...prev,
                                                lunchbreak:{
                                                    ...prev.lunchbreak,
                                                    starttime:e.target.value
                                                }
                                            }))}
                                            />
                                        </div>
                                        <div className="studentfeehistory-collecting-data-each">
                                            <label>lunch end time</label>
                                            <input type='time' value={timetableData.lunchbreak.endtime}
                                            onChange={(e)=>setTimetableData(prev=>({
                                                ...prev,
                                                lunchbreak:{
                                                    ...prev.lunchbreak,
                                                    endtime:e.target.value
                                                }
                                            }))}
                                            />
                                        </div>
                                        <div className="studentfeehistory-collecting-data-each">
                                            <label>Duration (mins)</label>
                                            <input type='number' value={(timetableData.lunchbreak.starttime!=='' && timetableData.lunchbreak.endtime!=='')?handleTimeDifference(timetableData.lunchbreak.starttime,timetableData.lunchbreak.endtime):timetableData.lunchbreak.duration} readOnly/>
                                        </div>
                                    </div>

                                    {/* break details */}
                                    {
                                        timetableData.totalbreaks>0 && 
                                        Array.from({length:timetableData.totalbreaks},(_,i)=>(
                                            <div key={i}>
                                                <h3 className="createtimetable-create-tt-sideheading">break {i+1} details</h3>
                                                <div className="studentfeehistory-collecting-data create-timetable-create-tt-whole-div">
                                                    <div className="studentfeehistory-collecting-data-each">
                                                        <label>Break start time</label>
                                                        <input type='time' value={timetableData[`break${i+1}`].starttime} 
                                                        onChange={(e)=>setTimetableData(prev=>({
                                                            ...prev,
                                                            [`break${i+1}`]:{
                                                                starttime:e.target.value,
                                                                endtime:prev[`break${i+1}`].endtime,
                                                                duration:prev[`break${i+1}`].duration
                                                            }
                                                        }))}/>
                                                    </div>
                                                    <div className="studentfeehistory-collecting-data-each">
                                                        <label>Break end time</label>
                                                        <input type='time' value={timetableData[`break${i+1}`].endtime}
                                                        onChange={(e)=>setTimetableData(prev=>({
                                                            ...prev,
                                                            [`break${i+1}`]:{
                                                                starttime:prev[`break${i+1}`].starttime,
                                                                endtime:e.target.value,
                                                                duration:prev[`break${i+1}`].duration
                                                            }
                                                        }))}
                                                        />
                                                    </div>
                                                    <div className="studentfeehistory-collecting-data-each">
                                                        <label>Duration (mins)</label>
                                                        <input type='number' value={(timetableData[`break${i+1}`].starttime!=='' && timetableData[`break${i+1}`].endtime!=='')?handleTimeDifference(timetableData[`break${i+1}`].starttime,timetableData[`break${i+1}`].endtime):timetableData[`break${i+1}`].duration} readOnly/>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    {/* classes timings */}
                                    {timetableData.totalperiods>0 && <h2 className="createtimetable-create-tt-classes-timings">classes timings</h2> }
                                    <div className="createtimetable-create-tt-classes">
                                        {timetableData.totalperiods>0 && 
                                            Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                <div key={i} className="createtimetable-create-tt-classes-each">
                                                    <h1>period {i+1}</h1>
                                                    <div className="createtimetable-create-tt-classes-each-time">
                                                        <div>
                                                            <label>start time</label>
                                                            <input type='time' value={timetableData[`period${i+1}`].starttime} onChange={(e)=>handleClassStartTimeInput(e,`period${i+1}`)}/>
                                                        </div>
                                                        <p>-</p>
                                                        <div>
                                                            <label>end time</label>
                                                            <input type='time' value={timetableData[`period${i+1}`].endtime} onChange={(e)=>handleClassEndTimeInput(e,`period${i+1}`)}/>
                                                        </div>
                                                    </div>
                                                    <p>duration : <span>{timetableData[`period${i+1}`].duration} mins</span></p>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {/* update button */}
                                    {
                                       ( (timetableData.totalperiods!== previousTimetableData.totalperiods) || (timetableData.totalbreaks!==previousTimetableData.totalbreaks) || (JSON.stringify(previousTimetableData.break1)!==JSON.stringify(timetableData.break1)) || (JSON.stringify(previousTimetableData.break2)!==JSON.stringify(timetableData.break2)) || (JSON.stringify(previousTimetableData.break3)!==JSON.stringify(timetableData.break3)) ||
                                       (JSON.stringify(previousTimetableData.lunchbreak)!==JSON.stringify(timetableData.lunchbreak)) || (JSON.stringify(previousTimetableData.period1)!==JSON.stringify(timetableData.period1)) ||
                                       (JSON.stringify(previousTimetableData.period2)!==JSON.stringify(timetableData.period2))||(JSON.stringify(previousTimetableData.period3)!==JSON.stringify(timetableData.period3))||(JSON.stringify(previousTimetableData.period4)!==JSON.stringify(timetableData.period4)) ||
                                       (JSON.stringify(previousTimetableData.period5)!==JSON.stringify(timetableData.period5)) || (JSON.stringify(previousTimetableData.period6)!==JSON.stringify(timetableData.period6))||(JSON.stringify(previousTimetableData.period7)!==JSON.stringify(timetableData.period7)) ||
                                       (JSON.stringify(previousTimetableData.period8)!==JSON.stringify(timetableData.period8)) || (JSON.stringify(previousTimetableData.period9)!==JSON.stringify(timetableData.period9))||(JSON.stringify(previousTimetableData.period10)!==JSON.stringify(timetableData.period10))) &&
                                       findResponse!=='' && findResponse==='edit' && <button className="createtimetable-create-submit-btn" onClick={(e)=>handleUpdateTimeTable(e)} >update timetable</button>
                                    }

                                    {/* days */}
                                    {timetableData.totalperiods>0 && <h2 className="createtimetable-create-tt-monday">monday</h2>}
                                    <div className="createtimetable-create-tt-whole-periods">
                                        {timetableData.totalperiods>0 && 
                                            Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                <div key={i} className="createtimetable-create-tt-monday-whole">
                                                    <p>period {i+1}</p>
                                                    <div className="createtimetable-create-tt-monday-inner">
                                                        <div>
                                                            <label>subject</label>
                                                            <select value={timetableData['monday'][`period${i+1}`].subjectid}
                                                            onChange={(e)=>{
                                                                let tempsubData={
                                                                    day:'monday',
                                                                    teacherid:'',
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:e.target.value,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTimetablesubject(tempsubData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Subject</option>
                                                                {
                                                                    classSubjectsData.filter((subjectitem)=>subjectitem.class===timetableData.class).map((subject,idx)=>(
                                                                        <option key={idx} value={subject.subjectid}>{getSubjectName(subject.subjectid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label>teacher</label>
                                                            <select value={timetableData['monday'][`period${i+1}`].teacherid}
                                                            onChange={(e)=>{
                                                                let tempData={
                                                                    day:'monday',
                                                                    teacherid:e.target.value,
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:timetableData['monday'][`period${i+1}`].subjectid,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTeacherClassesTime(tempData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select teacher</option>
                                                                {
                                                                    AllSubjectTeachers.filter((teacheritem)=>teacheritem.subjectid===timetableData['monday'][`period${i+1}`].subjectid).map((teacher,idx)=>(
                                                                        <option key={idx} value={teacher.teacherid}>{getTeacherFullName(teacher.teacherid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {timetableData.totalperiods>0 && <h2 className="createtimetable-create-tt-monday">tuesday</h2>}
                                    <div className="createtimetable-create-tt-whole-periods">
                                        {timetableData.totalperiods>0 && 
                                            Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                <div key={i} className="createtimetable-create-tt-tuesday-whole">
                                                    <p>period {i+1}</p>
                                                    <div className="createtimetable-create-tt-monday-inner">
                                                        <div>
                                                            <label>subject</label>
                                                            <select value={timetableData['tuesday'][`period${i+1}`].subjectid}
                                                            onChange={(e)=>{
                                                                let tempsubData={
                                                                    day:'tuesday',
                                                                    teacherid:'',
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:e.target.value,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTimetablesubject(tempsubData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Subject</option>
                                                                {
                                                                    classSubjectsData.filter((subjectitem)=>subjectitem.class===timetableData.class).map((subject,idx)=>(
                                                                        <option key={idx} value={subject.subjectid}>{getSubjectName(subject.subjectid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label>teacher</label>
                                                            <select value={timetableData['tuesday'][`period${i+1}`].teacherid}
                                                            onChange={(e)=>{
                                                                let tempData={
                                                                    day:'tuesday',
                                                                    teacherid:e.target.value,
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:timetableData['tuesday'][`period${i+1}`].subjectid,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTeacherClassesTime(tempData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select teacher</option>
                                                                {
                                                                    AllSubjectTeachers.filter((teacheritem)=>teacheritem.subjectid===timetableData['tuesday'][`period${i+1}`].subjectid).map((teacher,idx)=>(
                                                                        <option key={idx} value={teacher.teacherid}>{getTeacherFullName(teacher.teacherid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {timetableData.totalperiods>0 && <h2 className="createtimetable-create-tt-monday">wednesday</h2>}
                                    <div className="createtimetable-create-tt-whole-periods">
                                        {timetableData.totalperiods>0 && 
                                            Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                <div key={i} className="createtimetable-create-tt-wednesday-whole">
                                                    <p>period {i+1}</p>
                                                    <div className="createtimetable-create-tt-monday-inner">
                                                        <div>
                                                            <label>subject</label>
                                                            <select value={timetableData['wednesday'][`period${i+1}`].subjectid}
                                                            onChange={(e)=>{
                                                                let tempsubData={
                                                                    day:'wednesday',
                                                                    teacherid:'',
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:e.target.value,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTimetablesubject(tempsubData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Subject</option>
                                                                {
                                                                    classSubjectsData.filter((subjectitem)=>subjectitem.class===timetableData.class).map((subject,idx)=>(
                                                                        <option key={idx} value={subject.subjectid}>{getSubjectName(subject.subjectid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label>teacher</label>
                                                            <select value={timetableData['wednesday'][`period${i+1}`].teacherid}
                                                            onChange={(e)=>{
                                                                let tempData={
                                                                    day:'wednesday',
                                                                    teacherid:e.target.value,
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:timetableData['wednesday'][`period${i+1}`].subjectid,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTeacherClassesTime(tempData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Teacher</option>
                                                                {
                                                                    AllSubjectTeachers.filter((teacheritem)=>teacheritem.subjectid===timetableData['wednesday'][`period${i+1}`].subjectid).map((teacher,idx)=>(
                                                                        <option key={idx} value={teacher.teacherid}>{getTeacherFullName(teacher.teacherid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {timetableData.totalperiods>0 && <h2 className="createtimetable-create-tt-monday">thursday</h2>}
                                    <div className="createtimetable-create-tt-whole-periods">
                                        {timetableData.totalperiods>0 && 
                                            Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                <div key={i} className="createtimetable-create-tt-thursday-whole">
                                                    <p>period {i+1}</p>
                                                    <div className="createtimetable-create-tt-monday-inner">
                                                        <div>
                                                            <label>subject</label>
                                                            <select value={timetableData['thursday'][`period${i+1}`].subjectid}
                                                            onChange={(e)=>{
                                                                let tempsubData={
                                                                    day:'thursday',
                                                                    teacherid:'',
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:e.target.value,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTimetablesubject(tempsubData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Subject</option>
                                                                {
                                                                    classSubjectsData.filter((subjectitem)=>subjectitem.class===timetableData.class).map((subject,idx)=>(
                                                                        <option key={idx} value={subject.subjectid}>{getSubjectName(subject.subjectid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label>teacher</label>
                                                            <select value={timetableData['thursday'][`period${i+1}`].teacherid}
                                                            onChange={(e)=>{
                                                                let tempData={
                                                                    day:'thursday',
                                                                    teacherid:e.target.value,
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:timetableData['thursday'][`period${i+1}`].subjectid,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTeacherClassesTime(tempData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Teacher</option>
                                                                {
                                                                    AllSubjectTeachers.filter((teacheritem)=>teacheritem.subjectid===timetableData['thursday'][`period${i+1}`].subjectid).map((teacher,idx)=>(
                                                                        <option key={idx} value={teacher.teacherid}>{getTeacherFullName(teacher.teacherid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {timetableData.totalperiods>0 && <h2 className="createtimetable-create-tt-monday">friday</h2>}
                                    <div className="createtimetable-create-tt-whole-periods">
                                        {timetableData.totalperiods>0 && 
                                            Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                <div key={i} className="createtimetable-create-tt-friday-whole">
                                                    <p>period {i+1}</p>
                                                    <div className="createtimetable-create-tt-monday-inner">
                                                        <div>
                                                            <label>subject</label>
                                                            <select value={timetableData['friday'][`period${i+1}`].subjectid}
                                                            onChange={(e)=>{
                                                                let tempsubData={
                                                                    day:'friday',
                                                                    teacherid:'',
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:e.target.value,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTimetablesubject(tempsubData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Subject</option>
                                                                {
                                                                    classSubjectsData.filter((subjectitem)=>subjectitem.class===timetableData.class).map((subject,idx)=>(
                                                                        <option key={idx} value={subject.subjectid}>{getSubjectName(subject.subjectid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label>teacher</label>
                                                            <select value={timetableData['friday'][`period${i+1}`].teacherid}
                                                            onChange={(e)=>{
                                                                let tempData={
                                                                    day:'friday',
                                                                    teacherid:e.target.value,
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:timetableData['friday'][`period${i+1}`].subjectid,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTeacherClassesTime(tempData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Teacher</option>
                                                                {
                                                                    AllSubjectTeachers.filter((teacheritem)=>teacheritem.subjectid===timetableData['friday'][`period${i+1}`].subjectid).map((teacher,idx)=>(
                                                                        <option key={idx} value={teacher.teacherid}>{getTeacherFullName(teacher.teacherid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {timetableData.totalperiods>0 && <h2 className="createtimetable-create-tt-monday">saturday</h2>}
                                    <div className="createtimetable-create-tt-whole-periods">
                                        {timetableData.totalperiods>0 && 
                                            Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                <div key={i} className="createtimetable-create-tt-saturday-whole">
                                                    <p>period {i+1}</p>
                                                    <div className="createtimetable-create-tt-monday-inner">
                                                        <div>
                                                            <label>subject</label>
                                                            <select value={timetableData['saturday'][`period${i+1}`].subjectid}
                                                            onChange={(e)=>{
                                                                let tempsubData={
                                                                    day:'saturday',
                                                                    teacherid:'',
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:e.target.value,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTimetablesubject(tempsubData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Subject</option>
                                                                {
                                                                    classSubjectsData.filter((subjectitem)=>subjectitem.class===timetableData.class).map((subject,idx)=>(
                                                                        <option key={idx} value={subject.subjectid}>{getSubjectName(subject.subjectid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label>teacher</label>
                                                            <select value={timetableData['saturday'][`period${i+1}`].teacherid}
                                                            onChange={(e)=>{
                                                                let tempData={
                                                                    day:'saturday',
                                                                    teacherid:e.target.value,
                                                                    class:timetableData.class,
                                                                    sectionid:timetableData.sectionid,
                                                                    subjectid:timetableData['saturday'][`period${i+1}`].subjectid,
                                                                    period:`period${i+1}`,
                                                                    starttime:timetableData[`period${i+1}`].starttime,
                                                                    endtime:timetableData[`period${i+1}`].endtime,
                                                                };
                                                                modifyTeacherClassesTime(tempData);
                                                            }}
                                                            >
                                                                <option value='' disabled>Select Subject</option>
                                                                {
                                                                    AllSubjectTeachers.filter((teacheritem)=>teacheritem.subjectid===timetableData['saturday'][`period${i+1}`].subjectid).map((teacher,idx)=>(
                                                                        <option key={idx} value={teacher.teacherid}>{getTeacherFullName(teacher.teacherid)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {/* days ends here */}

                                </div>:
                                findResponse==='create'?
                                <div>
                                    <p style={{paddingLeft:10,fontSize:'0.85rem',marginTop:5}}>haven't created the timetable yet. Let's create Now</p>
                                </div>:<></>
                            }
                            {
                                findResponse!=='' && findResponse==='create' &&  <button className="createtimetable-create-submit-btn" onClick={(e)=>handleCreateNewTimeTable(e)}>create timetable</button>
                            }
                        </form>


                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Createtimetable;