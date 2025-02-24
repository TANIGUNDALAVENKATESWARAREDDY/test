import React from "react";
import './Managefeeidx.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
// import AddIcon from '@mui/icons-material/Add';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from "react-router-dom";
import FeeIcon from "../../../Assets/rupee.png";
import Feehistory from "../../../Assets/fee history.png";
import Feepayments from "../../../Assets/fee payments.png";
import Feebanner from "../../../Assets/Fee Man banner.png";

function Managefeeidx(){
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
                        {/* <div className="show-applications-top-path">
                            <p><span>fee management</span></p>
                        </div> */}

                        <div className="managefee_banner">
                            <img src={Feebanner} alt="banner"></img>
                            {/* <div className="managefee_text-overlay">Classroom Management</div> */}
                        </div>

                        {/* all features box */}
                        <div className="managefee_con">
                            <div className="managefee_feefeature" onClick={()=>navigate('/managefees/changefee')}>
                                <div className="managefee_image">
                                    <img src={FeeIcon} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Change Fee</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/managefees/studentsfeehistory')}>
                                <div className="managefee_image">
                                    <img src={Feehistory} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Student Fee History</h5>
                                </div>
                            </div>
                        
                      
                            <div className="managefee_feefeature" onClick={()=>navigate('/managefees/feepayments')}>
                                <div className="managefee_image">
                                    <img src={Feepayments} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Fee Payments</h5>
                                </div>
                            </div>

                            
                        </div>
                       
                    </div>
                </div>
            </div>
        
        </>
    );
}

export default Managefeeidx;