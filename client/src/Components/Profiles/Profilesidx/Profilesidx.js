import React from 'react';
import './Profilesidx.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import Feebanner from "../../../Assets/profile mana.png";
import createadmin from "../../../Assets/Create Admin.png";
import createteacher from "../../../Assets/create teacher.png";
import viewadmin from "../../../Assets/view admins.png";
import viewteachers from "../../../Assets/view teachers.png";
import viewstaff from "../../../Assets/staff view.png";
import createstaff from "../../../Assets/create staff.png";
import { useNavigate } from 'react-router-dom';

function Profilesidx(){
    const navigate = useNavigate();
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="managefee_banner">
                            <img src={Feebanner} alt="banner"></img>
                            {/* <div className="managefee_text-overlay">Profile Management</div> */}
                        </div>
                        <div className="managefee_con">
                            <div className="managefee_feefeature" onClick={()=>navigate('/manageprofiles/createadmin')}>
                                <div className="managefee_image">
                                    <img src={createadmin} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Create Admin</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageprofiles/viewadmins')}>
                                <div className="managefee_image">
                                    <img src={viewadmin} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>View Admins</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageprofiles/createteacher')}>
                                <div className="managefee_image">
                                    <img src={createteacher} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Create Teacher</h5>
                                </div>
                            </div>
                        
                            <div className="managefee_feefeature" onClick={()=>navigate('/manageprofiles/viewteachers')}>
                                <div className="managefee_image">
                                    <img src={viewteachers} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>View Teacher</h5>
                                </div>
                            </div>
                            
                            <div className="managefee_feefeature" onClick={()=>navigate('/manageprofiles/createstaff')}>
                                <div className="managefee_image">
                                    <img src={createstaff} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Create Staff</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageprofiles/viewstaff')}>
                                <div className="managefee_image">
                                    <img src={viewstaff} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>View Staff</h5>
                                </div>
                            </div>
                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}


export default Profilesidx;