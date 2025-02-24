
import React from 'react';
import './Admissionindex.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import newAdmission from "../../../Assets/new admission.png";
import oldAdmission from "../../../Assets/old admission.png";
import showApplications from "../../../Assets/show applications.png";
import admissionEmployee from "../../../Assets/admission employee.png";
import admissionbanner from "../../../Assets/Adi Desk banner.png";
import { useNavigate } from 'react-router-dom';

function Admissionindex(){
    const navigate = useNavigate();

    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>

                    <div className="managefee_banner">
                            <img src={admissionbanner} alt="banner"></img>
                            {/* <div class="managefee_text-overlay">Classroom Management</div> */}
                        </div>
                        {/* // write your code here \\ */}
                        <div className="managefee_con">

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageadmissions/showapplications')}>
                                <div className="managefee_image">
                                    <img src={showApplications} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Show Applications</h5>
                                </div>
                            </div>


                            <div className="managefee_feefeature" onClick={()=>navigate('/manageadmissions/admissions')}>
                                <div className="managefee_image">
                                    <img src={newAdmission} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Create Admission</h5>
                                </div>
                            </div>
                        
                      
                            <div className="managefee_feefeature" onClick={()=>navigate('/manageadmissions/admissions/oldadmissionform')}>
                                <div className="managefee_image">
                                    <img src={oldAdmission} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Create Existing Admissions</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageadmissions/admissionemployees')}>
                                <div className="managefee_image">
                                    <img src={admissionEmployee} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Admission Employees</h5>
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

export default Admissionindex;