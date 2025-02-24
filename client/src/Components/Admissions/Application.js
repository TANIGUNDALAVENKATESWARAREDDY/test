import React, { useEffect, useState } from "react";
import {parseISO,differenceInYears} from 'date-fns'
import './Application.css';
import {API_URL} from '../../Data/Docs';
//material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ClearIcon from '@mui/icons-material/Clear';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
//toastify
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Admissions(){
    const navigate = useNavigate();
    const [currentyear,setcurrentyear] = useState('');
    const [applicationid,setapplicationid] = useState('application id not generating...');
    //storing the form data
    const [admissionformdata,setadmissionformdata] = useState({
        appstatus:'pending',
        admstatus:'pending',
        stdregid:'',
        parentregid:'',
        surname:'',
        gender:'',
        academicyear:'',
        class:'',
        studentname:'',
        dob:'',
        age:'',
        placeofbirth:'',
        nationality:'',
        nameofps:'',
        fathername:'',
        mothername:'',
        mobileno:'',
        altmobileno:'',
        emailid:'',
        city:'',
        state:'',
        pincode:'',
        admissionid:'',
        dateofsub:'',
        admamtpaidornot:''
    });
    //loading states
    const [showloading,setshowloading] = useState(false);
    const [showinfo,setshowinfo] = useState(false);

    // adding notifications 
    const loginsuccess = (msg) =>toast.success(`${msg}`);
    const loginerror = (msg) =>toast.error(`${msg}`);
    const loginformerror = () => toast.info('Please fill all required fields');



    //calculating the age here
    async function calculateage(value){
        try{
            const parsedDOB = parseISO(value);
            // Get the current date
            const currentDate = new Date();
            // Calculate the difference in years between the current date and the DOB
            const age = differenceInYears(currentDate, parsedDOB);
            setadmissionformdata(prev=>({
                ...prev,
                age:Number(age)
            }));
        }catch(e){
            console.log('you got an error calculating the age: ',e);
        }
    }
    //submitting the form data
    async function handlesubmitform(e){
        e.preventDefault();
        setshowloading(true);
        try{
            if(admissionformdata.academicyear!=='' && admissionformdata.city!=='' &&
                admissionformdata.class!=='' && admissionformdata.studentname!=='' &&
                admissionformdata.dob!=='' && admissionformdata.fathername!=='' &&
                admissionformdata.mothername!=='' && admissionformdata.mobileno!=='' &&
                admissionformdata.emailid!=='' && admissionformdata.surname!=='' && admissionformdata.gender!=='' &&
                admissionformdata.state!=='' &&
                admissionformdata.pincode!==''
            ){
            // console.log('here the data you submitted',admissionformdata);

            //this is the code for getting not for post
            // const response = await fetch(`${API_URL}/admissionform`);
            // const data = await response.json();
            // console.log('here is the response',data.message);

            //posting the data
            const postresponse = await fetch(`${API_URL}/admissionform`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(admissionformdata)
            });

            const data = await postresponse.json();
            if(data.success){
                setshowloading(false);
                loginsuccess(data.message);
                setapplicationid(data.applicationId);
                setshowinfo(true);
                setadmissionformdata(prev=>({
                    ...prev,
                    surname:'',
                    gender:'',
                    academicyear:'',
                    class:'',
                    studentname:'',
                    dob:'',
                    age:'',
                    placeofbirth:'',
                    nationality:'',
                    nameofps:'',
                    fathername:'',
                    mothername:'',
                    mobileno:'',
                    altmobileno:'',
                    emailid:'',
                    city:'',
                    state:'',
                    pincode:'',
                    admissionid:'',
                    dateofsub:'',
                    admamtpaidornot:''
                }));
            }else{
                loginerror(data.message);
            }
            // alert(data.message);
            }else{
                loginformerror();
            }
        }
        catch(error){
            console.log('you got an error while adding data',error);
        }
        setshowloading(false);
    }

    useEffect(()=>{
        const tempcurrentYear = new Date().getFullYear();
        setcurrentyear(tempcurrentYear);
    },[]);



    return(
        <>
            <div className="admission-con">
            
                <form className="admission-form">
                    <div className="application-click-application-status">
                            <p onClick={()=>navigate('/trackapplication')}>track your applications status</p>
                            <ChevronRightIcon sx={{cursor:"pointer"}} onClick={()=>navigate('/trackapplication')}/>
                    </div>
                    <div className="admission-form-header">
                        <h1>Application Form</h1>
                        <div></div>
                    </div>
                    <div className="admission-form-year-class">
                        <div>
                            <label>Academic Year<span>*</span></label>
                            <select value={admissionformdata.academicyear} onChange={(e)=>setadmissionformdata(prev=>({
                                ...prev,
                                academicyear:e.target.value
                            }))} required>
                                <option value='' disabled>Select Academic Year</option>
                                <option value={`${currentyear}-${Number(currentyear)+1}`}>{`${currentyear}-${Number(currentyear)+1}`}</option>
                            </select>
                        </div>
                        <div>
                            <label>Class/Standard<span>*</span></label>
                            <select value={admissionformdata.class} onChange={(e)=>setadmissionformdata(prev=>({
                                ...prev,
                                class:e.target.value
                            }))} required>
                                <option value='' disabled>Select Class</option>
                                <option value="nursery">Nursery</option>
                                <option value="LKG">LKG</option>
                                <option value="UKG">UKG</option>
                                <option value="1">Class 1</option>
                                <option value="2">Class 2</option>
                                <option value="3">Class 3</option>
                                <option value="4">Class 4</option>
                                <option value="5">Class 5</option>
                                <option value="6">Class 6</option>
                                <option value="7">Class 7</option>
                                <option value="8">Class 8</option>
                                <option value="9">Class 9</option>
                                <option value="10">Class 10</option>
                            </select>
                        </div>
                    </div>
                    <div className="admission-form-line"></div>
                    <div className="admission-form-personal-info-of-child">
                        <h1>Personal Information Of Child</h1>
                        <div className="admission-form-year-class">
                            <div>
                                <label>First Name<span>*</span></label>
                                <input type='text' value={admissionformdata.surname}
                                onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    surname:e.target.value
                                }))}
                                />
                            </div>
                            <div>
                                <label>Last Name<span>*</span></label>
                                <input type="text" value={admissionformdata.studentname} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    studentname:e.target.value
                                }))} required/>
                            </div>
                            

                        </div>
                        <div className="admission-form-year-class">
                            <div>
                                <label>Gender<span>*</span></label>
                                <select value={admissionformdata.gender} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    gender:e.target.value
                                }))}>
                                    <option value=''>Select Gender</option>
                                    <option value='female'>Female</option>
                                    <option value='male'>Male</option>
                                    <option value='other'>other</option>
                                </select>
                            </div>
                            <div>
                                <label>Date Of Birth<span>*</span></label>
                                <input type="date" value={admissionformdata.dob} onChange={(e)=>{
                                    setadmissionformdata(prev=>({
                                    ...prev,
                                    dob:e.target.value
                                    }));
                                    calculateage(e.target.value);
                                    }
                                } required/>
                            </div>
                        </div>
                        <div className="admission-form-three-column-div">
                            <div>
                                <label>Age<span>*</span></label>
                                <input type="number" value={admissionformdata.age} readOnly/>
                            </div>
                            <div>
                                <label>Place Of Birth</label>
                                <input type="text" value={admissionformdata.placeofbirth} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    placeofbirth:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>Nationality</label>
                                <input type="text" value={admissionformdata.nationality} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    nationality:e.target.value
                                }))}/>
                            </div>
                        </div>
                        <div className="admission-form-year-class">
                            <div>
                                <label>Name Of The Present Scholl, If Any</label>
                                <input type="text" value={admissionformdata.nameofps} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    nameofps:e.target.value
                                }))}/>
                            </div>
                        </div>
                    </div>
                    <div className="admission-form-line"></div>
                    <div className="admission-form-personal-info-of-child">
                        <h1>Contact Information</h1>
                        <div className="admission-form-year-class">
                            <div>
                                <label>Father Name<span>*</span></label>
                                <input type="text" value={admissionformdata.fathername} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    fathername:e.target.value
                                }))} required/>
                            </div>
                            <div>
                                <label>Mother Name<span>*</span></label>
                                <input type="text" value={admissionformdata.mothername} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    mothername:e.target.value
                                }))} required/>
                            </div>
                        </div>
                        <div className="admission-form-three-column-div">
                            <div>
                                <label>Mobile No.<span>*</span></label>
                                <input type="number" value={admissionformdata.mobileno} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    mobileno:e.target.value
                                }))} required/>
                            </div>
                            <div>
                                <label>Alternative Mobile No.</label>
                                <input type="number" value={admissionformdata.altmobileno} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    altmobileno:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>Email-Id<span>*</span></label>
                                <input type="email" value={admissionformdata.emailid} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    emailid:e.target.value
                                }))} required/>
                            </div>
                        </div>
                        <div className="admission-form-three-column-div">
                            <div>
                                <label>City<span>*</span></label>
                                <input type="text" value={admissionformdata.city} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    city:e.target.value
                                }))} required/>
                            </div>
                            <div>
                                <label>State<span>*</span></label>
                                <input type="text" value={admissionformdata.state} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    state:e.target.value
                                }))} required/>
                            </div>
                            <div>
                                <label>Pin Code<span>*</span></label>
                                <input type="number" value={admissionformdata.pincode} onChange={(e)=>setadmissionformdata(prev=>({
                                    ...prev,
                                    pincode:e.target.value
                                }))} required/>
                            </div>
                        </div>
                    </div>
                    <div className="admission-form-line"></div>
                    <button onClick={(e)=>handlesubmitform(e)}>Submit</button>
                    
                </form>
            </div>

            {/* adding the notifications */}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                limit={1}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="colored"
            />
            {/* backdrop for  notification */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showinfo}
            >
                <div className="application-info-box">
                    <div className="application-info-box-cross-btn">
                        <ClearIcon fontSize="medium" sx={{color:"white",cursor:"pointer"}} onClick={()=>setshowinfo(false)}/>
                    </div>
                    <div className="application-info-content">
                        <h1>"Please make a note of or take a screenshot of the application ID for future reference to track your application status."</h1>
                        <h2>application id</h2>
                        <h3>{applicationid}</h3>
                    </div>   
                </div>
            </Backdrop>
            
        </>
    );
}

export default Admissions;