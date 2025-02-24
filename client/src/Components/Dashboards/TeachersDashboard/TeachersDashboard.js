import React from "react";
import './TeachersDashboard.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";

function TeachersDashboard(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <h1>teacher dashboard</h1>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TeachersDashboard;