import React from "react";
import './Findstudent.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import { useNavigate } from "react-router-dom";


function Findstudent(){
    const navigate = useNavigate();
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}

                        {/* top path display */}
                        <div className="show-applications-top-path">
                            <p><span>get student using regID</span></p>
                        </div>

                        <div className="viewstudents-student-regid-link">
                            <p onClick={()=>navigate('/viewstudents')}>get all students {`>`}</p>
                        </div>

                        <div className="viewstudents-get-allstudents">
                            <div className="viewstudents-getstudents-header">
                                <p>Get Student data</p>
                            </div>
                            
                        </div>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Findstudent;