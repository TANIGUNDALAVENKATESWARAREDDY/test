import React from 'react';
import './ParentsDashboard.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';

function ParentsDashboard(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <h1>parents dashboard</h1>
                </div>
            </div>
        </>
    );
}

export  default ParentsDashboard;