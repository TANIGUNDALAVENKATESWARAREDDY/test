import React from 'react';
import './Managetransportidx.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import busgps from '../../../Assets/bus gps.png';
import busMngnt from '../../../Assets/bus management.png';
import busfee from '../../../Assets/bus fee.png';
import bushistory from '../../../Assets/bus history.png';
import busreports from '../../../Assets/transport_reports.png';
import Transbanner from "../../../Assets/transport mana.png";
import { useNavigate } from 'react-router-dom';

function Managetransportidx(){
    const navigate = useNavigate();
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}

                        <div className="managefee_banner">
                            <img src={Transbanner} alt="banner"></img>
                            {/* <div className="managefee_text-overlay">Transportation Management</div> */}
                        </div>
                        <div className="managefee_con">

                            <div className="managefee_feefeature" onClick={()=>navigate('/managetransport/enabletransport')}>
                                <div className="managefee_image">
                                    <img src={busreports} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Enable Transport</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/managetransport/paytransportfee')}>
                                <div className="managefee_image">
                                    <img src={busfee} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Pay Transport Fee</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/managetransport/transportfeehistory')}>
                                <div className="managefee_image">
                                    <img src={bushistory} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Transport Fee History</h5>
                                </div>
                            </div>
                        
                            <div className="managefee_feefeature" onClick={()=>navigate('/managetransport/townsandfee')}>
                                <div className="managefee_image">
                                    <img src={busreports} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Towns & fee</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={busMngnt} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Bus Management</h5>
                                </div>
                            </div>
                            
                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={busgps} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>GPS Tracking</h5>
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

export default Managetransportidx;