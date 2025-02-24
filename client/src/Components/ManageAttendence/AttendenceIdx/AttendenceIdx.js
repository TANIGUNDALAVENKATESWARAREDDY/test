import React from 'react';
import './AttendenceIdx.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import attendencelog from '../../../Assets/attendence log.png';
import viewattendence from '../../../Assets/view attendence.png';
import viewhistory from '../../../Assets/view history.png';
import viewreports from '../../../Assets/attendence reports.png';
import attendencebanner from '../../../Assets/attendence banner.png';

function AttendenceIdx(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="managefee_banner">
                            <img src={attendencebanner} alt="banner"></img>
                        </div>
                        <div className="managefee_con">
                            <div className="managefee_feefeature">
                                <div className="managefee_image">
                                    <img src={attendencelog} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5> Mark Attendance</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature">
                                <div className="managefee_image">
                                    <img src={viewattendence} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>View Attendance</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={viewhistory} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Attendance History</h5>
                                </div>
                            </div>
                        
                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={viewreports} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Attendance Reports</h5>
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

export default AttendenceIdx;