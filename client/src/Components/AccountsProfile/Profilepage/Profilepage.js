import React, { useEffect, useState } from "react";
import './Profilepage.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import CircularProgress from '@mui/material/CircularProgress';
import profilepic from '../../../Assets/dupilcatepic.PNG';
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../Data/Docs";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../AllFunctions/Logout";

function Profilepage() {
    const[showDataLoading,setShowDataLoading] = useState(true);
    const[adminData,setAdminData] = useState({});//storing th admin data
    const adminRegId = useSelector((state)=>state.userdata.regid);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(()=>{
        if(adminRegId){

            async function fetchAdminData(){//fetching the admin data
                setShowDataLoading(true);
                try{
                    const controller = new AbortController();
                    const controllerTimeout = setTimeout(()=>controller.abort(),20000);
                    const response = await fetch(`${API_URL}/admin/getEachAdmin/${adminRegId}`,{
                        credentials:'include',
                        signal:controller.signal
                    });
                    clearTimeout(controllerTimeout);
                    if (!response.ok) {
                        if (response.status === 401) {
                            alert('your session is expired, please login again');
                          Logout(dispatch,navigate);
                          throw new Error('Unauthorized - Token expired');
                        }
                        throw new Error(response.statusText || 'Request failed');
                      }
                    const resData = await response.json();
                    if(resData.success){
                        setAdminData(resData.admindata);
                    }
                }catch(err){
                    console.log('getting an error while fetching the admin data',err);
                }
                setShowDataLoading(false);
            }
            fetchAdminData();
        }
    },[adminRegId,dispatch,navigate]);
      
    return (
        <>
            <div className='staffdashboard-con'>
                <Sidenav />
                <div className='staffdashboard-inner'>
                    <Topnav />
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        {!showDataLoading?adminData.adminregid?
                        <div className="profile_con">
                            <div className="profile_top_con">
                            </div>
                            <div className="profile_card">
                                <div className="profile_image">
                                    <img src={profilepic} alt="img" />
                                </div>
                                <div className="profile_details">
                                    <h1>{adminData.adminfirstname} {adminData.adminmiddlename} {adminData.adminlastname}</h1>
                                    <p style={{textTransform:'capitalize'}}>{adminData.role}</p>
                                </div>
                            </div>
                            <div className="profile_bottom_con">
                            <div className="profile_personal_info">
                                <h2>Personal Info</h2>
                                <div className="profile_personal_info_data">
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Mobile</span>
                                        <span className="profile_personal_info_value">{adminData.adminmobilenumber}</span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Email</span>
                                        <span className="profile_personal_info_value">{adminData.adminemail}</span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Default Address</span>
                                        <span className="profile_personal_info_value" style={{textTransform:'capitalize'}}>{adminData.adminpermanentaddress}</span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Emergency Contact Person</span>
                                        <span className="profile_personal_info_value" style={{textTransform:'capitalize'}}>{adminData.emergencycontantname} <small style={{fontSize:'0.7rem'}}>({adminData.emergencycontactrelationship})</small></span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Emergency Contact Number</span>
                                        <span className="profile_personal_info_value">{adminData.emergencycontactnumber}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="profile_employee_data">
                                <h2>Employee Data</h2>
                                <div className="profile_employee_info_data">
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Employee Id</span>
                                        <span className="profile_personal_info_value">{adminData.adminregid}</span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Specialized Subject</span>
                                        <span className="profile_personal_info_value">{adminData.adminspecilizedsubject}</span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Date Of Joining</span>
                                        <span className="profile_personal_info_value">{adminData.adminDOJ.split('T')[0]?adminData.adminDOJ.split('T')[0]:'-'}</span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Highest Qualification</span>
                                        <span className="profile_personal_info_value" style={{textTransform:'uppercase'}}>{adminData.adminhighqualification}</span>
                                    </div>
                                    <div className="profile_personal_info_row">
                                        <span className="profile_personal_info_label">Work Experience</span>
                                        <span className="profile_personal_info_value">{adminData.adminworkexprienceyears} Years</span>
                                    </div>
                                </div>
                            </div>
                            </div>



                        </div>:
                        <div className="profilepage-user-notfound">
                            <p>admin data not found</p>
                        </div>:
                        <div className="profilepage-user-notfound">
                            <CircularProgress/>
                            <p>Loading...</p>
                        </div>
                        }

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profilepage;