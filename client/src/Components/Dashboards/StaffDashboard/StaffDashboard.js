import React from 'react';
import './StaffDashboard.css';
import Topnav from '../../Topnav/Topnav';
import Sidenav from '../../Sidenav/Sidenav';

function StaffDashboard(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    {/* your code strat form here */}
                    <h1>staff dashboard</h1>

                    {/* your code ends here */}
                </div>
            </div>
        </>
    );
}

export default StaffDashboard;