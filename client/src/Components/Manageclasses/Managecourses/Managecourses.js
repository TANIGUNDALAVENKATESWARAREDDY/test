import React, { useEffect, useRef, useState } from "react";
import './Managecourses.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { API_URL, socket } from "../../../Data/Docs";
import {v4 as uuidv4} from 'uuid';
import { useDispatch, useSelector } from "react-redux";
import { storeAllCoursesData, updateAddNewCourseData } from "../../../ReduxStates/Coursesdata/AllCoursesData";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout } from "../../AllFunctions/Logout";

function Managecourses(){
    const navigate = useNavigate();
    const [courseData , setCourseData] = useState({
        courseuid:'',//unique id
        coursecode:'',//subject code
        coursename:'',//subject name
        coursecredits:0,//subject credits
        coursedescription:''//subject description
    });
    const[showloading,setShowloading] = useState(false);

    const fetchCheckOnlyOnce = useRef(false);
    const allCoursesData = useSelector((state)=>state.allcoursesdata.data);
    const dispatch = useDispatch();

    async function handleAddNewCourse(e){
        e.preventDefault();
        setShowloading(true);
        try{
            const uuid = uuidv4();//generating a unique id to the course
            const response = await fetch(`${API_URL}/courses/addnewcourse`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    ...courseData,
                    courseuid:uuid
                }),
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

            const resData = await response.json();
            if(!resData.success){
                alert('getting an error while adding the course');
            }else{
                setCourseData(prev=>({
                    ...prev,
                    courseuid:'',//unique id
                    coursecode:'',//subject code
                    coursename:'',//subject name
                    coursecredits:0,//subject credits
                    coursedescription:''//subject description
                }))
            }
        }catch(err){
            console.log('getting an error while adding the course',err);
        }
        setShowloading(false);
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

            fetchCheckOnlyOnce.current=true;
        }

    },[allCoursesData.length,navigate,dispatch]);
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

                        <form className="studentfeehistory-form" style={{paddingBottom:1}}>
                            {/* form heading */}
                            <div className="studentfeehistory-form-heading">
                                <p>Add Your Course</p>
                            </div>

                            <div className="managecourses-add-course-form">
                                <div className="managecourses-add-course-form-each">
                                    <label>Subject Code</label>
                                    <input type="text" value={courseData.coursecode} onChange={(e)=>setCourseData(prev=>({
                                        ...prev,
                                        coursecode:e.target.value
                                    }))}/>
                                </div>
                                <div className="managecourses-add-course-form-each">
                                    <label>Subject Name</label>
                                    <input type="text" value={courseData.coursename}  onChange={(e)=>setCourseData(prev=>({
                                        ...prev,
                                        coursename:e.target.value
                                    }))}/>
                                </div>
                                {/* <div className="managecourses-add-course-form-each">
                                    <label>Subject description</label>
                                    <input type="text" />
                                </div> */}
                                <div className="managecourses-add-course-form-each">
                                    <label>Subject credits</label>
                                    <input type="number" value={courseData.coursecredits} onChange={(e)=>setCourseData(prev=>({
                                        ...prev,
                                        coursecredits:e.target.value
                                    }))}/>
                                </div>
                                {/* <div>
                                    <button>add course</button>
                                </div> */}
                            </div>

                            <div className="managecourses-subject-description">
                                <label>subject description</label>
                                <textarea placeholder="write subject description here ...." value={courseData.coursedescription} onChange={(e)=>setCourseData(prev=>({
                                    ...prev,
                                    coursedescription:e.target.value
                                }))}/>
                            </div>

                            <div className="managecourses-button">
                                <button onClick={(e)=>handleAddNewCourse(e)}>add subject</button>
                            </div>
                        </form>

                        {allCoursesData.length>0 &&
                        <div style={{background:'white',marginTop:20 , paddingBottom:10}}>
                            <div className="studentfeehistory-form-heading" style={{border:'none',paddingTop:10}}>
                                <p>All Subjects</p>
                            </div>
                            <div className="show-application-whole-inner-table" style={{margin:10,marginTop:0 , marginBottom:0}}>
                                <table>
                                    <thead>
                                        <tr style={{background:'#dfe8ff'}}>
                                            <th style={{color:'black'}}>Subject Code</th>
                                            <th style={{color:'black'}}>Subject Name</th>
                                            <th style={{color:'black'}}>Credits</th>
                                            <th style={{color:'black'}}>description</th>
                                            <th style={{color:'black'}}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allCoursesData.map((item,idx)=>(
                                                <tr key={idx}>
                                                    <td>{item.coursecode}</td>
                                                    <td>{item.coursename}</td>
                                                    <td>{item.coursecredits}</td>
                                                    <td>{item.coursedescription}</td>
                                                    <td></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div> }

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
    )
}

export default Managecourses;