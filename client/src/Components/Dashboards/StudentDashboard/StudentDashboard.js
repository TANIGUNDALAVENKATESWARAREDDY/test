import React from "react";
import './StudentDashboard.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";

function StudentDashboard(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <h1>student dashboard</h1>
                </div>
            </div>
        </>
    );
}

export default StudentDashboard;