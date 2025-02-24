import React from "react";
import './Admissionemployees.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddIcon from '@mui/icons-material/Add';

function Admissionemployees(){
    const navigate  = useNavigate();
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="admissions-add-ol-admissions">
                            <div onClick={()=>navigate(-1)} style={{color:'blue'}}>
                                <KeyboardArrowLeftIcon sx={{fontSize:'1.1rem'}}/>
                                <p>back</p>
                            </div>
                            <div onClick={()=>navigate('/manageadmissions/createadmissionemployee')}>
                                <AddIcon sx={{fontSize:'1.1rem'}}/>
                                <p>Admission employee</p>
                            </div>
                        </div>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admissionemployees;