import React, { useEffect, useRef, useState } from 'react';
import './PayTransportFee.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import { API_URL, socket } from '../../../Data/Docs';
import { Logout } from '../../AllFunctions/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { addedNewSection, sectionModified, updateSections } from '../../../ReduxStates/Sections';
import Select from "react-select";
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Transportfeereceiptpdf from '../../Pdfs/Transportfeereceiptpdf';
import { storetownsdata } from '../../../ReduxStates/Townsdata/Townsdata';

function PayTransportFee(){
    const navigate = useNavigate();
    const [regidOrStudentname , setRegidOrStudentname] = useState('regid');//other value is 'studentname'
    const [modeData,setModeData] = useState([]);//here we have to store the array of objects
    const [showloading ,setshowloading] = useState(false);
    const [studentRegid , setStudentRegid] = useState('');
    const [studentRegidError ,setStudentRegidError] = useState('');
    const [classStudents,setClassStudents] = useState([]);
    const [selectStudent,setSelectStudent] = useState({
        label:'Select Student',
        value:''
    });
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce = useRef(false);
    const role = useSelector((state)=>state.userdata.role);
    const regid = useSelector((state)=>state.userdata.regid);
    const classSections = useSelector((state)=>state.sections.data);
    const allTownsAndVillages = useSelector((state)=>state.townsdata.data);
    const [storeTransportfeeReceipt , setStoreTransportfeeReceipt] = useState({});
    const[showFeeReceipt,setShowFeeReceipt] = useState(false);//shwoing the preview of the fee receipt
    const[showSuccesspayment,setShowSuccessPayment] = useState(false); //payment success card
    const[showErrorpayment , setShowErrorPayment] = useState(false); //payment Error form state
    const[transportFeeData , setTransportFeeData] = useState({
        stdclass:'', //student class
        stdsectionid:'', //student section
        stdname:'', //student name
        stdregid:'' , //student regid
        stdamountpaidnow:0 ,//student amount paid now
        transportfeecomments:'', // transport fee comments
        transportfeecollectedstaffid:regid?regid:'',
        paidby:'',
        staffrole:role?role:'',
        receiptnumber:'',
        totaltransportfee:0,
        totalpaid:0,
        transportnextfeedate:'',
        stdtransportfrom:'',
        stdtransportfeestatus:'',
        stdgender:'',// student gender
        stdmobile:0,//father or guardian mobile number
    });

    //toast notifications
    const loginerror = (msg) =>toast.info(`${msg}`,{
        className:'login-info-notify',
        icon:false
    });

    const invalidError =(msg)=>toast.error(`${msg}`,{
        className:'login-error-notify',
        icon:false
    });

    //popup box function
    function handleCloseSuccessfeepaymentpopup(){
        setShowSuccessPayment(false);
    }

    function handleCloseErrorFeePaymentPopup(){
        setShowErrorPayment(false);
    }

    //function to open the fee receipt preview
    function handleopenreceiptpreview(e){
        e.preventDefault();
        setshowloading(true);
        try{
            setShowFeeReceipt(true);
            setTimeout(() => {
                setshowloading(false);
            }, 1800);
        }catch(err){
            alert('you got error wwhile dwonloading...',err);
        }
    }


    //functions for  mode data
    function handleAddModeData(e){//adding the mode data
        e.preventDefault();
        const tempuid=uuidv4();
        setModeData(prev=>(
            [...prev,
                {
                    modeuid:tempuid,
                    modetype:'',
                    modeamount:0
                }
            ]
        ));
    }

    function handleDeleteModeData(tempmodeuid){
        const temparr = modeData.filter(item=>item.modeuid!==tempmodeuid);
        setModeData(temparr);
    }

    function handleUpdateEachModeData(e,idx,field){
        e.preventDefault();
        const {value}=e.target;
        setModeData(prev=>{
            const updatedItem = {
                ...prev[idx],[field]:value
            };
            return [...prev.slice(0,idx),updatedItem,...prev.slice(idx+1)];
        });
    }


    //function to find the student
    async function handleFindStudent(e){
       
            e.preventDefault();
        
        
        setshowloading(true);
        try{
            if(studentRegid!==''){
                const findStudentAbort = new AbortController();
                const findStudentAbortTimeout = setTimeout(()=>findStudentAbort.abort(),10000);
                const studentres = await fetch(`${API_URL}/transportHistory/findStudentTransport`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        studentid:studentRegid
                    }),
                    credentials:'include',
                    signal:findStudentAbort.signal
                });
                clearTimeout(findStudentAbortTimeout);

                if(!studentres.ok){
                    if(studentres.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }
                    throw new Error(`HTTP error! status: ${studentres.status}`);
                }

                const resData = await studentres.json();
                if(resData.success){
                    setTransportFeeData(prev=>({
                        ...prev,
                        stdclass:resData.studentdata.stdclass, //student class
                        stdsectionid:resData.studentdata.stdsectionid, //student section
                        stdname:`${resData.studentdata.stdfirstname} ${resData.studentdata.stdmiddlename} ${resData.studentdata.stdlastname}`, //student name
                        stdregid:resData.studentdata.stdregid , //student regid
                        stdamountpaidnow:0 ,//student amount paid now
                        transportfeecomments:'', // transport fee comments
                        transportfeecollectedstaffid:regid?regid:'',
                        paidby:'',
                        staffrole:role?role:'',
                        receiptnumber:'',
                        totaltransportfee:resData.studentdata.stdtransporttotalfee,
                        totalpaid:resData.studentdata.stdtransportfeepaid,
                        transportnextfeedate:'',
                        stdtransportfeestatus:resData.studentdata.stdtransportfeestatus,
                        stdtransportfrom:resData.studentdata.stdtransportfrom,// transport from
                        stdgender:resData.studentdata.stdgender,// student gender
                        stdmobile:resData.studentdata.stdparentorguard==='parents'?resData.studentdata.stdfatherphone:resData.studentdata.stdguardphone,//father or guardian mobile number
                    }));
                    setStudentRegidError('');
                }else{
                    // alert(`${resData.message}`);
                    setStudentRegidError(`${resData.message}`);
                    setTransportFeeData(prev=>({
                        ...prev,
                        stdclass:'', //student class
                        stdsectionid:'', //student section
                        stdname:'', //student name
                        stdregid:'' , //student regid
                        stdamountpaidnow:0 ,//student amount paid now
                        transportfeecomments:'', // transport fee comments
                        transportfeecollectedstaffid:regid?regid:'',
                        paidby:'',
                        staffrole:role?role:'',
                        receiptnumber:'',
                        totaltransportfee:0,
                        totalpaid:0,
                        transportnextfeedate:'',
                        stdtransportfeestatus:'',
                        stdtransportfrom:'',// transport from
                        stdgender:'',// student gender
                        stdmobile:0,//father or guardian mobile number
                    }));
                }
            }else{
                setStudentRegidError('please enter regID');
            }
        }catch(err){

        }
        setshowloading(false);
    }

    //second function to fetch the student fee data
    async function studentNameFetchStudentData(){
        setshowloading(true);
        try{
            const secFindStudentAbort  = new AbortController();
            const secFindStudentAbortTimeout = setTimeout(()=>secFindStudentAbort.abort(),10000);
            const secStudentRes = await fetch(`${API_URL}/transportHistory/findStudentTransport`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    studentid:studentRegid
                }),
                credentials:'include',
                signal:secFindStudentAbort.signal
            });
            clearTimeout(secFindStudentAbortTimeout);
            if(!secStudentRes.ok){
                if(secStudentRes.status === 401) {
                    alert('Your session is expired,please login again');
                    Logout(dispatch,navigate);
                    throw new Error('Unauthorized - Token expired');
                }
                throw new Error(`HTTP error! status: ${secStudentRes.status}`);
            }
            const resData = await secStudentRes.json();
            if(resData.success){
                setTransportFeeData(prev=>({
                    ...prev,
                    stdclass:resData.studentdata.stdclass, //student class
                    stdsectionid:resData.studentdata.stdsectionid, //student section
                    stdname:`${resData.studentdata.stdfirstname} ${resData.studentdata.stdmiddlename} ${resData.studentdata.stdlastname}`, //student name
                    stdregid:resData.studentdata.stdregid , //student regid
                    stdamountpaidnow:0 ,//student amount paid now
                    transportfeecomments:'', // transport fee comments
                    transportfeecollectedstaffid:regid?regid:'',
                    paidby:'',
                    staffrole:role?role:'',
                    receiptnumber:'',
                    totaltransportfee:resData.studentdata.stdtransporttotalfee,
                    totalpaid:resData.studentdata.stdtransportfeepaid,
                    transportnextfeedate:'',
                    stdtransportfeestatus:resData.studentdata.stdtransportfeestatus,
                    stdtransportfrom:resData.studentdata.stdtransportfrom,// transport from
                    stdgender:resData.studentdata.stdgender,// student gender
                    stdmobile:resData.studentdata.stdparentorguard==='parents'?resData.studentdata.stdfatherphone:resData.studentdata.stdguardphone,//father or guardian mobile number
                }));
            }else{
                alert(`${resData.message}`);
            }

        }catch(err){
            console.log('getting an error while fetching the student transport data ',err);
        }
        setshowloading(false);
    }


    //function to fetch class students
    async function handleFetchClassStudents(e){
        setshowloading(true);
        try{
            const classStudentsAbortController = new AbortController();
            const classStudentsTimeOut = setTimeout(()=>classStudentsAbortController.abort(),10000)
            const classStudentsRes= await fetch(`${API_URL}/transportHistory/fetchTransportClassStudents`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    class:transportFeeData.stdclass,
                    section:e.target.value
                }),
                credentials:'include',
                signal:classStudentsAbortController.signal
            });
            clearTimeout(classStudentsTimeOut);
            const resData = await classStudentsRes.json();
            if(resData.success){
                setClassStudents(resData.students);
            }else{
                setClassStudents([]);
            }
        }catch(err){

        }
        setshowloading(false);
    }

    //response from react select function
    const reactStudentSelect = (option) =>{
        setTransportFeeData(prev=>({
            ...prev,
            stdname:option.label,
            stdregid:option.value
        }));
        setSelectStudent(prev=>({
            ...prev,
            ...option
        }));
        // handleFindStudent();
        studentNameFetchStudentData();
    }

    //get section name
    function getSectionName(sectionid){
        const sectiondata = classSections.find((item)=>item._id===sectionid);
        if(sectiondata){
            return sectiondata.sectionname;
        }
        return '';
    }

    //reset the data when we modifying from student name to registration id
    function ResetTheAddedData(){
        setTransportFeeData(prev=>({
            ...prev,
            stdclass:'', //student class
            stdsectionid:'', //student section
            stdname:'', //student name
            stdregid:'' , //student regid
            stdamountpaidnow:0 ,//student amount paid now
            transportfeecomments:'', // transport fee comments
            transportfeecollectedstaffid:'',
            paidby:'',
            staffrole:'',
            receiptnumber:'',
            totaltransportfee:0,
            totalpaid:0,
            transportnextfeedate:'',
            stdtransportfrom:'',
            stdtransportfeestatus:''
        }));

        setSelectStudent(prev=>({
            ...prev,
            label:'Select Student',
            value:''
        }));

        setStudentRegidError('');
    }

    //function to pay the transport fee
    async function handlePayTransportFee(e){
        e.preventDefault();
        setshowloading(true);
        try{
            const totalAmount = modeData.reduce((sum,item)=>sum+Number(item.modeamount),0);
            if(transportFeeData.stdregid!=='' && transportFeeData.stdamountpaidnow>0 && transportFeeData.paidby!=='' && modeData.length>0 && Number(transportFeeData.stdamountpaidnow)===Number(totalAmount)){
                const paymentAbortController = new AbortController();
                const abortTimeOut = setTimeout(() => {
                    paymentAbortController.abort();
                }, 10000);
                const paymentres = await fetch(`${API_URL}/transportHistory/PayStudentTransportFee`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        ...transportFeeData,
                        modedata:modeData
                    }),
                    credentials:'include',
                    signal:paymentAbortController.signal
                });
                clearTimeout(abortTimeOut);
                if(!paymentres.ok){
                    if(paymentres.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }
                    throw new Error(`Httkp error! status: ${paymentres.status}`);
                }
                const resData = await paymentres.json();
                if(resData.success){
                    setStoreTransportfeeReceipt(prev=>({
                        ...prev,
                        ...resData.stdTransRes
                    }));
                    // console.log(storeTransportfeeReceipt);//remove this one once we generate the pdf
                    setShowSuccessPayment(true);
                    setTransportFeeData(prev=>({
                        ...prev,
                        stdclass:'', //student class
                        stdsectionid:'', //student section
                        stdname:'', //student name
                        stdregid:'' , //student regid
                        stdamountpaidnow:0 ,//student amount paid now
                        transportfeecomments:'', // transport fee comments
                        transportfeecollectedstaffid:regid?regid:'',
                        paidby:'',
                        staffrole:role?role:'',
                        receiptnumber:'',
                        totaltransportfee:0,
                        totalpaid:0,
                        transportnextfeedate:'',
                        stdtransportfeestatus:'',
                        stdtransportfrom:'',// transport from
                        stdgender:'',// student gender
                        stdmobile:0,//father or guardian mobile number
                    }));
                    setModeData([]);
                    setSelectStudent(prev=>({
                        ...prev,
                        label:'Select Student',
                        value:''
                    }));
                    setStudentRegid('');
                }else{
                    // alert('getting an error while paying the amount');
                    setShowErrorPayment(true);
                }
            }else{
                if(transportFeeData.stdregid==='') loginerror('please select the student');
                if(transportFeeData.stdamountpaidnow<=0) loginerror('amount should be greater than zero') ;
                if(transportFeeData.paidby==='') loginerror('please select paid by');
                if(modeData.length<=0) loginerror('please add the mode data');
                if(Number(transportFeeData.stdamountpaidnow)===Number(totalAmount)) loginerror("amount paid doesn't match sum of payment_mode amounts");
            }
        }catch(err){
            console.error('getting an error while paying transport fee',err);
            invalidError('getting an error while paying transport fee');
        }
        setshowloading(false);
    }

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){
            if(classSections.length===0){

                const handleModifiedSection = (data)=>{//if data modified this function will triggered
                    dispatch(sectionModified(data.data));
                }

                if(!socket.hasListeners('sectionModified')){
                    socket.on('sectionModified',handleModifiedSection);
                }

                const handleAddedNewSection = (data) =>{//if new section is added this function will triggered
                    dispatch(addedNewSection(data.data));
                }

                if(!socket.hasListeners('addedNewSection')){
                    socket.on('addedNewSection',handleAddedNewSection);
                }

                async function fetchSections(){
                    try{
                        const response = await fetch(`${API_URL}/sections/getsections`,{
                            credentials:'include'
                        });
                        if(!response.ok){
                            if(response.status === 401) {
                                alert('Your session is expired,please login again');
                                Logout(dispatch,navigate);
                                throw new Error('Unauthorized - Token expired');
                            }
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const tempSections = await response.json();
                        if( tempSections.allSections.length>0){
                             dispatch(updateSections(tempSections.allSections));
                        }
                        // console.log('here is the all sections data',tempSections);
                    }catch(err){
                        console.log('getting error while fetching the sections data',err);
                    }
                }
                fetchSections();
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
            fetchCheckOnlyOnce.current =true;
        }
    },[classSections.length,allTownsAndVillages.length , navigate , dispatch]);


    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} 
                        style={{width:'fit-content',background:'white',
                            paddingRight:5,borderRadius:20,
                            marginBottom:10,marginTop:10}}
                            >
                            <KeyboardArrowLeftIcon sx={{fontSize:22}}/>
                            <p>back</p>
                        </div>
                        <div className='paytransportfee-con'>
                            <div className='paytransportfee-header'>
                                <h2>pay transport fee</h2>
                            </div>
                            {/* form */}
                            <form className='paytransportfee-form'>
                                <div className='paytransportfee-form-stdregidorname'>
                                    <label>
                                        Would you like to pay the transport fee using the student's registration ID or the student's name?
                                    </label>
                                    <div className='paytransportfee-stdregidorname-options'>
                                        <div>
                                            <input type='radio' checked={regidOrStudentname==='regid'} id='stdregidornameregid' 
                                            onChange={()=>{
                                                ResetTheAddedData();
                                                setRegidOrStudentname('regid');

                                            }}/>
                                            <label htmlFor='stdregidornameregid'>Registration ID</label>
                                        </div>
                                        <div>
                                            <input type='radio' checked={regidOrStudentname==='studentname'} id='stdregidornamestudent' 
                                            onChange={()=>{
                                                ResetTheAddedData();
                                                setRegidOrStudentname('studentname');
                                            }}/>
                                            <label htmlFor='stdregidornamestudent'>student name</label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    regidOrStudentname ==='regid' &&
                                    <div className='paytransportfee-findstudent-regid'>
                                        <div className='paytransportfee-findstudent-regidcon'>
                                            <input type='text' placeholder='Enter Student Registration ID...' value={studentRegid} onChange={(e)=>setStudentRegid(e.target.value)}/>
                                            <button onClick={(e)=>handleFindStudent(e)}>get student</button>
                                        </div>
                                        {studentRegidError!=='' && <small style={{color:'red',fontSize:'0.7rem',textTransform:'capitalize',paddingLeft:10}}>{studentRegidError}</small>}
                                    </div>
                                }
                                {/* student transport fee details */}
                                <h2 className="feepayment-student-details-header">student details</h2>
                                <div className="feepayment-student-details">

                                        <div className="feepayment-student-details-eachdiv">
                                            <label>student class</label>
                                            {
                                                regidOrStudentname ==='regid'?
                                                <input type='text' value={transportFeeData.stdclass} readOnly/>:
                                                <select value={transportFeeData.stdclass} onChange={(e)=>setTransportFeeData(prev=>({
                                                    ...prev,
                                                    stdclass:e.target.value
                                                }))}>
                                                    <option value=''>Select Class</option>
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
                                            }
                                        </div>
                                        <div className="feepayment-student-details-eachdiv">
                                            <label>student section</label>
                                            {
                                                regidOrStudentname ==='regid'?<input type='text' value={getSectionName(transportFeeData.stdsectionid)} readOnly/>:
                                                <select value={transportFeeData.stdsectionid} onChange={(e)=>{
                                                    handleFetchClassStudents(e);
                                                    setTransportFeeData(prev=>({
                                                        ...prev,
                                                        stdsectionid:e.target.value
                                                    }));
                                                }}>
                                                    <option value=''>Select Section</option>
                                                    {
                                                        classSections.filter((item)=>item.class===transportFeeData.stdclass).map((section,idx)=>(
                                                            <option key={idx} value={section._id}>{section.sectionname}</option>
                                                        ))
                                                    }
                                                </select>
                                            }
                                        </div>

                                        <div className="feepayment-student-details-eachdiv">
                                            <label>student name</label>
                                            {
                                                regidOrStudentname ==='regid'?
                                                <input type='text' value={transportFeeData.stdname} readOnly/> :
                                                <Select value={selectStudent}  
                                                onChange={reactStudentSelect}
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
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })}}
                                                    options={
                                                        classStudents.map((tempstudent)=>({
                                                            value:tempstudent.stdregid,
                                                            label:`${tempstudent.stdfirstname} ${tempstudent.stdmiddlename} ${tempstudent.stdlastname}`
                                                        }))
                                                    }
                                                    components={{ DropdownIndicator: null }}
                                                    placeholder="Select an option"
                                                    menuPortalTarget={document.body}
                                                 />
                                            }
                                            
                                        </div>

                                        <div className="feepayment-student-details-eachdiv">
                                            <label>student reg.ID<span style={{color:'red'}}>*</span></label>
                                            <input type='text' value={transportFeeData.stdregid} readOnly/>
                                        </div>

                                </div>

                                <h2 className="feepayment-student-details-header">student transport fee details</h2>
                                <div className="feepayment-student-details">
                                    <div className="feepayment-student-details-eachdiv">
                                        <label>transport total fee</label>
                                        <input type='number' value={Number(transportFeeData.totaltransportfee)} readOnly/>
                                    </div>

                                    <div className="feepayment-student-details-eachdiv">
                                        <label>transport total paid</label>
                                        <input type='number' value={Number(transportFeeData.totalpaid)} readOnly/>
                                    </div>

                                    <div className="feepayment-student-details-eachdiv">
                                        <label>transport total Due</label>
                                        <input type='number' value={Number(transportFeeData.totaltransportfee)-Number(transportFeeData.totalpaid)} readOnly/>
                                    </div>

                                </div>

                                <h2 className="feepayment-student-details-header">paying amount</h2>
                                <div className="feepayment-student-details">
                                    <div className="feepayment-student-details-eachdiv">
                                        <label>paying amount<span style={{color:'red'}}>*</span></label>
                                        <input type='number' value={transportFeeData.stdamountpaidnow} onChange={(e)=>setTransportFeeData(prev=>({
                                            ...prev,
                                            stdamountpaidnow:e.target.value<0?0:e.target.value>(Number(transportFeeData.totaltransportfee)-Number(transportFeeData.totalpaid))?
                                            Number(transportFeeData.totaltransportfee)-Number(transportFeeData.totalpaid):e.target.value
                                        }))}/>
                                    </div>

                                    <div className="feepayment-student-details-eachdiv">
                                        <label>amount paid by<span style={{color:'red'}}>*</span></label>
                                        <select value={transportFeeData.paidby} onChange={(e)=>setTransportFeeData(prev=>({
                                            ...prev,
                                            paidby:e.target.value
                                        }))}>
                                            <option value=''>select paid by</option>
                                            <option value='father'>Father</option>
                                            <option value='mother'>Mother</option>
                                            <option value='guardian'>Guardian</option>
                                        </select>
                                    </div>

                                    <div className="feepayment-student-details-eachdiv">
                                        <label>next fee date<span style={{color:'red'}}>*</span></label>
                                        <input type='date' value={transportFeeData.transportnextfeedate} onChange={(e)=>setTransportFeeData(prev=>({
                                            ...prev,
                                            transportnextfeedate:e.target.value
                                        }))}/>
                                    </div>
                                </div>

                                {
                                    modeData.length>0 &&
                                    modeData.map((item,idx)=>(
                                        <>
                                            <div className="feepayments-displaying-each-mode" key={idx}>
                                                <div className="feepayments-each-mode-head">
                                                    <p>payment mode_{idx+1}</p>
                                                    <DeleteOutlineIcon sx={{fontSize:20,color:'red',cursor:'pointer'}} onClick={()=>handleDeleteModeData(item.modeuid)}/>
                                                </div>
                                                <div className="feepayment-student-details">
                                                    <div className="feepayment-student-details-eachdiv">
                                                        <label> payment Mode</label>
                                                        <select value={item.modetype} onChange={(e)=>handleUpdateEachModeData(e,idx,'modetype')}>
                                                            <option value=''>Select Mode</option>
                                                            <option value='cash'>Cash</option>
                                                            <option value='card'>Card</option>
                                                            <option value='upi'>UPI</option>
                                                        </select>
                                                    </div>

                                                    <div className="feepayment-student-details-eachdiv">
                                                        <label>Amount (₹)</label>
                                                        <input type='number' value={item.modeamount} min={0} onChange={(e)=>handleUpdateEachModeData(e,idx,'modeamount')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))
                                }

                                {
                                    modeData.length<3 && 
                                    <div className="feepayment-addmode-btn">
                                        <button onClick={(e)=>handleAddModeData(e)} style={{textTransform:'capitalize'}}>+ payment Mode</button>
                                    </div>
                                }

                                <div className="feepayment-student-details">
                                    <div className="feepayment-student-details-eachdiv">
                                        <label>comments</label>
                                        <textarea placeholder="Wrtie Your Comments Here..." value={transportFeeData.transportfeecomments} onChange={(e)=>setTransportFeeData(prev=>({
                                            ...prev,
                                            transportfeecomments:e.target.value
                                        }))}/>
                                    </div>
                                </div>

                                <div className="feepayment-student-details">
                                    <div className="feepayment-student-details-eachdiv">
                                        <button onClick={(e)=>handlePayTransportFee(e)}>pay amount</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            {
                !showloading && showFeeReceipt && 
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={showFeeReceipt}
                    >
                    {/* fee recepit pdf */}
                    <div className="feepayments-feereceipt-pdfview-inner"></div>
                    <div className="feepayments-feereceipt-pdfview">
                        <div className="feepayments-feereceipt-pdfview-cross">
                            <p onClick={()=>setShowFeeReceipt(false)}>close</p>
                        </div>
                        <Transportfeereceiptpdf storeTransportfeeReceipt={storeTransportfeeReceipt} classSections={classSections} allTownsAndVillages={allTownsAndVillages}/>
                    </div>
                </Backdrop>
            }

            <Dialog
                open={showSuccesspayment}
                // onClose={false}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="feepayment-successform">
                    <div className="feepaymet-successform-close">
                        <CloseIcon sx={{fontSize:20,cursor:'pointer'}} onClick={()=>handleCloseSuccessfeepaymentpopup()}/>
                    </div>
                    <div className="feepayment-successheading">
                        <p>Payment completed successfully</p>
                    </div>
                    <p>you want to print the fee payment receipt</p>
                    <button onClick={(e)=>{
                        handleCloseSuccessfeepaymentpopup();
                        handleopenreceiptpreview(e);

                    }}>print</button>
                </div>
            </Dialog>

            <Dialog
                open={showErrorpayment}
                // onClose={false}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="feepayment-successform">
                    <div className="feepaymet-successform-close">
                        <CloseIcon sx={{fontSize:20,cursor:'pointer'}} onClick={()=>handleCloseErrorFeePaymentPopup()}/>
                    </div>
                    <div className="feepayment-successheading" >
                        <p style={{color:'red'}}>Payment failed. Please try again</p>
                    </div>
                    
                    <button onClick={(e)=>{
                        e.preventDefault();
                        handleCloseErrorFeePaymentPopup();
                    }}>close</button>
                </div>
            </Dialog>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <div className="feepayments-students-showloading">
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>

            <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    limit={5}
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

export default PayTransportFee;