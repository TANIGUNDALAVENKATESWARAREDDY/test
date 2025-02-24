import React, { useEffect, useState ,useRef} from 'react';
import './Admissionform.css';
import Sidenav from '../Sidenav/Sidenav';
import Topnav from '../Topnav/Topnav';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdmissionFieldData, updateAllAdmissions, updateSingleAdmission } from '../../ReduxStates/Alladmissions';
import { socket ,API_URL} from '../../Data/Docs';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { modifySingleFeelist, updateFeelistData } from '../../ReduxStates/Feelist';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout } from '../AllFunctions/Logout';

function Admissionform() {
    const {id}=useParams();
    const navigate = useNavigate();
    const [userAppData , setUserAppData] = useState({
        loading:true,
        username:'',
        admstatus:'',
        surname:'',
        gender:'',
        studentname:'',
        class:'',
        dob:'',
        academicyear:''
    }); 
    const allAdmissionsData = useSelector((state)=>state.alladmissions.data);
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce = useRef(false);
    const[showloading,setShowloading] = useState(false);

    //class fee
    const classesFee = useSelector((state)=>state.feelist.data);
    const fetchInitiated = useRef(false);
    //new student details state
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
        stdsectionid:'',
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


        //referred by some one
        stdrefsomeone:false,//is some one referred the student
        stdreferredid:'',//referred id
        applicationid:''

    });
    const [formErrors,setFormErrors] =useState({});


    // binary search to find the the index;
    function handleBinarySearchIdex(arr1 ,targetId){
        let left=0;
        const arr = [...arr1].sort((a,b)=>b.admissionid-a.admissionid);
        let right=arr.length-1;
        while(left<=right){
            const mid = Math.floor((left+right)/2);
            if(arr[mid].admissionid===targetId){
                return {
                    loading:false,
                    username:arr[mid].studentname,
                    admstatus:arr[mid].admstatus,
                    surname:arr[mid].surname,
                    gender:arr[mid].gender,
                    studentname:arr[mid].studentname,
                    class:arr[mid].class,
                    dob:arr[mid].dob,
                    academicyear:arr[mid].academicyear
                }
                 
            }else if(arr[mid].admissionid<targetId){
                right=mid-1;
            }else{
                left=mid+1;
            }
        }
        
        return {
            loading:false,
            username:'',
            admstatus:'',
            surname:'',
            gender:'',
            studentname:'',
            class:'',
            dob:'',
            // gender:'',
            academicyear:''
        };
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

    //handling the function to complete the admission and create the student
    async function handleCreateStudent(e){
        e.preventDefault();
        setShowloading(true);
        try{
            if(
                (studentData.stdautoregornot===true || studentData.stdregid!=='') &&
                studentData.stdfirstname!=='' && studentData.stdlastname!=='' && studentData.stddob!=='' &&
                studentData.stdgender!=='' && studentData.stdclass!=='' && studentData.stdjoingyear!=='' &&
                ((studentData.stdparentorguard==='parents' && studentData.stdfatherfirstname!=='' && studentData.stdfatherlastname!=='' && studentData.stdfatherphone!=='' && 
                    studentData.stdmotherfirstname!=='' && studentData.stdmotherlastname!=='' && studentData.stdmotherphone!=='')
                ||(studentData.stdparentorguard==='guardian' && studentData.stdguardfirstname!=='' && studentData.stdguardlastname!=='' && studentData.stdguardphone!=='')) &&
                studentData.stdtempaddhousenum!=='' && studentData.stdtempaddstreet!=='' && studentData.stdtempaddcity!=='' && studentData.stdtempadddistrict!=='' && studentData.stdtempaddstate!=='' && studentData.stdtempaddpincode!=='' && studentData.stdtempaddcountry!=='' &&
                studentData.stdpermaddhousenum!=='' && studentData.stdpermaddstreet!=='' && studentData.stdpermaddcity!=='' && studentData.stdpermadddistrict!=='' && studentData.stdpermaddstate!=='' && studentData.stdpermaddpincode!=='' && studentData.stdpermaddcountry!==''
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
                    console.log('here is the success data: ',data);
                    alert('successfully completed');
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
                    
                            //referred by some one
                            stdrefsomeone:false,//is some one referred the student
                            stdreferredid:'',//referred id
                            applicationid:''
                    }))
                     navigate(-1);
                }else{
                    alert('getting error while creating the student');
                }
                setFormErrors({});
            }else{
                alert('please fill all the required fields');
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

                setFormErrors(tempFormErrors);
            }
        }catch(err){
            console.log('you got an error   while completing the admission and creating the student: ',err);
        }
        setShowloading(false);
    }


    useEffect(() => {
       
        // console.log('fetched twice');
        if (!fetchInitiated.current) {

            if(classesFee.length===0){
                const handleUpdateFeelistListener = (data)=>{
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
            
            if (allAdmissionsData.length === 0) {
                const handleAdmissionSingleData = (data) => {
                    dispatch(updateSingleAdmission(data.data));
                };
                if (!socket.hasListeners('applicationToAdmission')) {
                    socket.on('applicationToAdmission', handleAdmissionSingleData);
                }
    
                //listen the updated admission
                const handleUpdateAdmissionData = (data) =>{
                    dispatch(updateAdmissionFieldData(data.data))
                };
                if(!socket.hasListeners('updatingAdmissionData')){
                    socket.on('updatingAdmissionData',handleUpdateAdmissionData);
                }
                async function fetchAllAdmissions() {
                    try {
                        const response = await fetch(`${API_URL}/admissionform/admissionsdata`,{
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
                        const tempAdmissionsData = await response.json();
                        if (tempAdmissionsData.data.length > 0) {
                            await dispatch(updateAllAdmissions(tempAdmissionsData.data));
                        }
                    } catch (err) {
                        console.log('Error while fetching admissions data: ', err);
                    }
                }
                fetchAllAdmissions();
            }
    
            fetchInitiated.current = true;
        }
    
    }, [allAdmissionsData.length,navigate, dispatch,classesFee.length]);
    
    useEffect(() => {
        // console.log('fetched once')
        if ( fetchCheckOnlyOnce.current === false && allAdmissionsData.length > 0) {
            
            // console.log('second fetching', fetchCheckOnlyOnce.current);
            let tempx = handleBinarySearchIdex(allAdmissionsData, Number(id));
            // console.log('tempx: ', tempx);
            setUserAppData(prev => ({
                ...prev,
                ...tempx
            }));

            let date = new Date();
            let academicyear = new Date();
            academicyear = academicyear.getFullYear();
            if(tempx.dob!==''){
                date = new Date(tempx.dob);
            }
            setStudentData(prev=>({
                ...prev,
                stdfirstname:tempx.studentname,//student first name
                stdlastname:tempx.surname,//student last name
                stddob:date.toISOString().split('T')[0],//student date of birth
                stdgender:tempx.gender,//student gender
                stdclass:tempx.class,//student class
                applicationid:id,
                stdjoingyear:Number(academicyear)
            }));
            if(classesFee.length>0){
                setStudentData(prev=>({
                    ...prev,
                    stdtotalfee:classesFee.filter((item)=>item.class===tempx.class).length>0?classesFee.filter((item)=>item.class===tempx.class)[0].fee:0
                }));
            }
            fetchCheckOnlyOnce.current = true;
        }
    }, [allAdmissionsData, id,classesFee]);

    
    return (
        <>
            <div className='staffdashboard-con'>
                <Sidenav />
                <div className='staffdashboard-inner'>
                    <Topnav />
                    { userAppData.loading===true ?<div>loading</div>: userAppData.admstatus==='pending'?
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-container'>
                            <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>
                            <div className='admissionform-heading'>
                                <h1>New Admission Form</h1>
                                <h3>[{userAppData.username} - {id}]</h3>
                            </div>
                            
                            <form className='admissionform-mainform'>
                                <div className="admissionform-form">
                                        <div className="admissionform-detailspersonal">
                                            <span className="admissionform-title">Registration ID</span>

                                            <div className='admissionform-registration-div'>
                                                <p style={{textTransform:'capitalize'}}>Do you want to use auto generating registration ID?</p>
                                                <div>
                                                    <div className='admissionform-registration-auto-gen' onClick={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdautoregornot:true
                                                    }))}>
                                                        <input type='radio' checked={studentData.stdautoregornot===true} readOnly/>
                                                        <label>Yes</label>
                                                    </div>
                                                    <div className='admissionform-registration-auto-gen' onClick={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdautoregornot:false
                                                    }))}>
                                                        <input type='radio' checked={studentData.stdautoregornot===false} readOnly/>
                                                        <label>No</label>
                                                    </div>
                                                </div>
                                            </div>
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
                                                    <label>Student Last Name <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your Last Name" value={studentData.stdlastname}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdlastname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdlastname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdlastname}</small>}
                                                </div>

                                                <div className="admissionform-input-field">
                                                    <label>Date of Birth <span style={{color:'red'}}>*</span></label>
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
                                                    <label>Joining Acadamic year <span style={{color:'red'}}>*</span></label>
                                                    <input type='number'  value={studentData.stdjoingyear} placeholder='Enter year'
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdjoingyear:e.target.value
                                                    }))}/>
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
                                                        <label>Father Last Name <span style={{color:'red'}}>*</span></label>
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
                                                    <label>Mother First Name <span style={{color:'red'}}>*</span></label>
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
                                                    <label>Mother Last Name <span style={{color:'red'}}>*</span></label>
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
                                                    <label>Mobile Number: <span style={{color:'red'}}>*</span></label>
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
                                                    <label>Guardian Last Name <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your Guardian's Last Name" 
                                                    value={studentData.stdguardlastname}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdguardlastname:e.target.value
                                                    }))}/>
                                                    {formErrors.stdguardlastname && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdguardlastname}</small>}
                                                </div>
                            
                                                <div className="admissionform-input-field">
                                                    <label>Occupation: <span style={{color:'red'}}>*</span></label>
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
                                                    <label>House No: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your House No" 
                                                    value={studentData.stdtempaddhousenum}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddhousenum:e.target.value
                                                    }))}/>
                                                     {formErrors.stdtempaddhousenum && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddhousenum}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Street: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your Street"
                                                    value={studentData.stdtempaddstreet}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdtempaddstreet:e.target.value
                                                    }))}/>
                                                    {formErrors.stdtempaddstreet && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdtempaddstreet}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>City: <span style={{color:'red'}}>*</span></label>
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
                                                    <label>District: <span style={{color:'red'}}>*</span></label>
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
                                                    <label>State: <span style={{color:'red'}}>*</span></label>
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
                                                    <label>Postal Code: <span style={{color:'red'}}>*</span></label>
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
                                                    <label>Country: <span style={{color:'red'}}>*</span></label>
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
                                                    <label>House No: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your House No" 
                                                    value={studentData.stdpermaddhousenum}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddhousenum:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddhousenum && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddhousenum}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Street: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your Street" 
                                                    value={studentData.stdpermaddstreet}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddstreet:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddstreet && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddstreet}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>City: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your City" 
                                                    value={studentData.stdpermaddcity}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddcity:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddcity && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddcity}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>District: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your District" 
                                                    value={studentData.stdpermadddistrict}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermadddistrict:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermadddistrict && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermadddistrict}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>State: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your State" 
                                                    value={studentData.stdpermaddstate}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddstate:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddstate && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddstate}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Postal Code: <span style={{color:'red'}}>*</span></label>
                                                    <input type="text" placeholder="Enter your Postal Code" 
                                                    value={studentData.stdpermaddpincode}
                                                    onChange={(e)=>setStudentData(prev=>({
                                                        ...prev,
                                                        stdpermaddpincode:e.target.value
                                                    }))}/>
                                                    {formErrors.stdpermaddpincode && <small style={{color:'red',fontSize:10,textTransform:'capitalize'}}>{formErrors.stdpermaddpincode}</small>}
                                                </div>
                                                <div className="admissionform-input-field">
                                                    <label>Country: <span style={{color:'red'}}>*</span></label>
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
                                    <button onClick={(e)=>handleCreateStudent(e)}>create admission</button>
                                </div>
                            </form>

                        </div>

                        {/* your code ends here */ }
                        
                    </div >
                    :userAppData.admstatus==='rejected'?
                    <div><h1>admission rejected</h1></div>:
                    <div>
                        <h1>already completed</h1>
                    </div>}
                </div >
            </div >

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Admissionform;