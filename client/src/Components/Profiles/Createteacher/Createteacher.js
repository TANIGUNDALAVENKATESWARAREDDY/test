import React, { useState } from "react";
import './Createteacher.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { API_URL } from "../../../Data/Docs";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { Logout } from "../../AllFunctions/Logout";

function Createteacher(){
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const[formErrors,setFormErrors] = useState({});
    const[showloading,setShowloading]= useState(false);
    const [teachersData , setTeachersData] = useState({
        teacherfirstname:'',
        teachersmiddlename:'',
        teacherslastname:'',
        teacherregid:'',
        role:'teacher',
        teacherspecilizedsubject:'',
        teacherDOJ:'',
        teacherimgurl:'',
        teacheremail:'',
        teachermobilenumber:'',
        teacherDOB:'',
        teachergender:'',
        teachermaritalstatus:'',
        teachertemporaryaddress:'',
        teacherpermanentaddress:'',
        teacherhighqualification:'',
        teacherifotherquoalification:'',
        teacherYOG:'',
        teachergraduationclg:'',
        teacherpreviouscompany:'',
        teacherpreviousjobrole:'',
        teacherprevioussubjobrole:'',
        teacherworkexprienceyears:0,
        teacherpreviouskeyresponsibility:'',
        emergencycontantname:'',
        emergencycontactrelationship:'',
        emergencycontactnumber:'',
        emergencycontactemail:'',
    });

    //toast notifications
    const invalidform = (msg) =>toast.info(`${msg}`,{
        // className:'login-info-notify',
        style:{
            color:'white',
            textAlign:'center',
            minHeight:0,
            width:'fit-content',
            backgroundImage: 'linear-gradient(to right top, #68a3f3, #3b8af8, #006ff9, #0051f5, #1228eb)',
        },
        icon:false
    });

    const formError =(msg)=>toast.error(`${msg}`,{
        className:'login-error-notify',
        icon:false
    });

    const formSuccess =(msg)=>toast.success(`${msg}`,{
        icons:false,
        style:{
            textAlign:'center'
        }
    });

    async function handleCreateNewTeacher(e){
        e.preventDefault();
        setShowloading(true);
        try{
            if(teachersData.teacherregid!=='' && teachersData.teacherslastname!=='' && teachersData.teacherfirstname!=='' && teachersData.teacherspecilizedsubject!==''
                && teachersData.teacherDOJ!=='' && teachersData.teachermobilenumber!=='' && teachersData.teacherDOB!=='' && teachersData.teachergender!=='' && teachersData.teacherpermanentaddress!==''
                && teachersData.teacherhighqualification!=='' && teachersData.teacherYOG!=='' && teachersData.teachergraduationclg!==''
            ){
                setFormErrors({});
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                const response = await fetch(`${API_URL}/teachers/addnewteacher`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(teachersData),
                    credentials:'include'
                });
                clearTimeout(timeoutId);
                if(response.status === 401) {
                    alert('Your session is expired,please login again');
                    Logout(dispatch,navigate);
                    throw new Error('Unauthorized - Token expired');
                }
                const resData = await response.json();
                if(resData.success){
                    setTeachersData(prev=>({
                        ...prev,
                        teacherfirstname:'',
                        teachersmiddlename:'',
                        teacherslastname:'',
                        teacherregid:'',
                        role:'teacher',
                        teacherspecilizedsubject:'',
                        teacherDOJ:'',
                        teacherimgurl:'',
                        teacheremail:'',
                        teachermobilenumber:'',
                        teacherDOB:'',
                        teachergender:'',
                        teachermaritalstatus:'',
                        teachertemporaryaddress:'',
                        teacherpermanentaddress:'',
                        teacherhighqualification:'',
                        teacherifotherquoalification:'',
                        teacherYOG:'',
                        teachergraduationclg:'',
                        teacherpreviouscompany:'',
                        teacherpreviousjobrole:'',
                        teacherprevioussubjobrole:'',
                        teacherworkexprienceyears:0,
                        teacherpreviouskeyresponsibility:'',
                        emergencycontantname:'',
                        emergencycontactrelationship:'',
                        emergencycontactnumber:'',
                        emergencycontactemail:'',
                    }));
                    formSuccess('successfully added the new teacher');
                }else{
                    console.log('error while adding the data : ',resData.message);
                    formError('getting an error while adding the new teacher');
                }
            }else{
                const tempErrors = {};
                if(teachersData.teacherregid==='') tempErrors.teacherregid='register id required';
                if(teachersData.teacherslastname==='') tempErrors.teacherslastname='required last name';
                if(teachersData.teacherfirstname==='') tempErrors.teacherfirstname='required first name';
                if(teachersData.teacherspecilizedsubject==='') tempErrors.teacherspecilizedsubject='required specialized subject';
                if(teachersData.teacherDOJ==='') tempErrors.teacherDOJ='required date of joining';
                if(teachersData.teachermobilenumber==='') tempErrors.teachermobilenumber='required mobile number';
                if(teachersData.teacherDOB==='') tempErrors.teacherDOB='enter teacher date of birth';
                if(teachersData.teachergender==='') tempErrors.teachergender='required teacher gender';
                if(teachersData.teacherpermanentaddress==='') tempErrors.teacherpermanentaddress='required permanent address';

                if(teachersData.teacherhighqualification==='') tempErrors.teacherhighqualification='teacher high qualification';
                if(teachersData.teacherYOG==='') tempErrors.teacherYOG='required year of graduation';

                if(teachersData.teachergraduationclg==='') tempErrors.teachergraduationclg='required graduation college';

                setFormErrors(tempErrors);

                invalidform('please fill all the required fields');
            }
        }catch(err){
            console.log('getting an erorr while adding the new teacher',err);
            if (err.name === 'AbortError') {
                formError("Request timed out. Please try again.");
            }else{
                formError('getting an error while adding teacher');
            }
            
        }
        setShowloading(false);
    }
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        {/* top path display */}
                        <div className="show-applications-top-path">
                            <p>Home - Profiles - <span>create teacher</span></p>
                        </div>                        
                        <div className='createadmin_con'>
                            <div className='admissionform-top-back-btn' style={{marginBottom:15}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>
                            <div className='createadmin_heading'>
                                <h1>Create Teacher</h1>
                            </div>
                            <form  className='createadmin_form'>
                                <h3>Employee Data</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>First Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='First Name' 
                                        value={teachersData.teacherfirstname}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherfirstname:e.target.value
                                        }))}
                                         />
                                         {formErrors.teacherfirstname && <small className="form-required-fields">{formErrors.teacherfirstname}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Middle Name</label>
                                        <input type='text' placeholder='Middle Name' 
                                        value={teachersData.teachersmiddlename}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teachersmiddlename:e.target.value
                                        }))}
                                        />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Last Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Last Name' 
                                        value={teachersData.teacherslastname}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherslastname:e.target.value
                                        }))} />
                                        {formErrors.teacherslastname && <small className="form-required-fields">{formErrors.teacherslastname}</small>}
                                    </div>
                                
                                    <div className='createadmin_input-field'>
                                        <label>Employee ID <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Employee ID' 
                                        value={teachersData.teacherregid}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherregid:e.target.value
                                        }))}
                                         />
                                         {formErrors.teacherregid && <small className="form-required-fields">{formErrors.teacherregid}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Designation (Role <span style={{color:'red'}}>*</span>)</label>
                                        <input type='text' placeholder='Designation' value={'teacher'} readOnly/>
                                    </div>
                                    {/* <div className='createadmin_input-field'>
                                        <label>Sub Designation <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Designation' required />
                                    </div> */}
                                    {/* <div className='createadmin_input-field'>
                                        <label>Department <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Enter subject name' required />
                                    </div> */}

                                    <div className='createadmin_input-field'>
                                        <label>Specilized Subject <span style={{color:'red'}}>*</span></label>
                                        <select 
                                        value={teachersData.teacherspecilizedsubject}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherspecilizedsubject:e.target.value
                                        }))}
                                        >
                                            <option value=''>Select Subjects</option>
                                            <option value='mathematics'>Mathematics</option>
                                            <option value='science'>Science</option>
                                            <option value='english'>English</option>
                                            <option value='history'>History</option>
                                            <option value='geography'>Geography</option>
                                            <option value='computer_science'>Computer Science</option>
                                            <option value='physics'>Physics</option>
                                            <option value='chemistry'>Chemistry</option>
                                            <option value='biology'>Biology</option>
                                            <option value='other'>other</option>
                                        </select>
                                        {formErrors.teacherspecilizedsubject && <small className="form-required-fields">{formErrors.teacherspecilizedsubject}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Date of Joining <span style={{color:'red'}}>*</span></label>
                                        <input type='date' placeholder='Date of Joining' 
                                        value={teachersData.teacherDOJ}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherDOJ:e.target.value
                                        }))} />
                                        {formErrors.teacherDOJ && <small className="form-required-fields">{formErrors.teacherDOJ}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Upload Photo</label>
                                        <input type='file' placeholder='pass'  />
                                    </div>
                                </div>
                                <h3>Personal Information</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Email</label>
                                        <input type='mail' placeholder='Email'
                                        value={teachersData.teacheremail}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacheremail:e.target.value
                                        }))}  />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Mobile Number <span style={{color:'red'}}>*</span></label>
                                        <input type='number' placeholder='Mobile Number'
                                        value={teachersData.teachermobilenumber}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teachermobilenumber:e.target.value
                                        }))}
                                         />
                                         {formErrors.teachermobilenumber && <small className="form-required-fields">{formErrors.teachermobilenumber}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Date Of Birth <span style={{color:'red'}}>*</span></label>
                                        <input type='date' placeholder='Enter your DOB' 
                                        value={teachersData.teacherDOB}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherDOB:e.target.value
                                        }))} />
                                        {formErrors.teacherDOB && <small className="form-required-fields">{formErrors.teacherDOB}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Gender <span style={{color:'red'}}>*</span></label>
                                        <select 
                                        value={teachersData.teachergender}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teachergender:e.target.value
                                        }))}
                                        >
                                            <option value=''>Select gender</option>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                            <option value='other'>Other</option>
                                        </select>
                                        {formErrors.teachergender && <small className="form-required-fields">{formErrors.teachergender}</small>}
                                    </div>
                                    <div className="createadmin_input-field">
                                        <label>Marital Status</label>
                                        <select
                                        value={teachersData.teachermaritalstatus}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teachermaritalstatus:e.target.value
                                        }))}
                                        >
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
                                            value={teachersData.teachertemporaryaddress}
                                            onChange={(e)=>setTeachersData(prev=>({
                                                ...prev,
                                                teachertemporaryaddress:e.target.value
                                            }))}
                                             />
                                    </div>
                                    <div className='createadmin_input-field'>
                                            <label>Permanent Address <span style={{color:'red'}}>*</span></label>
                                            <textarea type='text' placeholder='Enter your Permanent Address' 
                                            value={teachersData.teacherpermanentaddress}
                                            onChange={(e)=>setTeachersData(prev=>({
                                                ...prev,
                                                teacherpermanentaddress:e.target.value
                                            }))}
                                             />
                                             {formErrors.teacherpermanentaddress && <small className="form-required-fields">{formErrors.teacherpermanentaddress}</small>}
                                    </div>
                                </div>

                                <h3>Acadamic Details</h3>
                                <div className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Highest Qualification <span style={{color:'red'}}>*</span></label>
                                        <select
                                        value={teachersData.teacherhighqualification}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherhighqualification:e.target.value
                                        }))}
                                        >
                                            <option value=''>Select Qualification</option>
                                            <option value='phd'>PHD</option>
                                            <option value='pg'>PG</option>
                                            <option value='ug'>UG</option>
                                            <option value='other'>Other</option>
                                        </select>
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Year of Graduation  <span style={{color:'red'}}>*</span></label>
                                        <input type='number' placeholder='Enter year' 
                                        value={teachersData.teacherYOG}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherYOG:e.target.value
                                        }))}
                                         />
                                         {formErrors.teacherYOG && <small className="form-required-fields">{formErrors.teacherYOG}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>College/University Name  <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='College/University Name' 
                                        value={teachersData.teachergraduationclg}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teachergraduationclg:e.target.value
                                        }))}
                                         />
                                         {formErrors.teachergraduationclg && <small className="form-required-fields">{formErrors.teachergraduationclg}</small>}
                                    </div>
                                </div>

                                <h3>Work Experience</h3>
                                <div className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Previous Employer</label>
                                        <input type='text' placeholder='Enter company name' 
                                        value={teachersData.teacherpreviouscompany}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherpreviouscompany:e.target.value
                                        }))}/>
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Previous Job role</label>
                                        <input type='text' placeholder='Enter Job Role' 
                                        value={teachersData.teacherpreviousjobrole}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherpreviousjobrole:e.target.value
                                        }))}/>
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Sub Job role</label>
                                        <input type='text' placeholder='Enter Sub Job Role' 
                                        value={teachersData.teacherprevioussubjobrole}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherprevioussubjobrole:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Work Experience <span>In Years</span></label>
                                        <input type='number' placeholder='Enter Work Experience' 
                                        value={teachersData.teacherworkexprienceyears}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherworkexprienceyears:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Key Responsibilities</label>
                                        <input type='text' placeholder='Enter your responsibilities' 
                                        value={teachersData.teacherpreviouskeyresponsibility}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            teacherpreviouskeyresponsibility:e.target.value
                                        }))} />
                                    </div>
                                </div>

                                <h3>Additional Contact</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Emergency Contact Name</label>
                                        <input type='text' placeholder='Contact Name'
                                        value={teachersData.emergencycontantname}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            emergencycontantname:e.target.value
                                        }))} 
                                         />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Relationship</label>
                                        <input type='text' placeholder='Enter relation' 
                                        value={teachersData.emergencycontactrelationship}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            emergencycontactrelationship:e.target.value
                                        }))}/>
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Emergency Contact Number</label>
                                        <input type='number' placeholder='Mobile Number' 
                                        value={teachersData.emergencycontactnumber}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            emergencycontactnumber:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Email</label>
                                        <input type='mail' placeholder='Enter email' 
                                        value={teachersData.emergencycontactemail}
                                        onChange={(e)=>setTeachersData(prev=>({
                                            ...prev,
                                            emergencycontactemail:e.target.value
                                        }))} />
                                    </div>
                                </div>

                                {/* <h3>Choose your Account Password </h3>
                                <div  className='createadmin_textarea'>
                                    <div className='createadmin_input-field'>
                                        <label>Password <span style={{color:'red'}}>*</span></label>
                                        <input type='password'  required />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Confirm Password <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Confirm Password' required />
                                    </div>
                                </div> */}

                                <button className="createadmin_sumbit" onClick={(e)=>handleCreateNewTeacher(e)}>
                                        <span className="createadmin_btnText">Submit</span>
                                </button>
                            </form>

                        </div>
                        {/* you code ends here */}
                    </div>
                </div>
            </div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    limit={1}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="light"
                    />
        </>
    );
}

export default Createteacher;