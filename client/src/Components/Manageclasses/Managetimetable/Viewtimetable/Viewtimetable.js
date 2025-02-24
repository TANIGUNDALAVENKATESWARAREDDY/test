import React, { useEffect, useRef, useState } from "react";
import './Viewtimetable.css';
import Sidenav from "../../../Sidenav/Sidenav";
import Topnav from "../../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { API_URL, days, socket } from "../../../../Data/Docs";
import { useDispatch, useSelector } from "react-redux";
import { addedNewSection, sectionModified, updateSections } from "../../../../ReduxStates/Sections";
import { updateEachTimetableSubjectAndTeacher, updateExistedTimeTable, updateViewTimetable, updateViewTTClassAndSection } from "../../../../ReduxStates/Timetabledata/ViewTimetabledata";
import { storeAllCoursesData, updateAddNewCourseData } from "../../../../ReduxStates/Coursesdata/AllCoursesData";
import { storeAllTeachersData } from "../../../../ReduxStates/Teachersdata/Teachersdata";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Viewtimetable(){
    const navigate = useNavigate();
    const [classData,setClassData] = useState({
        class:'',
        sectionid:''
    });
    // const [ttData,setTtData] = useState('');
    const[showloading,setShowloading] = useState(false);
    const fetchCheckOnlyOnce = useRef(false);
    const classSections = useSelector((state)=>state.sections.data);
    const dispatch = useDispatch();

    // const [timetableData , setTimetableData] = useState();
    const timetableData = useSelector((state)=>state.viewtimetabledata.data);
    const ttData = useSelector((state)=>state.viewtimetabledata.ttData);

    const allCoursesData = useSelector((state)=>state.allcoursesdata.data);
    const AllTeachersData = useSelector((state)=>state.teachersdata.data);
    // const classdata = useSelector((state)=>state.viewtimetabledata.classdata);
    // const sectiondata = useSelector((state)=>state.viewtimetabledata.sectiondata);


    function handleTimeDifference(time1,time2){
        const [starthours , startminutes] = time1.split(':').map(Number);
        const [endhours , endminutes] = time2.split(':').map(Number);
        const startTotalMinutes = starthours*60+startminutes;
        const endTotalMinutes = endhours*60+endminutes;
        return Math.abs(startTotalMinutes-endTotalMinutes);
    }


    async function handleFetchTimeTable(e){
        e.preventDefault();
        setShowloading(true);
        try{
            if(classData.class!=='' && classData.sectionid!==''){
                const response = await fetch(`${API_URL}/timetable/gettimetable`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        class:classData.class,
                        sectionid:classData.sectionid
                    }),
                    credentials:'include'
                });
                const resData = await response.json();
                // console.log('here is the Response Data : ', resData);
                if(resData.success){
                    if(resData.core==='edit'){
                        dispatch(updateViewTimetable(resData.timetabledata));
                        dispatch(updateViewTTClassAndSection({
                            classdata:classData.class,
                            sectiondata:classData.sectionid,
                            ttData:'edit'
                        }));
                        // setTimetableData(prev=>({
                        //     ...prev,
                        //     ...resData.timetabledata
                        // }));
                        // setTtData('edit');
                        
                    }else{
                        // setTtData(resData.core);
                        dispatch(updateViewTTClassAndSection({
                            classdata:classData.class,
                            sectiondata:classData.sectionid,
                            ttData:resData.core
                        }));
                    }
                }
            }else{
                alert('please fill all the rerquired fields');
            }
        }catch(err){
            console.log('geeting an error while fetching time table data',err);
        }
        setShowloading(false);
    }

    function getSubjectName(subID){//send the subject name
        const subjectname = allCoursesData.find(item=>item.courseuid===subID);
        return subjectname?subjectname.coursename:'no subject';
    }

    function getTeacherFullName(teacherID){//send the teachers name
        const teachersname = AllTeachersData.find(item=>item.teacherregid===teacherID);
        return teachersname?`${teachersname.teacherfirstname} ${teachersname.teachersmiddlename} ${teachersname.teacherslastname}`:'teacher not added';
    }

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){
            const handleUpdateExistTimeTable =(data)=>{
                dispatch(updateExistedTimeTable(data.data));
            }

            if(!socket.hasListeners('updatetimetable')){
                socket.on('updatetimetable',handleUpdateExistTimeTable)
            }

            const handleUpdateTimetabelSubjectAndTeacher = (data) =>{
                dispatch(updateEachTimetableSubjectAndTeacher(data.data));
            }
            if(!socket.hasListeners('createtimetablelistening')){
                socket.on('createtimetablelistening',handleUpdateTimetabelSubjectAndTeacher);
            }

            //fetching all courses data here
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

            //all class sections fetch here
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

            fetchCheckOnlyOnce.current = true;
        }
    },[classSections.length,allCoursesData.length,AllTeachersData.length,dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}

                        <div className="viewtimetable-back-and-create-btn" style={{marginTop:20}}>
                            <div className="viewtimetable-create-timetable-btn"  style={{color:'#1268ca'}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon sx={{fontSize:'1.1rem'}}/>
                                <p>back</p>
                            </div>
                            <div className="viewtimetable-create-timetable-btn" onClick={()=>navigate('/manageclasses/managetimetable/createtimetable')}>
                                <AddIcon sx={{fontSize:'1.1rem'}}/>
                                <p style={{textTransform:'capitalize'}}>create/edit timetable</p>
                            </div>
                        </div>
                        

                        <form className="studentfeehistory-form">
                            {/* form heading */}
                            <div className="studentfeehistory-form-heading">
                                <p>View Class Timetable</p>
                            </div>

                            <div className="studentfeehistory-collecting-data">
                                <div className="studentfeehistory-collecting-data-each">
                                    <label>class</label>
                                    <select value={classData.class} onChange={(e)=>setClassData(prev=>({
                                        ...prev,
                                        class:e.target.value
                                    }))}>
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
                                    <select value={classData.sectionid} onChange={(e)=>setClassData(prev=>({
                                        ...prev,
                                        sectionid:e.target.value
                                    }))}>
                                        <option value=''>select section</option>
                                        {
                                            classSections.filter((item)=>item.class === classData.class).map((item,idx)=>(
                                                <option key={idx} value={item._id}>{item.sectionname}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="studentfeehistory-collecting-data-each">
                                    <button style={{whiteSpace:'nowrap'}} onClick={(e)=>handleFetchTimeTable(e)}>Get Timetable</button>
                                </div>
                            </div>
                        </form>

                        {/* view timetable */}
                        {ttData!=='' && ttData==='edit' && 
                        <div className="viewtimetable-table-whole-div">

                            {/* time table heading */}
                            <h2 className="viewtimetable-timetable-heading">Time Table</h2>

                            {/* top divs */}
                            <div className="viewtimetable-top-class-breaks">
                                <div className="viewtimetable-top-class">
                                    <p>class : <span>{timetableData.class}</span></p>
                                    <p>section : <span>{classSections.filter((item)=> item._id===timetableData.sectionid).length>0?classSections.filter((item)=> item._id===timetableData.sectionid)[0].sectionname:''}</span></p>
                                    <p>class teacher : <span>Saanvika</span></p>
                                </div>

                                <div className="viewtimetable-top-breaks">
                                    {
                                        Array.from({length:timetableData.totalbreaks},(_,i)=>(
                                            <div className="viewtimetable-top-breaks-each" key={i}>
                                                <h2>break {i+1}</h2>
                                                <div>
                                                    <input type="time" value={timetableData[`break${i+1}`].starttime} readOnly/>
                                                    <p>-</p>
                                                    <input type="time" value={timetableData[`break${i+1}`].endtime} readOnly/>
                                                </div>
                                                <p>{(timetableData[`break${i+1}`].starttime!=='' && timetableData[`break${i+1}`].endtime!=='')?handleTimeDifference(timetableData[`break${i+1}`].starttime,timetableData[`break${i+1}`].endtime):0} min</p>
                                            </div>
                                        ))
                                    }
                                    
                                    {/* <div className="viewtimetable-top-breaks-each">
                                        <h2>break 1</h2>
                                        <div>
                                            <input type="time" value={"12:00"} readOnly/>
                                            <p>-</p>
                                            <input type="time" value={"01:45"} readOnly/>
                                        </div>
                                        <p>45 min</p>
                                    </div>
                                    <div className="viewtimetable-top-breaks-each">
                                        <h2>break 1</h2>
                                        <div>
                                            <input type="time" value={"12:00"} readOnly/>
                                            <p>-</p>
                                            <input type="time" value={"01:45"} readOnly/>
                                        </div>
                                        <p>45 min</p>
                                    </div> */}
                                    <div className="viewtimetable-top-breaks-each">
                                        <h2>lunch</h2>
                                        <div>
                                            <input type="time" value={timetableData.lunchbreak.starttime} readOnly/>
                                            <p>-</p>
                                            <input type="time" value={timetableData.lunchbreak.endtime} readOnly/>
                                        </div>
                                        <p>{(timetableData.lunchbreak.starttime!=='' && timetableData.lunchbreak.endtime!=='')?handleTimeDifference(timetableData.lunchbreak.starttime,timetableData.lunchbreak.endtime):0} min</p>
                                    </div>
                                </div>
                            </div>

                            {/*class  time table heading */}
                            <div className="viewtimetable-classtimetable-whole-div">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="viewtimetable-display-days" style={{background:'#e6e6fa'}}>
                                                    <p>days</p>
                                                </div>

                                            </th>

                                            {
                                                timetableData.totalperiods>0 &&
                                                Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                    <th key={i}>
                                                        <div className="viewtimetable-display-periods" style={{background:'#e6e6fa'}}>
                                                            <div>
                                                                <input type="time" value={timetableData[`period${i+1}`].starttime} style={{background:'#e6e6fa'}} readOnly/>
                                                                <p>-</p>
                                                                <input type="time" value={timetableData[`period${i+1}`].endtime} style={{background:'#e6e6fa'}} readOnly/>
                                                            </div>
                                                            <p>p-{i+1}</p>
                                                        </div>
                                                    </th>
                                                ))
                                            }
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            days.map((day,idx)=>(
                                                <tr className="viewtimetable-tobody-eachrow" key={idx}>
                                                    <td>
                                                        <div className="viewtimetable-tbody-first-header" style={{background:'#e6e6fa'}}>
                                                            <p className="viewtimetable-tbody-heading-p">{day}</p>
                                                        </div>
                                                        
                                                    </td>
                                                    {
                                                        timetableData.totalperiods>0 &&
                                                        Array.from({length:timetableData.totalperiods},(_,i)=>(
                                                            <td key={i}>
                                                                <div className="viewtimetable-tbody-subject-teacher">
                                                                    <h2 style={{color:'#1976d2',fontSize:'0.9rem',textTransform:'capitalize'}}>{getSubjectName(timetableData[`${day}`][`period${i+1}`].subjectid)}</h2>
                                                                    <p style={{textAlign:'center',fontSize:'0.75rem',fontWeight:'400'}}>{getTeacherFullName(timetableData[`${day}`][`period${i+1}`].teacherid)}</p>
                                                                </div>
                                                            </td>
                                                        ))
                                                    }
                                                </tr>     
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {/* time table code ends here */}


                        </div>}

                        

                        {
                            ttData!=='' && ttData==='create' && <p>time table not created</p>
                        }
                        {/* your conde ends here */}
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

export default Viewtimetable;