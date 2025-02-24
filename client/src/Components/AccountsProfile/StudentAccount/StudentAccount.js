import React from 'react';
import './StudentAccount.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';

function StudentAccount(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <h1>student account</h1>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentAccount;