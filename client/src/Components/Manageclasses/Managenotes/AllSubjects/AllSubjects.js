import React, { useEffect, useRef } from "react";
import './AllSubjects.css';
import Topnav from "../../../Topnav/Topnav";
import Sidenav from "../../../Sidenav/Sidenav";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewSubjectToClass, deleteSubjectFromClass, storeClassSubjectsData } from "../../../../ReduxStates/Coursesdata/ClassSubjectsData";
import { API_URL, classes, socket } from "../../../../Data/Docs";
import { storeAllCoursesData, updateAddNewCourseData } from "../../../../ReduxStates/Coursesdata/AllCoursesData";
import { Logout } from "../../../AllFunctions/Logout";

function AllSubjects(){
    const navigate = useNavigate();
    const {classid} = useParams();
    const fetchCheckOnlyOnce = useRef(false);
    const classSubjectsData = useSelector((state)=>state.classsubjectsdata.data);
    const allCoursesData = useSelector((state)=>state.allcoursesdata.data);
    const dispatch = useDispatch();

    function getSubjectName(subID){//send the subject name
        const subjectname = allCoursesData.find(item=>item.courseuid===subID);
        return subjectname?subjectname.coursename:'no subject';
    }

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

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
                        if(!response.ok){
                            if(response.status === 401) {
                                alert('Your session is expired,please login again');
                                Logout(dispatch,navigate);
                                throw new Error('Unauthorized - Token expired');
                            }
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
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
                        if(!response.ok){
                            if(response.status === 401) {
                                alert('Your session is expired,please login again');
                                Logout(dispatch,navigate);
                                throw new Error('Unauthorized - Token expired');
                            }
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
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
            fetchCheckOnlyOnce.current=true;
        }
    },[classSubjectsData.length,allCoursesData.length,navigate,dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        {classes.includes(classid)?
                        <>
                            <div className='allclasses-top-navigation'>
                                <p onClick={()=>navigate(-1)} style={{cursor:'pointer'}}>student notes</p>
                                <ChevronRightIcon sx={{fontSize:18}}/>
                                <p style={{color:'#1976d2',userSelect:'none'}}>{(classid==="nursery"||classid==="LKG"||classid==="UKG")?classid:`class ${classid}`}</p>
                            </div>

                            {/* all subjects */}
                            <div className="allsubjects-container">
                                {
                                    classSubjectsData.filter((item)=>item.class===classid).map((subject,idx)=>(
                                        <div className="allsubjects-each" key={idx} onClick={()=>navigate(`/manageclasses/managenotes/allclasses/${classid}/${subject.subjectid}`,{
                                            state:{
                                                subjectname:getSubjectName(subject.subjectid)
                                            }
                                        })}>
                                            <p>Subject <span style={{marginRight:4}}>{idx+1}</span>: <span className="allsubjects-each-subject-name">{getSubjectName(subject.subjectid)}</span></p>
                                            {/* <p><span style={{color:'#1976d2',marginRight:4,textTransform:'lowercase'}}> 1 to 10</span> chapters {`>`}</p> */}
                                            <p>show chapters {`>`}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </>:
                        <><h2>request error</h2></>}
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllSubjects;