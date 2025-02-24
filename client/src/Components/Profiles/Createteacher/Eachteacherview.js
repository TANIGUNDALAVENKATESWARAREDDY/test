import React, { useEffect, useState } from "react";
import './Eachteacherview.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import profilepic from "../../../Assets/vislogo.png";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { useNavigate, useParams } from "react-router-dom";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { API_URL } from "../../../Data/Docs";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from "react-redux";
import { Logout } from "../../AllFunctions/Logout";
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Eachteacherview(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {teacherid} = useParams();
    const[teacherData,setTeacherData] = useState({});
    const[showDataLoading,setShowDataLoading] = useState(true);
    useEffect(()=>{
        if(teacherid){
            async function fetchEachTeacherData(){
                setShowDataLoading(true);
                try{
                    const controller = new AbortController();
                    const controllerTimeOut = setTimeout(()=>controller.abort(),20000);
                    const response = await fetch(`${API_URL}/teachers/getEachTeacher/${teacherid}`,{
                        credentials:'include',
                        signal:controller.signal
                    });
                    clearTimeout(controllerTimeOut);

                    if(response.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }

                    const resData= await response.json();
                    if(resData.success){
                        setTeacherData(resData.teacherdata);
                    }
                }catch(err){
                    console.log('getting error while fetching teacher data',err);
                }
                setShowDataLoading(false);
            }
            fetchEachTeacherData();
        }
    },[teacherid,navigate,dispatch]);

    
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-top-back-btn' style={{marginBottom:5,paddingTop:15,paddingLeft:5}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                        </div>
                        { !showDataLoading?teacherData.teacherregid?
                        <>
                        <div className="eachteacher_con">
                            <div className="eachteacherview_topsection">
                                <div className="eachteacherview_profile">
                                    <div className="eachteacherview_profilepic">
                                        <img src={profilepic} alt="img"/>
                                    </div>
                                    <div className="eachteacherview_name">
                                        <h2>{teacherData.teacherfirstname} {teacherData.teachersmiddlename} {teacherData.teacherslastname}</h2>
                                        <h3>{teacherData.role}</h3>
                                    </div>
                                </div>
                                <div className="eachteacherview_empid">
                                    <h5>Employee ID</h5>
                                    <p>{teacherData.teacherregid}</p>
                                </div>
                            </div>
                            <div className="eachteacherview_topsection_app">
                                <div className="eachteacherview_profile">
                                    <div className="eachteacherview_profilepic">
                                        <img src={profilepic} alt="img"/>
                                    </div>
                                    <div className="eachteacherview_name">
                                        <h2>{teacherData.teacherfirstname} {teacherData.teachersmiddlename} {teacherData.teacherslastname}</h2>
                                        <h3>{teacherData.teacherregid}</h3>
                                        <h3>{teacherData.role}r</h3>
                                    </div>
                                </div>
                                {/* <div className="eachteacherview_empid">
                                    <h5>Employee ID</h5>
                                    <p>12345678</p>
                                </div> */}
                            </div>

                            <div className="eachteacherview_section2">
                                <div className="eachteacherview_info1">
                                    <div className="eachteacherview_empid">
                                        <h5>Sub-Designation</h5>
                                        <p>Teacher</p>
                                    </div>
                                    <div className="eachteacherview_empid">
                                        <h5>Department</h5>
                                        <p>Teaching</p>
                                    </div>
                                </div>
                                <div className="eachteacherview_info1">
                                    <div className="eachteacherview_empid">
                                        <h5>Specialized Subject</h5>
                                        <p>{teacherData.teacherspecilizedsubject}</p>
                                    </div>
                                    <div className="eachteacherview_empid">
                                        <h5>Date Of Joining</h5>
                                        <p>{teacherData.teacherDOJ.split('T')[0]?teacherData.teacherDOJ.split('T')[0]:'-'}</p>
                                    </div>
                                </div>

                                <div className="eachteacherview_info2">
                                    <div className="eachteacherview_eachdetail">
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <EmailOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Email</h5>
                                                <p>{teacherData.teacheremail}</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <LocalPhoneOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Phone</h5>
                                                <p>{teacherData.teachermobilenumber}</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <PersonOutlineOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Gender</h5>
                                                <p>{teacherData.teachergender}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="eachteacherview_eachdetail">
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <DateRangeOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Date Of Birth</h5>
                                                <p>{teacherData.teacherDOB.split('T')[0]?teacherData.teacherDOB.split('T')[0]:'-'}</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <LocationOnOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Temporary Address</h5>
                                                <p>{teacherData.teachertemporaryaddress}</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <LocationOnOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Permanent Address</h5>
                                                <p>{teacherData.teacherpermanentaddress}</p>
                                            </div>
                                        </div>
                                    </div>  
                                </div>

                                <div className="eachteacherview_info3">
                                    <h2>Work Experience & Educational Background</h2>
                                    <div className="eachteacherview_workdetails">
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <WorkOutlineOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Total Experience</h5>
                                                <p>{teacherData.teacherworkexprienceyears} Years</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <WorkOutlineOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Previous Employer</h5>
                                                <p>{teacherData.teacherpreviouscompany}</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <SchoolOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Highest Qualification</h5>
                                                <p>{teacherData.teacherhighqualification}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="eachteacherview_info3">
                                    <h2>Emergency Contact</h2>
                                    <div className="eachteacherview_workdetails">
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <PersonOutlineOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>contact name</h5>
                                                <p>{teacherData.emergencycontantname?teacherData.emergencycontantname:'-'}</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <LocalPhoneOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Phone</h5>
                                                <p>{teacherData.emergencycontactnumber?teacherData.emergencycontactnumber:'-'}</p>
                                            </div>
                                        </div>
                                        <div className="eachteacherview_detail">
                                            <div className="eachteacherview_icon">
                                                <EmailOutlinedIcon />
                                            </div>
                                            <div className="eachteacherview_empid">
                                                <h5>Email</h5>
                                                <p>{teacherData.emergencycontactemail?teacherData.emergencycontactemail:'-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            
                        </div>
                        </>:<div className="eachteacherview-showloading">
                            <p>user data not found!</p>
                        </div>:
                        <div className="eachteacherview-showloading">
                            <CircularProgress/>
                            <p>loading ...</p>
                        </div>
                        }

                        {/* <h1>each teacher view</h1>
                        <ChevronRightIcon sx={{color:'red'}} className="xyz"/> */}
                        {/* you code end's here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default  Eachteacherview;