import React, { useEffect, useState } from "react";
import './Eachadminview.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import profilepic from "../../../Assets/dupilcatepic.PNG";
// import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../Data/Docs";
import { useDispatch } from "react-redux";
import { Logout } from "../../AllFunctions/Logout";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

function Eachadminview(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [adminData , setAdminData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const {adminid} = useParams();
    useEffect(() => {
        if (adminid) {
            async function fetchAdminData() {
                setIsLoading(true);
                setHasError(false); // Reset error state before fetching
                try {
                    const response = await fetch(`${API_URL}/admin/getEachAdmin/${adminid}`, {
                        credentials: 'include'
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
                    if (resData.success) {
                        setAdminData(resData.admindata);
                    } else {
                        setHasError(true);
                    }
                } catch (err) {
                    console.log('Error while fetching the admin data:', err);
                    setHasError(true);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchAdminData(); // Call the admin data function
        }
    }, [adminid,dispatch,navigate]);

    if (isLoading) {
        return <div>Loading...</div>; // Show loading symbol
    }

    if (hasError) {
        return <div>User not found</div>; // Show error message
    }
    
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
                        {adminData.adminregid?
                        <>
                        <div className="viewadmin_con">
                            <div className="viewadmin_topsection"> 
                                <div className="viewadmin_topimgsec">
                                    <div className="viewadmin_topinfo">
                                        <div className="viewadmin_topimg">
                                            <img src={profilepic} alt="profile"></img>
                                        </div>
                                        <div className="viewadmin_topname">
                                            <h2>{`${adminData.adminfirstname} ${adminData.adminmiddlename} ${adminData.adminlastname}`}</h2>
                                            <p>Head of Department</p>
                                        </div>
                                    </div>
                                    <div className="viewadmin_topemp">
                                        <p style={{textTransform:'capitalize'}}>{adminData.role}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="viewadmin_secondsection">
                                <div className="viewadmin_wrkdetails">
                                    <h4>Work Details</h4>
                                    <p>EMP ID<span> {adminData.adminregid}</span>  < ContentCopyIcon sx={{color:'#989898', height: '0.7em'}}/></p>
                                </div>
                                <div className="viewadmin_wrkdetails_con">
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Department</h5>
                                        <p>English</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Date of Joining</h5>
                                        <p>{adminData.adminDOJ.split('T')[0]?adminData.adminDOJ.split('T')[0]:'-'}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Sub designation</h5>
                                        <p>Teacher</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Specialized subject</h5>
                                        <p>{adminData.adminspecilizedsubject}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="viewadmin_secondsection">
                                <div className="viewadmin_personaldetails">
                                    <h4>Personal Information</h4>
                                </div>
                                <div className="viewadmin_personalinfo"> 
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>First  Name</h5>
                                        <p>{adminData.adminfirstname}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Middle Name</h5>
                                        <p>{adminData.adminmiddlename?adminData.adminmiddlename:'-'}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Last Name</h5>
                                        <p>{adminData.adminlastname}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Phone</h5>
                                        <p>{adminData.adminmobilenumber}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Email</h5>
                                        <p>{adminData.adminemail}</p>
                                    </div>
                                </div>
                                <div className="viewadmin_personalinfo">
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Gender</h5>
                                        <p>{adminData.admingender}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Date of Birth</h5>
                                        <p>{adminData.adminDOB.split('T')[0]?adminData.adminDOB.split('T')[0]:'-'}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Nationality</h5>
                                        <p>Indian</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Currant Address</h5>
                                        <p style={{width: '200px'}}>{adminData.admintemporaryaddress}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item" >
                                        <h5>Permanent Address</h5>
                                        <p style={{width: '200px'}}>{adminData.adminpermanentaddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="viewadmin_secondsection">
                                <div className="viewadmin_personaldetails">
                                    <h4>Educational  & Work Experience</h4>
                                </div>
                                <div className="viewadmin_personalinfo"> 
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Education</h5>
                                        <p style={{width: '200px'}}>B.A  in  JNTUH, Telangana 2015</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Experience</h5>
                                        <p style={{width: '200px'}}>English, PHB School from 2021 - 2023</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>Experience years</h5>
                                        <p style={{width: '200px'}}>English, Venky School from 2018 - 2021</p>
                                    </div>
                                </div>
                            </div>

                            <div className="viewadmin_secondsection">
                                <div className="viewadmin_personaldetails">
                                    <h4>Emergency Contacts</h4>
                                </div>
                                <div className="viewadmin_personalinfo"> 
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>contact name</h5>
                                        <p>{adminData.emergencycontantname?adminData.emergencycontantname:'-'}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>contact relationship</h5>
                                        <p>{adminData.emergencycontactrelationship?adminData.emergencycontactrelationship:'-'}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>contact number</h5>
                                        <p>{adminData.emergencycontactnumber?adminData.emergencycontactnumber:'-'}</p>
                                    </div>
                                    <div className="viewadmin_wrkdetails_item">
                                        <h5>contact email</h5>
                                        <p>{adminData.emergencycontactemail?adminData.emergencycontactemail:'-'}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        </>:<p>user data not found</p>}
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Eachadminview;