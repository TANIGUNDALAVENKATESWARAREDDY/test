import React, { useState} from "react";
import './Createadmin.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../Data/Docs";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { Logout } from "../../AllFunctions/Logout";

function Createadmin(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showloading,setShowloading]= useState(false);
    const[formErrors , setFormErrors] = useState({});
    const [adminData, setAdminData] = useState({
        adminfirstname:'',
        adminmiddlename:'',
        adminlastname:'',
        adminregid:'',
        role:'admin',
        adminspecilizedsubject:'',
        adminDOJ:'',
        adminimgurl:'',
        adminemail:'',
        adminmobilenumber:'',
        adminDOB:'',
        admingender:'',
        adminmaritalstatus:'',
        admintemporaryaddress:'',
        adminpermanentaddress:'',
        adminhighqualification:'',
        adminifotherquoalification:'',
        adminYOG:'',
        admingraduationclg:'',
        adminpreviouscompany:'',
        adminpreviousjobrole:'',
        adminprevioussubjobrole:'',
        adminworkexprienceyears:0,
        adminpreviouskeyresponsibility:'',
        emergencycontantname:'',
        emergencycontactrelationship:'',
        emergencycontactnumber:'',
        emergencycontactemail:'',
    });

    //notifiactions
    const loginerror = (data='error msg') =>toast.info(`${data}`,{
        className:'login-info-notify',
        style:{background:'blue',color:'white',fontSize:'0.95rem'},
        icon:false
    });

    const invalidError =(msg)=>toast.error(`${msg}`,{
        className:'login-error-notify',
        icon:false
    });

    const successAlert =(msg)=>toast.success(`${msg}`,{
        className:'login-error-notify',
        style:{background:'green',color:'white',fontSize:'0.95rem'},
        icon:false
    });

    //just a preview data
    // const [image, setImage] = useState(null);
    // const [isCameraOpen, setIsCameraOpen] = useState(false);
    // const videoRef = useRef(null);
    // const canvasRef = useRef(null);

    // const openCamera = async () => {
    //     setIsCameraOpen(true);
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //     videoRef.current.srcObject = stream;
    //     videoRef.current.play();
    // };

    // const capturePhoto = () => {
    //     const canvas = canvasRef.current;
    //     const video = videoRef.current;
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;
    //     canvas.getContext("2d").drawImage(video, 0, 0);
    //     const imageData = canvas.toDataURL("image/png"); // Save as Data URL
    //     setImage(imageData); // Set the image for preview
    //     video.srcObject.getTracks().forEach(track => track.stop()); // Stop the video stream
    //     setIsCameraOpen(false);
    // };
    //preview ends here

    async function handleCreateAdmin(e){
        e.preventDefault();
        setShowloading(true);
        try{
            if(adminData.adminfirstname!=='' && adminData.adminlastname!=='' && adminData.adminregid!=='' &&
                adminData.adminspecilizedsubject!=='' && adminData.adminDOJ!=='' && adminData.adminmobilenumber!=='' && adminData.adminDOB!=='' &&
                adminData.admingender!=='' && adminData.adminpermanentaddress!=='' && adminData.adminhighqualification!==''
            ){
                setFormErrors({});
                //adding the abort constructor for abort the request
                const createAdminController = new AbortController();
                const createAdminTimeOut = setTimeout(()=>createAdminController.abort(),30000);

                const response = await fetch(`${API_URL}/admin/createadmin`,{
                    method:'POST',
                    credentials:'include',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(adminData),
                    signal:createAdminController.signal
                });

                clearTimeout(createAdminTimeOut);
                
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
                    setAdminData(prev=>({
                        ...prev,
                        adminfirstname:'',
                        adminmiddlename:'',
                        adminlastname:'',
                        adminregid:'',
                        role:'admin',
                        adminspecilizedsubject:'',
                        adminDOJ:'',
                        adminimgurl:'',
                        adminemail:'',
                        adminmobilenumber:'',
                        adminDOB:'',
                        admingender:'',
                        adminmaritalstatus:'',
                        admintemporaryaddress:'',
                        adminpermanentaddress:'',
                        adminhighqualification:'',
                        adminifotherquoalification:'',
                        adminYOG:'',
                        admingraduationclg:'',
                        adminpreviouscompany:'',
                        adminpreviousjobrole:'',
                        adminprevioussubjobrole:'',
                        adminworkexprienceyears:0,
                        adminpreviouskeyresponsibility:'',
                        emergencycontantname:'',
                        emergencycontactrelationship:'',
                        emergencycontactnumber:'',
                        emergencycontactemail:'',
                    }));
                    successAlert('successfully created the admin');
                }else{
                    
                    invalidError(resData.message);
                }
            }else{
                const tempErrors = {};
                if(adminData.adminfirstname==='') tempErrors.adminfirstname='first name is required';
                if(adminData.adminlastname==='') tempErrors.adminlastname='last name is required';
                if(adminData.adminregid==='') tempErrors.adminregid='please enter regid';
                if(adminData.adminspecilizedsubject==='') tempErrors.adminspecilizedsubject='enter specialized subject';
                if(adminData.adminDOJ==='') tempErrors.adminDOJ='enter date of joining';
                if(adminData.adminmobilenumber==='') tempErrors.adminmobilenumber='enter mobile number';
                if(adminData.adminDOB==='') tempErrors.adminDOB='enter date of birth';
                if(adminData.admingender==='') tempErrors.admingender='enter gender';
                if(adminData.adminpermanentaddress==='') tempErrors.adminpermanentaddress='enter permanent address ';
                if(adminData.adminhighqualification==='') tempErrors.adminhighqualification='enter high qualification';
                setFormErrors(tempErrors);
                loginerror('please fill all the required fileds');
            }
        }catch(err){
            console.log('getting error while creating the admin',err);
            alert('getting error while creating admin');
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
                            <p>Home - profiles - <span>Create Admin</span></p>
                        </div>

                        <div className='createadmin_con'>
                        <div className='admissionform-top-back-btn' style={{marginBottom:15}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon sx={{fontSize:22}}/>
                                <p>back</p>
                            </div>
                            <div className='createadmin_heading'>
                                <h1>Create Admin</h1>
                            </div>
                            <form  className='createadmin_form'>
                                <h3>Employee Data</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>First Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='First Name' value={adminData.adminfirstname}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminfirstname:e.target.value
                                        }))} />
                                        {formErrors.adminfirstname && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminfirstname}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Middle Name</label>
                                        <input type='text' placeholder='Middle Name' value={adminData.adminmiddlename}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminmiddlename:e.target.value
                                        }))}/>
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Last Name <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Last Name' value={adminData.adminlastname}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminlastname:e.target.value
                                        }))} />
                                        {formErrors.adminlastname && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminlastname}</small>}
                                    </div>
                                
                                    <div className='createadmin_input-field'>
                                        <label>Employee ID <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Employee ID' value={adminData.adminregid}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminregid:e.target.value
                                        }))} />
                                        {formErrors.adminregid && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminregid}</small>}
                                    </div>
                                    {/* <div className='createadmin_input-field'>
                                        <label>Department <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Enter subject name' required />
                                    </div> */}
                                    <div className='createadmin_input-field'>
                                        <label>Designation (Role) <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Designation' value={adminData.role} readOnly />
                                    </div>
                                    {/* <div className='createadmin_input-field'>
                                        <label>Sub Designation <span style={{color:'red'}}>*</span></label>
                                        <input type='text' placeholder='Designation' required />
                                    </div> */}
                                    <div className='createadmin_input-field'>
                                        <label>Specilized Subject <span style={{color:'red'}}>*</span></label>
                                        <select 
                                        value={adminData.adminspecilizedsubject}
                                        onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminspecilizedsubject:e.target.value
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
                                        {formErrors.adminspecilizedsubject && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminspecilizedsubject}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Date of Joining <span style={{color:'red'}}>*</span></label>
                                        <input type='date' placeholder='Date of Joining' value={adminData.adminDOJ}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminDOJ:e.target.value
                                        }))} />
                                        {formErrors.adminDOJ && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminDOJ}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Upload Photo <span style={{color:'red'}}>*</span></label>
                                        <input type='file' accept="image/*" capture='environment' placeholder='pass'  />
                                    </div>
                                </div>
                                <h3>Personal Information</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Email</label>
                                        <input type='mail' placeholder='Email' value={adminData.adminemail}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminemail:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Mobile Number <span style={{color:'red'}}>*</span></label>
                                        <input type='number' placeholder='Mobile Number' value={adminData.adminmobilenumber}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminmobilenumber:e.target.value
                                        }))} />
                                        {formErrors.adminmobilenumber && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminmobilenumber}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Date Of Birth <span style={{color:'red'}}>*</span></label>
                                        <input type='date' placeholder='Enter your DOB' value={adminData.adminDOB}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminDOB:e.target.value
                                        }))} />
                                        {formErrors.adminDOB && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminDOB}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Gender <span style={{color:'red'}}>*</span></label>
                                        <select value={adminData.admingender}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            admingender:e.target.value
                                        }))}>
                                            <option value='' disabled>Select gender</option>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                            <option value='other'>Others</option>
                                        </select>
                                        {formErrors.admingender && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.admingender}</small>}
                                    </div>
                                    <div className="createadmin_input-field">
                                        <label>Marital Status</label>
                                        <select  value={adminData.adminmaritalstatus}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminmaritalstatus:e.target.value
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
                                            <label>Temporary Address </label>
                                            <textarea type='text' placeholder='Enter your Temporary Address' 
                                            value={adminData.admintemporaryaddress}  onChange={(e)=>setAdminData(prev=>({
                                                ...prev,
                                                admintemporaryaddress:e.target.value
                                            }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                            <label>Permanent Address <span style={{color:'red'}}>*</span></label>
                                            <textarea type='text' placeholder='Enter your Permanent Address' 
                                            value={adminData.adminpermanentaddress}  onChange={(e)=>setAdminData(prev=>({
                                                ...prev,
                                                adminpermanentaddress:e.target.value
                                            }))} />
                                            {formErrors.adminpermanentaddress && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminpermanentaddress}</small>}
                                    </div>
                                </div>

                                <h3>Acadamic Details</h3>
                                <div className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Highest Qualification <span style={{color:'red'}}>*</span></label>
                                        <select
                                        value={adminData.adminhighqualification}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminhighqualification:e.target.value
                                        }))}>
                                            <option value=''>Select Qualification</option>
                                            <option value='phd'>PHD</option>
                                            <option value='pg'>PG</option>
                                            <option value='ug'>UG</option>
                                            <option value='other'>Other</option>
                                        </select>
                                        {formErrors.adminhighqualification && <small 
                                        style={{color:'red',
                                            fontSize:'0.55rem',fontStyle:'italic' , 
                                            textTransform:'capitalize',marginTop:-8}}>{formErrors.adminhighqualification}</small>}
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Year of Graduation</label>
                                        <input type='number' placeholder='Enter year' 
                                        value={adminData.adminYOG}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminYOG:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>College/University Name</label>
                                        <input type='text' placeholder='College/University Name' value={adminData.admingraduationclg}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            admingraduationclg:e.target.value
                                        }))} />
                                    </div>
                                </div>

                                <h3>Work Experience</h3>
                                <div className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Previous Employer</label>
                                        <input type='text' placeholder='Enter company name' value={adminData.adminpreviouscompany}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminpreviouscompany:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Previous Job role</label>
                                        <input type='text' placeholder='Enter Job Role' value={adminData.adminpreviousjobrole}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminpreviousjobrole:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Sub Job role</label>
                                        <input type='text' placeholder='Enter Sub Job Role' value={adminData.adminprevioussubjobrole}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminprevioussubjobrole:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Work Experience <span>In Years</span></label>
                                        <input type='number' placeholder='Enter Work Experience' value={adminData.adminworkexprienceyears}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminworkexprienceyears:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Key Responsibilities</label>
                                        <input type='text' placeholder='Enter your responsibilities' value={adminData.adminpreviouskeyresponsibility}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            adminpreviouskeyresponsibility:e.target.value
                                        }))} />
                                    </div>
                                </div>

                                <h3>Additional Contact</h3>
                                <div  className='createadmin_personalinfo'>
                                    <div className='createadmin_input-field'>
                                        <label>Emergency Contact Name</label>
                                        <input type='text' placeholder='Contact Name' value={adminData.emergencycontantname}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            emergencycontantname:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Relationship</label>
                                        <input type='text' placeholder='Enter relation' value={adminData.emergencycontactrelationship}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            emergencycontactrelationship:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Emergency Contact Number</label>
                                        <input type='number' placeholder='Mobile Number' value={adminData.emergencycontactnumber}  onChange={(e)=>setAdminData(prev=>({
                                            ...prev,
                                            emergencycontactnumber:e.target.value
                                        }))} />
                                    </div>
                                    <div className='createadmin_input-field'>
                                        <label>Email</label>
                                        <input type='mail' placeholder='Enter email' value={adminData.emergencycontactemail}  onChange={(e)=>setAdminData(prev=>({
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

                                <button className="createadmin_sumbit"  style={{cursor:'pointer'}} onClick={(e)=>handleCreateAdmin(e)}>
                                        <span className="createadmin_btnText">Submit</span>
                                </button>
                            </form>

                        </div>

                        {/* <div>
                            <h2>Camera Capture</h2>
                            {!isCameraOpen && (
                                <button onClick={openCamera}>Open Camera</button>
                            )}
                            
                            {isCameraOpen && (
                                <div>
                                <video ref={videoRef} style={{ width: "100%", maxWidth: "300px" }} />
                                <button onClick={capturePhoto}>Capture Photo</button>
                                </div>
                            )}

                            <canvas ref={canvasRef} style={{ display: "none" }} />

                            {image && (
                                <div>
                                <h3>Preview:</h3>
                                <img src={image} alt="Captured" style={{ width: "100%", maxWidth: "300px" }} />
                                </div>
                            )}
                            </div> */}



                        {/* your code ends here */}
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

export default Createadmin;