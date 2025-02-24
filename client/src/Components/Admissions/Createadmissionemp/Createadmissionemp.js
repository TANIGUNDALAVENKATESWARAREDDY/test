import React from "react";
import './Createadmissionemp.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";

function Createadmissioinemp(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="show-applications-top-path">
                            <p>Home - Admissions - <span>Admission Employee</span></p>
                        </div>                        
                        <div className='createadmin_con'>
                            <div className='createadmin_heading'>
                                <h1>Admission Employee Registration</h1>
                            </div>
                            <form  className='createadmin_form'>
                                <h3>Employee Data</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>First Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='First Name' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Middle Name</label>
                                        <input type='text' placeholder='Middle Name' />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Last Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Last Name' required />
                                    </div>
                                
                                    <div className='createadmin_input-field'>
                                        <label>Employee ID <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Employee ID' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Designation (Role <span style={{color:'red'}}>*</span>)</label>
                                        <input type='text' placeholder='Designation' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Department <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Enter subject name' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Date of Joining <span style={{color:'red'}}>*</span></label>
                                        <input type='date' placeholder='Date of Joining' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Upload Photo <span style={{color:'red'}}>*</span></label>
                                        <input type='file' placeholder='pass' required />
                                    </div>
                                </div>
                                <h3>Personal Information</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Email</label>
                                        <input type='mail' placeholder='Email' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Mobile Number <span style={{color:'red'}}>*</span></label>
                                        <input type='number' placeholder='Mobile Number' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Date Of Birth <span style={{color:'red'}}>*</span></label>
                                        <input type='date' placeholder='Enter your DOB' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Gender <span style={{color:'red'}}>*</span></label>
                                        <select>
                                            <option disabled selected>Select gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Others</option>
                                        </select>
                                    </div>
                                </div>
                                <h3>Address</h3>
                                <div  className='createadmin_textarea'>
                                    <div className='createadmin_input-field'>
                                            <label>Temporary Address <span style={{color:'red'}}>*</span></label>
                                            <textarea type='text' placeholder='Enter your Temporary Address' required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                            <label>Permanent Address <span style={{color:'red'}}>*</span></label>
                                            <textarea type='text' placeholder='Enter your Permanent Address' required />
                                    </div>
                                </div>

                                <button class="createadmin_sumbit">
                                        <span class="createadmin_btnText">Submit</span>
                                </button>
                            </form>

                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Createadmissioinemp;