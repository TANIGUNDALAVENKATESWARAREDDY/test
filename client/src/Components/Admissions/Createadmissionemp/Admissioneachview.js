import React from 'react';
import './Admissioneachview.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import profilepic from "../../../Assets/dupilcatepic.PNG";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
function Admissioneachview(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='ademp_eachview_con'>
                            <div className='ademp_eachview_topsection'>
                                <div className='ademp_eachview_nameplate'>
                                    <div className='ademp_eachview_imgcon'>
                                        <img src={profilepic} alt='profile pic'></img>
                                    </div>
                                    <div className='ademp_eachview_name'>
                                        <h4>Hari Keerthi</h4>
                                        <p>Admission Officer</p>
                                    </div>
                                </div>
                                <div className='ademp_eachview_contactdetails_con'>
                                    <h3>Contact Details</h3>
                                    <div className='ademp_eachview_contactdetails'>
                                        <div className='ademp_eachview_details_con'>
                                            <div className='ademp_eachview_details'>
                                                <p>Phone</p>
                                                <h5>+91 6883444667</h5>
                                            </div>
                                            <div className='ademp_eachview_details'>
                                                <p>Current Address</p>
                                                <h5>Flat 212, kavuri Hills, Madhapur, Hyderabad, Telangana</h5>
                                            </div>
                                        </div>
                                        <div className='ademp_eachview_details_con'>
                                            <div className='ademp_eachview_details'>
                                                <p>Email</p>
                                                <h5>schoolmanagement@gmail.com</h5>
                                            </div>
                                            <div className='ademp_eachview_details'>
                                                <p>Permanent Address</p>
                                                <h5>Flat 212, kavuri Hills, Madhapur, Hyderabad, Telangana</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='ademp_eachview_middlesection'>
                                <div className='ademp_eachview_totalpayments'>
                                    <div className='ademp_eachview_paymentbox'>
                                        <p>Total Amount</p>
                                        <h4> &#8377;20,456,00</h4>
                                    </div>
                                    <div  className='ademp_eachview_paymentbox'>
                                        <p>Amount Paid</p>
                                        <h4>&#8377;20,456,00</h4>
                                    </div>
                                    <div  className='ademp_eachview_paymentbox'>
                                        <p>Total Admissions</p>
                                        <h4>56</h4>
                                    </div>
                                    <div  className='ademp_eachview_paymentbox'>
                                        <p>Current year Admissions</p>
                                        <h4>13</h4>
                                    </div>
                                </div>


                                <div className='ademp_eachview_transactionSection'> 
                                    <div className='ademp_eachview_trans_heading'>
                                        <h3>Transaction Details</h3>
                                        <KeyboardArrowRightIcon/>
                                    </div>
                                    <div className='ademp_eachview_trans_con'>
                                        <div className='ademp_eachview_trans'>
                                            <div className='ademp_eachview_trans_topsec'>
                                                <div className='ademp_eachview_trans_name'>
                                                    <h4>Hari Keerthi</h4>
                                                    <p><AccountBalanceWalletIcon/>********36789</p>
                                                </div>
                                                <div className='ademp_eachview_trans_date'>
                                                    <p>21 June 2024</p>
                                                </div>
                                            </div>
                                            <div className='ademp_eachview_trans_paid'>
                                                <p><FiberManualRecordIcon sx={{fontSize : 15}}/> Paid</p>
                                                <h4>&#8377;21500</h4>
                                            </div>
                                        </div>
                                        
                                        <div className='ademp_eachview_trans'>
                                            <div className='ademp_eachview_trans_topsec'>
                                                <div className='ademp_eachview_trans_name'>
                                                    <h4>Hari Keerthi</h4>
                                                    <p><AccountBalanceWalletIcon/>********36789</p>
                                                </div>
                                                <div className='ademp_eachview_trans_date'>
                                                    <p>21 June 2024</p>
                                                </div>
                                            </div>
                                            <div className='ademp_eachview_trans_paid'>
                                                <p><FiberManualRecordIcon sx={{fontSize : 15}}/> Paid</p>
                                                <h4>&#8377;21500</h4>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div className='ademp_eachview_bottomsection'>
                            <h2 class="ademp_eachview_table-title">Applicant Data Table</h2>
                                <table class="ademp_eachview_table">
                                    <thead class="ademp_eachview_table-header">
                                        <tr>
                                            <th>Date</th>
                                            <th>Student Name</th>
                                            <th>Class</th>
                                            <th>Contact Num</th>
                                            <th>Admission Incentive</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="ademp_eachview_table-row">
                                            <td>20/06/2024</td>
                                            <td>pusarla venkatesh</td>
                                            <td>6th</td>
                                            <td>+91 868768534</td>
                                            <td><span class="ademp_eachview_incentive">21500/-</span></td>
                                        </tr>
                                        <tr class="ademp_eachview_table-row">
                                            <td>20/06/2024</td>
                                            <td>pusarla venkatesh</td>
                                            <td>6th</td>
                                            <td>+91 868768534</td>
                                            <td><span class="ademp_eachview_incentive">21500/-</span></td>
                                        </tr>
                                        <tr class="ademp_eachview_table-row">
                                            <td>20/06/2024</td>
                                            <td>pusarla venkatesh</td>
                                            <td>6th</td>
                                            <td>+91 868768534</td>
                                            <td><span class="ademp_eachview_incentive">21500/-</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admissioneachview;