import React, { useState } from 'react';
import './Createstaff.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { API_URL } from '../../../Data/Docs';
import { useDispatch } from 'react-redux';
import { Logout } from '../../AllFunctions/Logout';

function Createstaff(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[showErrors,setShowErrors] = useState({});
    const[showloading,setShowloading]= useState(false);
    const [staffData,setStaffData] = useState({
        stafffirstname:'',
        staffmiddlename:'',
        stafflastname:'',
        staffregid:'',
        role:'staff',
        staffDOJ:'',
        staffimgurl:'',
        staffemail:'',
        staffmobilenumber:'',
        staffDOB:'',
        staffgender:'',
        staffmaritalstatus:'',
        stafftemporaryaddress:'',
        staffpermanentaddress:'',
        staffhighqualification:'',
        staffpreviouswork:'',//just take input
        staffpreviousrole:'',
        staffworkexperienceyears:0,
        emergencycontactname:'',
        emergencycontactrelationship:'',
        emergencycontactnumber:'',
        emergencycontactemail:''
    });
    
    //function to create the staff
    async function handleCreateNewStaff(e){
        e.preventDefault();
        setShowloading(true);
        try{
            if(staffData.stafffirstname!=='' && staffData.staffregid!=='' && staffData.role!=='' && staffData.staffmobilenumber!==''
            ){
                setShowErrors({});
                //here we have to call the api to store the data
                const response = await fetch(`${API_URL}/staff/createNewStaff`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    credentials:'include',
                    body:JSON.stringify(staffData)
                });

                if(!response.ok){
                    if(response.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const resData = await response.json();
                if(resData.success){
                    alert('successfully created the staff');
                    setStaffData(prev=>({
                        ...prev,
                        stafffirstname:'',
                        staffmiddlename:'',
                        stafflastname:'',
                        staffregid:'',
                        role:'staff',
                        staffDOJ:'',
                        staffimgurl:'',
                        staffemail:'',
                        staffmobilenumber:'',
                        staffDOB:'',
                        staffgender:'',
                        staffmaritalstatus:'',
                        stafftemporaryaddress:'',
                        staffpermanentaddress:'',
                        staffhighqualification:'',
                        staffpreviouswork:'',//just take input
                        staffpreviousrole:'',
                        staffworkexperienceyears:0,
                        emergencycontactname:'',
                        emergencycontactrelationship:'',
                        emergencycontactnumber:'',
                        emergencycontactemail:''
                    }));
                }else{
                    alert('getting an error while creating the staff');
                }
            }else{
                alert('please fill all  fields');
                const tempErrors ={};
                if(staffData.stafffirstname==='') tempErrors.stafffirstname='enter first name';
                if(staffData.stafflastname==='') tempErrors.stafflastname='enter last name';
                if(staffData.staffregid==='') tempErrors.staffregid='enter employee id';
                if(staffData.role==='') tempErrors.role=' role';
                if(staffData.staffDOJ==='') tempErrors.staffDOJ='choose joining date';
                if(staffData.staffmobilenumber==='') tempErrors.staffmobilenumber='enter mobile number';
                if(staffData.staffgender==='') tempErrors.staffgender='choose gender';
                if(staffData.staffpermanentaddress==='') tempErrors.staffpermanentaddress='enter permanent address';
                setShowErrors(tempErrors);
            }
        }catch(err){
            console.log('getting an error while creating the staff ',err);
        }
        setShowloading(false);
    }

    //function for inital form check
    function handleInitialFormCheck(){
        const tempErrors ={};
        if(staffData.stafffirstname==='') tempErrors.stafffirstname='enter first name';
        if(staffData.stafflastname==='') tempErrors.stafflastname='enter last name';
        if(staffData.staffregid==='') tempErrors.staffregid='enter employee id';
        if(staffData.role==='') tempErrors.role=' role';
        if(staffData.staffDOJ==='') tempErrors.staffDOJ='choose joining date';
        if(staffData.staffmobilenumber==='') tempErrors.staffmobilenumber='enter mobile number';
        if(staffData.staffgender==='') tempErrors.staffgender='choose gender';
        if(staffData.staffpermanentaddress==='') tempErrors.staffpermanentaddress='enter permanent address';
        setShowErrors(tempErrors);
    }

    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-top-back-btn' style={{marginBottom:15,paddingTop:15}} onClick={()=>navigate(-1)} >
                            <KeyboardArrowLeftIcon/>
                            <p>back</p>
                        </div>
                        <div className='createadmin_con'>
                            <div className='createadmin_heading'>
                                <h1>Create Staff</h1>
                            </div>
                            <form  className='createadmin_form' onSubmit={(e)=>handleCreateNewStaff(e)}>
                                <h3>Employee Data</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>First Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='First Name' value={staffData.stafffirstname} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            stafffirstname:e.target.value
                                        }))} />
                                        {showErrors.stafffirstname && <small className='createstaff-input-errors'>{showErrors.stafffirstname}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Middle Name</label>
                                        <input type='text' placeholder='Middle Name'
                                         value={staffData.staffmiddlename}
                                         onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffmiddlename:e.target.value
                                        }))}
                                        />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Last Name</label>
                                        <input type='text' placeholder='Last Name' 
                                            value={staffData.stafflastname}
                                            onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            stafflastname:e.target.value
                                        }))} />
                                        {showErrors.stafflastname && <small className='createstaff-input-errors'>{showErrors.stafflastname}</small>}
                                    </div>
                                
                                    <div className='createadmin_input-field'>
                                        <label>Employee ID <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Employee ID' 
                                        value={staffData.staffregid}
                                        onChange={(e)=>setStaffData(prev=>({
                                           ...prev,
                                           staffregid:e.target.value
                                       }))} />
                                       {showErrors.staffregid && <small className='createstaff-input-errors'>{showErrors.staffregid}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Designation (Role) <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Designation' 
                                        value={staffData.role}
                                        onChange={(e)=>setStaffData(prev=>({
                                           ...prev,
                                           role:e.target.value
                                       }))} />
                                       {showErrors.role && <small className='createstaff-input-errors'>{showErrors.role}</small>}
                                    </div>
                                    
                                    <div className='createadmin_input-field'>
                                        <label>Date of Joining</label>
                                        <input type='date' placeholder='Date of Joining' 
                                        value={staffData.staffDOJ}
                                        onChange={(e)=>setStaffData(prev=>({
                                           ...prev,
                                           staffDOJ:e.target.value
                                       }))} />
                                       {showErrors.staffDOJ && <small className='createstaff-input-errors'>{showErrors.staffDOJ}</small>}
                                    </div>
                                    {/* upload image  we are going with canvas */}
                                    <div className='createadmin_input-field'>
                                        <label>Upload Photo</label>
                                        <input type='file' placeholder='pass' />
                                    </div>
                                </div>
                                <h3>Personal Information</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Email</label>
                                        <input type='mail' placeholder='Email' value={staffData.staffemail}
                                         onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffemail:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Mobile Number <span style={{color:'red'}}>*</span></label>
                                        <input type='number' placeholder='Mobile Number' 
                                        value={staffData.staffmobilenumber}
                                        onChange={(e)=>setStaffData(prev=>({
                                           ...prev,
                                           staffmobilenumber:e.target.value
                                       }))} />
                                       {showErrors.staffmobilenumber && <small className='createstaff-input-errors'>{showErrors.staffmobilenumber}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Date Of Birth</label>
                                        <input type='date' placeholder='Enter your DOB' 
                                        value={staffData.staffDOB}
                                        onChange={(e)=>setStaffData(prev=>({
                                           ...prev,
                                           staffDOB:e.target.value
                                       }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Gender</label>
                                        <select value={staffData.staffgender} onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffgender:e.target.value
                                        }))} >
                                            <option value='' selected>Select gender</option>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                            <option value='other'>Others</option>
                                        </select>
                                        {showErrors.staffgender && <small className='createstaff-input-errors'>{showErrors.staffgender}</small>}
                                    </div>
                                    <div className="createadmin_input-field">
                                        <label>Marital Status</label>
                                        <select value={staffData.staffmaritalstatus}
                                         onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffmaritalstatus:e.target.value
                                        }))}>
                                            <option value=''>Select gender</option>
                                            <option value='unmarried' >Unmarried</option>
                                            <option value='married'>Married</option>
                                            <option value='widowed'>Widowed</option>
                                            <option value='divorced'>Divorced</option>
                                        </select>
                                    </div>
                                </div>
                                <h3>Address</h3>
                                <div  className='createadmin_textarea'>
                                    <div className='createadmin_input-field'>
                                            <label>Temporary Address</label>
                                            <textarea type='text' placeholder='Enter your Temporary Address' 
                                            value={staffData.stafftemporaryaddress}
                                            onChange={(e)=>setStaffData(prev=>({
                                                ...prev,
                                                stafftemporaryaddress:e.target.value
                                            }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                            <label>Permanent Address</label>
                                            <textarea type='text' placeholder='Enter your Permanent Address' value={staffData.staffpermanentaddress}
                                            onChange={(e)=>setStaffData(prev=>({
                                                ...prev,
                                                staffpermanentaddress:e.target.value
                                            }))} />
                                            {showErrors.staffpermanentaddress && <small className='createstaff-input-errors'>{showErrors.staffpermanentaddress}</small>}
                                    </div>
                                </div>

                                <h3>Acadamic Details</h3>
                                <div className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Highest Qualification</label>
                                        <select
                                        value={staffData.staffhighqualification}
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffhighqualification:e.target.value
                                        }))}
                                        >
                                            <option value=''>Select Qualification</option>
                                            <option value='phd'>PHD</option>
                                            <option value='pg'>PG</option>
                                            <option value='ug'>UG</option>
                                            <option value='NA'>NA</option>
                                            <option value='other'>Other</option>
                                        </select>
                                    </div>
                                    
                                    
                                </div>

                                <h3>Work Experience</h3>
                                <div className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Previous Employer</label>
                                        <input type='text' placeholder='Enter company name'  
                                        value={staffData.staffpreviouswork} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffpreviouswork:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Previous Job role</label>
                                        <input type='text' placeholder='Enter Job Role' 
                                        value={staffData.staffpreviousrole} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffpreviousrole:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Work Experience <span>In Years</span></label>
                                        <input type='number' placeholder='Enter Work Experience' 
                                        value={staffData.staffpreviouswork} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            staffpreviouswork:e.target.value
                                        }))} />
                                    </div>
                                </div>

                                <h3>Additional Contact</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Emergency Contact Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Contact Name' 
                                        value={staffData.emergencycontactname} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            emergencycontactname:e.target.value
                                        }))}
                                         />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Relationship</label>
                                        <input type='text' placeholder='Enter relation' 
                                        value={staffData.emergencycontactrelationship} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            emergencycontactrelationship:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Emergency Contact Number <span style={{color:'red'}}>*</span></label>
                                        <input type='number' placeholder='Mobile Number' 
                                        value={staffData.emergencycontactnumber} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            emergencycontactnumber:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Email</label>
                                        <input type='mail' placeholder='Enter email' 
                                        value={staffData.emergencycontactemail} 
                                        onChange={(e)=>setStaffData(prev=>({
                                            ...prev,
                                            emergencycontactemail:e.target.value
                                        }))}/>
                                    </div>
                                </div>
                                <button class="createadmin_sumbit"  type='submit' onClick={()=>handleInitialFormCheck()}>
                                        <span class="createadmin_btnText">Submit</span>
                                </button>
                            </form>

                        </div>

                        {/* your ends here */}
                    </div>
                </div>
            </div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Createstaff;