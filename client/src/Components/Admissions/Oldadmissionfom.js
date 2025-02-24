import React ,{useEffect, useRef, useState} from "react";
import './Oldadmissionform.css';
import Sidenav from "../Sidenav/Sidenav";
import Topnav from "../Topnav/Topnav";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { API_URL, socket } from "../../Data/Docs";
import { useDispatch, useSelector } from "react-redux";
import { modifySingleFeelist, updateFeelistData } from "../../ReduxStates/Feelist";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout } from "../AllFunctions/Logout";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { storetownsdata } from "../../ReduxStates/Townsdata/Townsdata";

import Select from "react-select";

function Oldadmissionform(){
    const navigate = useNavigate();
    const classesFee  = useSelector((state)=>state.feelist.data);
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce=useRef(false);

    const [showloading, setShowloading] = useState(false);

    const[selectTransportTown,setSelectTransportTown] = useState({ //selecting the town
        label:'Select Town',
        value:''
    });

    

    //existing admission details
    const[studentData , setStudentData] = useState({

        //reg details
        stdautoregornot:false,//student registration auto enerate or not
        stdregid:'', //student registration id
        //student details
        stdfirstname:'',//student first name
        stdmiddlename:'',//student middle name
        stdlastname:'',//student last name
        stddob:'',//student date of birth
        stdgender:'',//student gender
        stdclass:'',//student class
        stdsectionid:'',//student section id
        stdjoingyear:'',//student joing year
        stdprevschool:'',// student previous school if any
        stdprevschtc:'',//previous school tc link

        stdparentorguard:'parents',// student have guardian or parent-> false represents parent 

        //parent details

        //father details
        stdfatherfirstname:'',//student father first name
        stdfathermiddlename:'',//student father middle name
        stdfatherlastname:'',//student father last name
        stdfatheroccupation:'',//student father occupation
        stdfatheremail:'',//student father email
        stdfatherphone:'',//student father mobile number

        //mother details
        stdmotherfirstname:'',//student mother first name
        stdmothermiddlename:'',//student mother middle name
        stdmotherlastname:'',//student mother last name
        stdmotheroccupation:'',//student mother occupation
        stdmotheremail:'',//student mother email
        stdmotherphone:'',//student mother phone


        //guardian details
        stdguardfirstname:'',//student guardian first name
        stdguardmiddlename:'',//student guardian middle name
        stdguardlastname:'',//student guardian  last name
        stdguardoccupation:'',//student guardian occupation name
        stdguardemail:'',//student guardian email
        stdguardphone:'',//student guardian mobile number


        //Address Details

        //temporary address
        stdtempaddhousenum:'',//student temporary address house number
        stdtempaddstreet:'',//student temporary address street
        stdtempaddcity:'',//student temporary address city
        stdtempadddistrict:'',//student temporary address district
        stdtempaddstate:'',//student temporary address state
        stdtempaddpincode:'',//student temporary address pincode
        stdtempaddcountry:'india',//student temporary address country

        stdtempandpermsame:false,// student permanent address and temporary address are same
        //permanent address
        stdpermaddhousenum:'',//student permanent address house number
        stdpermaddstreet:'',//student permanent address street
        stdpermaddcity:'',//student permanent address city
        stdpermadddistrict:'',//student permanent address district
        stdpermaddstate:'',//student permanent address state
        stdpermaddpincode:'',//student permanent address pincode
        stdpermaddcountry:'india',//student permanent address country

        //total fee
        stdtotalfee:0,//student total fee
        stdtotalpaid:0,//student total fee paid
        stdfeediscount:0,//student fee discount

        //transport fee
        stdtransportfeestatus:'undecided', // transport fee status
        stdtransporttotalfee:0, //transport total fee
        stdtransportfeepaid:0, //transport fee paid
        stdtransportfrom:'', // transport village name
        transportstartdate:'',//student transport start date

        //referred by some one
        stdrefsomeone:false,//is some one referred the student
        stdreferredid:'',//referred id
        applicationid:''

    });
    const [formErrors,setFormErrors] =useState({});
    //toast notifications
    const loginerror = (msg) =>toast.info(`${msg}`,{
        className:'login-info-notify',
        icon:false
    });

    const allTownsAndVillages = useSelector((state)=>state.townsdata.data);

    const invalidError =(msg)=>toast.error(`${msg}`,{
        className:'login-error-notify',
        icon:false
    });

    const successToasty =(msg)=>toast.success(`${msg}`,{
        icon:false,
        style:{backgroundColor:'green',color:'white'}
    });

    //function for town select
    const reactTownSelect =(option)=>{
        const tempTransportFee = allTownsAndVillages.find(item=>item.townid===option.value);
        
        if(tempTransportFee){//transport fee
            setStudentData(prev=>({
                ...prev,
                stdtransportfrom:option.value,
                stdtransporttotalfee:tempTransportFee.towntransportfee
            }));
        }

        setSelectTransportTown(prev=>({ //react select town data
            ...prev,
            ...option
        }));
        
    }

    //hanlding the temporary and permanent address
    function handleTemporaryPermanentAddress(){
        if(studentData.stdtempandpermsame===false){

            setStudentData(prev=>({
                ...prev,
                stdpermaddhousenum:studentData.stdtempaddhousenum,//student permanent address house number
                stdpermaddstreet:studentData.stdtempaddstreet,//student permanent address street
                stdpermaddcity:studentData.stdtempaddcity,//student permanent address city
                stdpermadddistrict:studentData.stdtempadddistrict,//student permanent address district
                stdpermaddstate:studentData.stdtempaddstate,//student permanent address state
                stdpermaddpincode:studentData.stdtempaddpincode,//student permanent address pincode
                stdpermaddcountry:studentData.stdtempaddcountry,//student permanent address country
                stdtempandpermsame:true
            }));
        }else{
            setStudentData(prev=>({
                ...prev,
                stdpermaddhousenum:'',//student permanent address house number
                stdpermaddstreet:'',//student permanent address street
                stdpermaddcity:'',//student permanent address city
                stdpermadddistrict:'',//student permanent address district
                stdpermaddstate:'',//student permanent address state
                stdpermaddpincode:'',//student permanent address pincode
                stdpermaddcountry:'',//student permanent address country
                stdtempandpermsame:false
            }));
        }
    }


    async function handleCreateStudent(e){
        setShowloading(true);
        
        e.preventDefault();
        try{
            if(
                (studentData.stdautoregornot===true || studentData.stdregid!=='') &&
                studentData.stdfirstname!=='' && 
                studentData.stdgender!=='' && studentData.stdclass!=='' && studentData.stdjoingyear!=='' &&
                ((studentData.stdparentorguard==='parents' && studentData.stdfatherfirstname!=='' && studentData.stdfatherphone!=='')
                ||(studentData.stdparentorguard==='guardian' && studentData.stdguardfirstname!=='' && studentData.stdguardphone!==''))

                && (studentData.stdtransportfeestatus!=='yes'|| (studentData.stdtransportfeestatus==='yes' && studentData.stdtransportfrom!=='' && studentData.transportstartdate!==''))
            ){
                //sending the data
                const postStudentResponse = await fetch(`${API_URL}/student/createstudent`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(studentData),
                    credentials:'include'
                });

                if(!postStudentResponse.ok){
                    if(postStudentResponse.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }
                    throw new Error(`HTTP error! status: ${postStudentResponse.status}`);
                }

                const data = await postStudentResponse.json();
                if(data.success){
                    // console.log('here is the success data: ',data);
                    successToasty('successfully completed');
                    setStudentData(prev=>({
                        ...prev,
                            stdautoregornot:false,//student registration auto enerate or not
                            stdregid:'', //student registration id
                            //student details
                            stdfirstname:'',//student first name
                            stdmiddlename:'',//student middle name
                            stdlastname:'',//student last name
                            stddob:'',//student date of birth
                            stdgender:'',//student gender
                            stdclass:'',//student class
                            stdsectionid:'',//student section id
                            stdjoingyear:'',//student joing year
                            stdprevschool:'',// student previous school if any
                            stdprevschtc:'',//previous school tc link
                    
                            stdparentorguard:'parents',// student have guardian or parent-> false represents parent 
                    
                            //parent details
                    
                            //father details
                            stdfatherfirstname:'',//student father first name
                            stdfathermiddlename:'',//student father middle name
                            stdfatherlastname:'',//student father last name
                            stdfatheroccupation:'',//student father occupation
                            stdfatheremail:'',//student father email
                            stdfatherphone:'',//student father mobile number
                    
                            //mother details
                            stdmotherfirstname:'',//student mother first name
                            stdmothermiddlename:'',//student mother middle name
                            stdmotherlastname:'',//student mother last name
                            stdmotheroccupation:'',//student mother occupation
                            stdmotheremail:'',//student mother email
                            stdmotherphone:'',//student mother phone
                    
                    
                            //guardian details
                            stdguardfirstname:'',//student guardian first name
                            stdguardmiddlename:'',//student guardian middle name
                            stdguardlastname:'',//student guardian  last name
                            stdguardoccupation:'',//student guardian occupation name
                            stdguardemail:'',//student guardian email
                            stdguardphone:'',//student guardian mobile number
                    
                    
                            //Address Details
                    
                            //temporary address
                            stdtempaddhousenum:'',//student temporary address house number
                            stdtempaddstreet:'',//student temporary address street
                            stdtempaddcity:'',//student temporary address city
                            stdtempadddistrict:'',//student temporary address district
                            stdtempaddstate:'',//student temporary address state
                            stdtempaddpincode:'',//student temporary address pincode
                            stdtempaddcountry:'india',//student temporary address country
                    
                            stdtempandpermsame:false,// student permanent address and temporary address are same
                            //permanent address
                            stdpermaddhousenum:'',//student permanent address house number
                            stdpermaddstreet:'',//student permanent address street
                            stdpermaddcity:'',//student permanent address city
                            stdpermadddistrict:'',//student permanent address district
                            stdpermaddstate:'',//student permanent address state
                            stdpermaddpincode:'',//student permanent address pincode
                            stdpermaddcountry:'india',//student permanent address country

                            //total fee
                            stdtotalfee:0,//student total fee
                            stdtotalpaid:0,//student total fee paid
                            stdfeediscount:0,//student fee discount

                            //transport fee
                            stdtransportfeestatus:'undecided', // transport fee status
                            stdtransporttotalfee:0, //transport total fee
                            stdtransportfeepaid:0, //transport fee paid
                            stdtransportfrom:'', // transport village name
                            transportstartdate:'',//student transport start date
                                        
                            //referred by some one
                            stdrefsomeone:false,//is some one referred the student
                            stdreferredid:'',//referred id
                            applicationid:''
                    }))
                }else{
                    invalidError(`${data.message}`);
                }
                setFormErrors({});
            }else{
                loginerror('please fill all the required fields');
                const tempFormErrors = {};
                if(studentData.stdregid==='') tempFormErrors.stdregid='please enter register id';
                if(studentData.stdfirstname==='') tempFormErrors.stdfirstname='enter first name';
                if(studentData.stdlastname==='') tempFormErrors.stdlastname='enter last name';
                if(studentData.stddob==='') tempFormErrors.stddob='DOB is required';
                if(studentData.stdgender==='') tempFormErrors.stdgender='gender required';
                if(studentData.stdclass==='') tempFormErrors.stdclass='select class';
                if(studentData.stdjoingyear==='') tempFormErrors.stdjoingyear='enter joining year';
                if(studentData.stdfatherfirstname==='') tempFormErrors.stdfatherfirstname='father first name required';
                if(studentData.stdfatherlastname==='') tempFormErrors.stdfatherlastname='enter father last name';
                if(studentData.stdfatherphone==='') tempFormErrors.stdfatherphone='phone number  required'
                if(studentData.stdmotherfirstname==='') tempFormErrors.stdmotherfirstname='mother first name required';
                
                if(studentData.stdmotherlastname==='') tempFormErrors.stdmotherlastname='mother last name required';
                if(studentData.stdmotherphone==='') tempFormErrors.stdmotherphone='enter mother mobile number';
                if(studentData.stdguardfirstname==='') tempFormErrors.stdguardfirstname='guardian first name required';
                
                if(studentData.stdguardlastname==='') tempFormErrors.stdguardlastname='last name required';
                if(studentData.stdguardphone==='') tempFormErrors.stdguardphone='phone number required';
                if(studentData.stdtempaddhousenum==='') tempFormErrors.stdtempaddhousenum='house number';

                if(studentData.stdtempaddstreet==='') tempFormErrors.stdtempaddstreet='required street';
                if(studentData.stdtempaddcity==='') tempFormErrors.stdtempaddcity='enter city';
                if(studentData.stdtempadddistrict==='') tempFormErrors.stdtempadddistrict='enter district';

                if(studentData.stdtempaddstate==='') tempFormErrors.stdtempaddstate='state required';
                if(studentData.stdtempaddpincode==='') tempFormErrors.stdtempaddpincode='pincode required';
                if(studentData.stdtempaddcountry==='') tempFormErrors.stdtempaddcountry='country required';
        
                if(studentData.stdpermaddhousenum==='') tempFormErrors.stdpermaddhousenum='house number';
                if(studentData.stdpermaddstreet==='') tempFormErrors.stdpermaddstreet='required street';
                if(studentData.stdpermaddcity==='') tempFormErrors.stdpermaddcity='required city';

                if(studentData.stdpermadddistrict==='') tempFormErrors.stdpermadddistrict='required district';
                if(studentData.stdpermaddstate==='') tempFormErrors.stdpermaddstate='required state';
                if(studentData.stdpermaddpincode==='') tempFormErrors.stdpermaddpincode='required pincode';
                if(studentData.stdpermaddcountry==='') tempFormErrors.stdpermaddcountry='required counrty';

                //transport fee details
                if(studentData.stdtransportfrom==='') tempFormErrors.stdtransportfrom='select student town';
                if(studentData.transportstartdate==='') tempFormErrors.transportstartdate='select transport start date';

                setFormErrors(tempFormErrors);
            }
        }catch(err){
            console.log('you got an error   while completing the admission and creating the student: ',err);
            invalidError('Gettting An Error While Creating the student or user registeration already exists');
        }
        setShowloading(false);
    }

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            if(classesFee.length===0){
                const handleUpdateFeelistListener=(data)=>{
                    dispatch(modifySingleFeelist(data.data));
                };
                if(!socket.hasListeners('modifiedclassfeelist')){
                    socket.on('modifiedclassfeelist',handleUpdateFeelistListener);
                }

                async function fetchallClassesFee(){
                    try{
                        const response = await fetch(`${API_URL}/feelist/getfeelist`,{
                            credentials:'include'
                        });
                        if (!response.ok) {
                            if(response.status === 401) {
                                alert('Your session is expired,please login again');
                                Logout(dispatch,navigate);
                                throw new Error('Unauthorized - Token expired');
                            }
                            throw new Error(`Http error! status: ${response.status}`);
                        }
                        const tempClassFeeData = await response.json();
                        if (tempClassFeeData.classfeedata.length > 0) {
                            dispatch(updateFeelistData(tempClassFeeData.classfeedata));
                            // console.log('here is the fetched data : ',tempClassFeeData.classfeedata);
                        }

                    }catch(err){
                        console.log('Error While Fetching Fees Data: ',err);
                    }
                }

                fetchallClassesFee();
            }

            if(allTownsAndVillages.length===0){
                async function handleGetAllVillages(){
                    try{
                        const villageres = await fetch(`${API_URL}/towns/getAllTowns`,{
                            credentials:'include'
                        });

                        if(!villageres.ok){
                            if(villageres.status === 401) {
                                alert('Your session is expired,please login again');
                                Logout(dispatch,navigate);
                                throw new Error('Unauthorized - Token expired');
                            }
                            throw new Error(`Http error! status: ${villageres.status}`);
                        }

                        const villageResData = await villageres.json();
                        if(villageResData.success){
                            dispatch(storetownsdata(villageResData.alltownsdata));
                        }
                    }catch(err){
                        console.log('getting an error while fetching villages',err);
                    }
                }
                handleGetAllVillages();
            }


            fetchCheckOnlyOnce.current=true;
        }

    },[classesFee.length,allTownsAndVillages.length,navigate,dispatch]);


    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-container'>
                            <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>
                            <div className='admissionform-heading'>
                                <h1>Existing Admission</h1>
                            </div>
                            
                            <form className='admissionform-mainform'>
                                <div className="admissionform-form">
                                        <div className="admissionform-detailspersonal">
                                            <span className="admissionform-title">Registration ID</span>
                                            {studentData.stdautoregornot===false && 
                                            <div className="admissionform-registration-field">
                                                <label>Registration Number <span style={{color:'red'}}>*</span></label>
                                                <input type="text" value={studentData.stdregid} onChange={(e)=>setStudentData(prev=>({
                                                    ...prev,
                                                    stdregid:e.target.value
                                                }))} placeholder="Enter your Reg.no" />
                                                {formErrors.stdregid && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdregid}</small>}
                                            </div>}




                                            <span className="admissionform-title">Student Details</span>

                                            <div className="admissionform-fields">
                                                {/* <div className="admissionform-input-field">
                                                    <label for="branch">Select Branch:</label>
                                                    <select name="branch">
                                                        <option value="Branch1">Branch 1</option>
                                                        <option value="Branch2">Branch 2</option>
                                                        <option value="Branch3">Branch 3</option>
                                                    </select>
                                                </div> */}
                                                
                                                {/* <div className="admissionform-input-field">
                                                    <label>Registration Number</label>
                                                    <input type="number" placeholder="Enter Registration Number" required/>
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Student Photo:</label>
                                                    <input  type="file" id="studentPhoto" name="studentPhoto"/>

                                                </div> */}
                                                <div className="admissionform-input-field">
                                                    <label>Student First Name <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your First Name"  value={studentData.stdfirstname} 
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdfirstname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdfirstname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdfirstname}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Student Middle Name</label>
                                                    <input type="text" placeholder="Enter your Middle Name" value={studentData.stdmiddlename}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdmiddlename:e.target.value
                                                    }))} />
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Student Last Name </label>
                                                    <input type="text" placeholder="Enter your Last Name" value={studentData.stdlastname}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdlastname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdlastname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdlastname}</small>}
                                                </div>

                                                <div className="admissionform-input-field">
                                                    <label>Date of Birth </label>
                                                    <input type="date" placeholder="Enter your Date of Birth" value={studentData.stddob}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stddob:e.target.value
                                                    }))}/>
                                                    {formErrors.stddob && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stddob}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Gender <span style={{color:'red'}}>*</span></label>
                                                    <select value={studentData.stdgender} onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdgender:e.target.value
                                                    }))}>
                                                        <option value='' disabled>Select gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                    {formErrors.stdgender && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdgender}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Admission to Class <span style={{color:'red'}}>*</span></label>
                                                    <select value={studentData.stdclass} 
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdclass:e.target.value,
                                                        stdtotalfee:classesFee.filter((item)=>item.class===e.target.value).length>0?classesFee.filter((item)=>item.class===e.target.value)[0].fee:0
                                                    }))}>
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
                                                    {formErrors.stdclass && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdclass}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Date of Joining <span style={{color:'red'}}>*</span></label>
                                                    <input type='date'  value={studentData.stdjoingyear} placeholder='Enter year'
                                                    onChange={(e) => {
                                                        const date = new Date(e.target.value);
                                                        const formattedDate = date.toISOString().split('T')[0]; // Ensures YYYY-MM-DD format
                                                        setStudentData(prev => ({
                                                            ...prev,
                                                            stdjoingyear: formattedDate
                                                        }));
                                                    }}/>
                                                    {formErrors.stdjoingyear && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdjoingyear}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Previous School Name</label>
                                                    <input type="text" placeholder="Enter school name" value={studentData.stdprevschool}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdprevschool:e.target.value
                                                    }))}/>
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Previous School TC</label>
                                                    <input type="file" id="studentPhoto" name="studentPhoto"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='admissionform-parent-or-guardian'>
                                            <div className='admissionform-parent-or-guardian-each' >
                                                <input type='radio' checked={studentData.stdparentorguard==='parents'}
                                                onChange={()=>setStudentData(prev=>({
                                                    ...prev,
                                                    stdparentorguard:'parents',
                                                    stdguardfirstname:'',
                                                    stdguardmiddlename:'',
                                                    stdguardlastname:'',
                                                    stdguardoccupation:'',
                                                    stdguardemail:'',
                                                    stdguardphone:'',
                                                }))}
                                                />
                                                <label>parents</label>
                                            </div>
                                            <div className='admissionform-parent-or-guardian-each' >
                                                <input type='radio' checked={studentData.stdparentorguard==='guardian'}
                                                onChange={()=>setStudentData(prev=>({
                                                    ...prev,
                                                    stdparentorguard:'guardian',
                                                    stdfatherfirstname:'',
                                                    stdfathermiddlename:'',
                                                    stdfatherlastname:'',
                                                    stdfatheroccupation:'',
                                                    stdfatheremail:'',
                                                    stdfatherphone:'',
                                                    stdmotherfirstname:'',
                                                    stdmothermiddlename:'',
                                                    stdmotherlastname:'',
                                                    stdmotheroccupation:'',
                                                    stdmotheremail:'',
                                                    stdmotherphone:'',
                                                }))}
                                                />
                                                <label>guardian</label>
                                            </div>
                                        </div>
                                        {studentData.stdparentorguard==='parents' && 
                                        <>
                                            <h2>Parents Details</h2>
                                            <div className="admissionform-detailsID">
                                                <span className="admissionform-title">Father Details</span>
                                                <div className="admissionform-fields">
                                                    <div className="admissionform-input-field">
                                                        <label>Father First Name <span style={{color:'red'}}>*</span></label>
                                                        <input type="text" placeholder="Enter your Father's First Name" value={studentData.stdfatherfirstname} onChange={(e)=>setStudentData(prev=>({
                                                            ...prev,
                                                            stdfatherfirstname:e.target.value
                                                        }))}/>
                                                        {formErrors.stdfatherfirstname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdfatherfirstname}</small>}
                                                    </div>
                                                    <div className="admissionform-input-field">
                                                        <label>Father Middle Name</label>
                                                        <input type="text" placeholder="Enter your Father's Middle Name" value={studentData.stdfathermiddlename} 
                                                        onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdfathermiddlename:e.target.value
                                                    }))}/>
                                                    </div>
                                                    <div className="admissionform-input-field">
                                                        <label>Father Last Name</label>
                                                        <input type="text" placeholder="Enter your Father's Last Name" value={studentData.stdfatherlastname}
                                                        onChange={(e)=>setStudentData(prev=>({
                                                            ...prev,
                                                            stdfatherlastname:e.target.value
                                                        }))}/>
                                                        {formErrors.stdfatherlastname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdfatherlastname}</small>}
                                                    </div>
                                
                                                    <div className="admissionform-input-field">
                                                        <label>Occupation:</label>
                                                        <input type="text" placeholder="Enter Occupation" value={studentData.stdfatheroccupation}
                                                        onChange={(e)=>setStudentData(prev=>({
                                                            ...prev,
                                                            stdfatheroccupation:e.target.value
                                                        }))}/>
                                                    </div>
                                                    <div className="admissionform-input-field">
                                                        <label>Email Address: </label>
                                                        <input type="email" placeholder="Enter Email" value={studentData.stdfatheremail} 
                                                        onChange={(e)=>setStudentData(prev=>({
                                                            ...prev,
                                                            stdfatheremail:e.target.value
                                                        }))}/>
                                                    </div>

                                                    <div className="admissionform-input-field">
                                                        <label>Mobile Number: <span style={{color:'red'}}>*</span></label>
                                                        <input type="tel" placeholder="Enter Mobile number" value={studentData.stdfatherphone}
                                                        onChange={(e)=>setStudentData(prev=>({
                                                            ...prev,
                                                            stdfatherphone:e.target.value
                                                        }))}/>
                                                        {formErrors.stdfatherphone && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdfatherphone}</small>}
                                                    </div>
                                                </div>
                                            </div>
                                        
                                        <div className="admissionform-detailsID">
                                            <span className="admissionform-title">Mother Details</span>
                                            <div className="admissionform-fields">
                                                <div className="admissionform-input-field">
                                                    <label>Mother First Name</label>
                                                    <input type="text" placeholder="Enter your Mother's First Name" value={studentData.stdmotherfirstname}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdmotherfirstname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdmotherfirstname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdmotherfirstname}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Mother Middle Name</label>
                                                    <input type="text" placeholder="Enter your Mother's Middle Name" value={studentData.stdmothermiddlename}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdmothermiddlename:e.target.value
                                                    }))}/>
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Mother Last Name</label>
                                                    <input type="text" placeholder="Enter your Mother's Last Name" value={studentData.stdmotherlastname}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdmotherlastname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdmotherlastname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdmotherlastname}</small>}
                                                </div>
                            
                                                <div className="admissionform-input-field">
                                                    <label>Occupation:</label>
                                                    <input type="text" placeholder="Enter Occupation" value={studentData.stdmotheroccupation}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdmotheroccupation:e.target.value
                                                    }))}/>
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Email Address:</label>
                                                    <input type="email" placeholder="Enter Email" value={studentData.stdmotheremail}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdmotheremail:e.target.value
                                                    }))}/>
                                                </div>

                                                <div className="admissionform-input-field">
                                                    <label>Mobile Number:</label>
                                                    <input type="tel" placeholder="Enter Mobile number" value={studentData.stdmotherphone}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdmotherphone:e.target.value
                                                    }))}/>
                                                    {formErrors.stdmotherphone && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdmotherphone}</small>}
                                                </div>
                                            </div>
                                        </div>
                                        </>}

                                        {studentData.stdparentorguard==='guardian' &&
                                        <div className="admissionform-detailsID">
                                            <span className="admissionform-title">Guardian Details</span>
                                            <div className="admissionform-fields">
                                                <div className="admissionform-input-field">
                                                    <label>Guardian First Name <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your Guardian's First Name" 
                                                    value={studentData.stdguardfirstname}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdguardfirstname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdguardfirstname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdguardfirstname}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Guardian Middle Name</label>
                                                    <input type="text" placeholder="Enter your Guardian's Middle Name" 
                                                    value={studentData.stdguardmiddlename}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdguardmiddlename:e.target.value
                                                    }))}/>
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Guardian Last Name</label>
                                                    <input type="text" placeholder="Enter your Guardian's Last Name" 
                                                    value={studentData.stdguardlastname}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdguardlastname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdguardlastname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdguardlastname}</small>}
                                                </div>
                            
                                                <div className="admissionform-input-field">
                                                    <label>Occupation:</label>
                                                    <input type="text" placeholder="Enter Occupation"
                                                    value={studentData.stdguardoccupation}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdguardoccupation:e.target.value
                                                    }))}/>
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Email Address:</label>
                                                    <input type="email" placeholder="Enter Email" 
                                                    value={studentData.stdguardemail}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdguardemail:e.target.value
                                                    }))}/>
                                                </div>

                                                <div className="admissionform-input-field">
                                                    <label>Mobile Number: <span style={{color:'red'}}>*</span></label>
                                                    <input type="tel" placeholder="Enter Mobile Number"
                                                    value={studentData.stdguardphone}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdguardphone:e.target.value
                                                    }))}/>
                                                    {formErrors.stdguardphone && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdguardphone}</small>}
                                                </div>
                                            </div>
                                        </div>}

                                        <h2>Address Details</h2>
                                        <div  className="admissionform-address">
                                            <span className="admissionform-title"> Temporary Address </span>
                                            <div className="admissionform-fields">
                                                <div className="admissionform-input-field">
                                                    <label>House No: </label>
                                                    <input type="text" placeholder="Enter your House No" 
                                                    value={studentData.stdtempaddhousenum}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddhousenum:e.target.value
                                                    }))}/>
                                                    {formErrors.stdtempaddhousenum && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddhousenum}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Street: </label>
                                                    <input type="text" placeholder="Enter your Street"
                                                    value={studentData.stdtempaddstreet}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddstreet:e.target.value
                                                    }))}/>
                                                    {formErrors.stdtempaddstreet && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddstreet}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>City: </label>
                                                    <input type="text" placeholder="Enter your City"
                                                    value={studentData.stdtempaddcity}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddcity:e.target.value
                                                    }))} 
                                                    />
                                                    {formErrors.stdtempaddcity && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddcity}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>District: </label>
                                                    <input type="text" placeholder="Enter your District"
                                                    value={studentData.stdtempadddistrict}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempadddistrict:e.target.value
                                                    }))}
                                                    />
                                                    {formErrors.stdtempadddistrict && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempadddistrict}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>State: </label>
                                                    <input type="text" placeholder="Enter your State" 

                                                    value={studentData.stdtempaddstate}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddstate:e.target.value
                                                    }))}
                                                    />
                                                    {formErrors.stdtempaddstate && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddstate}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Postal Code: </label>
                                                    <input type="text" placeholder="Enter your Postal Code"
                                                    value={studentData.stdtempaddpincode}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddpincode:e.target.value
                                                    }))} 
                                                    />
                                                    {formErrors.stdtempaddpincode && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddpincode}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Country: </label>
                                                    <input type="text" placeholder="Enter your Country"
                                                    value={studentData.stdtempaddcountry}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddcountry:e.target.value
                                                    }))}
                                                    />
                                                    {formErrors.stdtempaddcountry && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddcountry}</small>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admissionform-form-check-inline" >
                                            <input className="admissionform-form-check-input" type="checkbox" checked={studentData.stdtempandpermsame} onChange={()=>handleTemporaryPermanentAddress()} />
                                            <label className="form-check-label" style={{marginLeft:5}}>
                                                Use Temporary Address as Permanent Address
                                            </label>
                                        </div>
                                        <div id="permanent_address_fields" className="admissionform-address">
                                            <span className="admissionform-title">Permanent Address</span>
                                            <div className="admissionform-fields">
                                                <div className="admissionform-input-field">
                                                    <label>House No: </label>
                                                    <input type="text" placeholder="Enter your House No" 
                                                    value={studentData.stdpermaddhousenum}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddhousenum:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddhousenum && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddhousenum}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Street: </label>
                                                    <input type="text" placeholder="Enter your Street" 
                                                    value={studentData.stdpermaddstreet}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddstreet:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddstreet && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddstreet}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>City: </label>
                                                    <input type="text" placeholder="Enter your City" 
                                                    value={studentData.stdpermaddcity}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddcity:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddcity && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddcity}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>District: </label>
                                                    <input type="text" placeholder="Enter your District" 
                                                    value={studentData.stdpermadddistrict}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermadddistrict:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermadddistrict && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermadddistrict}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>State: </label>
                                                    <input type="text" placeholder="Enter your State" 
                                                    value={studentData.stdpermaddstate}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddstate:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddstate && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddstate}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Postal Code: </label>
                                                    <input type="text" placeholder="Enter your Postal Code" 
                                                    value={studentData.stdpermaddpincode}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddpincode:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddpincode && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddpincode}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Country: </label>
                                                    <input type="text" placeholder="Enter your Country" 
                                                    value={studentData.stdpermaddcountry}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddcountry:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddcountry && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddcountry}</small>}
                                                </div>
                                            </div>
                                        </div>

                                        <h2>Fee Details</h2>
                                        <div className='admissionform-fee-details'>
                                            <div className='admissionform-total-fee'>
                                                <label>student total fee</label>
                                                <input type='number' value={studentData.stdtotalfee} onChange={(e)=>setStudentData(prev=>({
                                                    ...prev,
                                                    stdtotalfee:e.target.value<0?0:e.target.value
                                                }))} min={0}/>
                                            </div>
                                            <div className='admissionform-total-fee'>
                                                <label>Student fee discount <span style={{color:'red'}}>(%)</span></label>
                                                <input type='number' value={studentData.stdfeediscount} onChange={(e)=>setStudentData(prev=>({
                                                    ...prev,
                                                    stdfeediscount:e.target.value>100?100:e.target.value<0?0:e.target.value
                                                }))} min={0} max={100}/>
                                            </div>
                                            <div className='admissionform-total-fee'>
                                                <label>fee after discount</label>
                                                <input type='number' value={studentData.stdtotalfee-((studentData.stdtotalfee*studentData.stdfeediscount)/100)} readOnly/>
                                            </div>
                                        </div>
                                        
                                        {/* transport fee details */}
                                        <div className="transport-fee-details-status">
                                            <input type='checkbox' checked={studentData.stdtransportfeestatus==='yes'} onChange={(e)=>{
                                                setStudentData(prev=>({
                                                    ...prev,
                                                    stdtransportfeestatus:studentData.stdtransportfeestatus==='yes'?'undecided':'yes',
                                                    stdtransporttotalfee:0,
                                                    stdtransportfrom:''
                                                }));
                                                setSelectTransportTown({
                                                    label:'Select Town',
                                                    value:''
                                                });
                                        }}/>
                                            <label>Do you require transport services?</label>
                                        </div>

                                        {
                                            studentData.stdtransportfeestatus==='yes' && 
                                            <div className="oldadmissionform-transportfee-con">
                                                <div className="oldadmissionform-transportfee-each">
                                                    <label>transport from <span style={{color:'red'}}>*</span></label>
                                                    <Select value={selectTransportTown} onChange={reactTownSelect}
                                                    options={
                                                        allTownsAndVillages.map((tempTown)=>({
                                                            value:tempTown.townid,
                                                            label:tempTown.townname
                                                        }))
                                                    }
                                                    components={{DropdownIndicator:null}}
                                                    placeholder='select Town/village'
                                                    menuPortalTarget={document.body}

                                                    styles={{
                                                        input:(provided)=>({
                                                            ...provided,
                                                            margin:0,
                                                            padding:0,
                                                            
                                                        }),
                                                        valueContainer:(provided)=>({
                                                            ...provided,
                                                            padding:0,
                                                            paddingLeft:5,
                                                            fontWeight:'500'
                                                        }),
                                                        option: (provided) => ({
                                                            ...provided,
                                                            height: '30px',   
                                                            fontSize:'0.85rem',
                                                            padding: '5px 10px',}),
                                                        control: (provided) => ({
                                                            ...provided,
                                                            outline: 'none',        
                                                            height: '30px', 
                                                            minHeight:0,
                                                            // padding: '5px 10px',
                                                            backgroundColor: '#f1f1f6', // Set background color to gray
                                                            border: 'none', // Optional: add a border
                                                            boxShadow: 'none',      // Remove any default shadow
                                                            padding: 0,  
                                                            fontSize:'0.85rem'
                                                          }),
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                    }}
                                                    />
                                                    {formErrors.stdtransportfrom && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtransportfrom}</small>}
                                                </div>

                                                <div className="oldadmissionform-transportfee-each">
                                                    <label>transport fee <span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={studentData.stdtransporttotalfee} onChange={(e)=>setStudentData((prev)=>({
                                                        ...prev,
                                                        stdtransporttotalfee:e.target.value
                                                    }))}/>
                                                </div>

                                                <div className="oldadmissionform-transportfee-each">
                                                    <label>transport Start date <span style={{color:'red'}}>*</span></label>
                                                    <input type='date' value={studentData.transportstartdate} onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        transportstartdate:e.target.value
                                                    }))}/>
                                                    {formErrors.transportstartdate && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.transportstartdate}</small>}
                                                </div>

                                            </div>
                                        }

                                        <div className="admissionform-form-check-inline" >
                                            <input className="admissionform-form-check-input" type="checkbox" checked={studentData.stdrefsomeone} 
                                            onChange={()=>setStudentData(prev=>({
                                                ...prev,
                                                stdrefsomeone:!studentData.stdrefsomeone
                                            }))} />
                                            <label className="form-check-label" style={{marginLeft:5}}>
                                                Is It Referred By Someone?
                                            </label>
                                        </div>


                                        {studentData.stdrefsomeone && 
                                        <div className='admissionform-referred-regid'>
                                            <input placeholder='Enter Referred ID' value={studentData.stdreferredid} 
                                            onChange={(e)=>setStudentData(prev=>({
                                                ...prev,
                                                stdreferredid:e.target.value
                                            }))}/>
                                        </div>}
                                        
                                </div>
                                <div className='admissionform-container-submit-btn'>
                                    <button onClick={(e)=>handleCreateStudent(e)}>create Existing admission</button>
                                </div>
                            </form>

                        </div>
                        {/* code ends here */}
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

export default Oldadmissionform;