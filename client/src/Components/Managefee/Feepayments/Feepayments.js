import React, { useEffect, useRef, useState } from "react";
import './Feepayments.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addedNewSection, sectionModified, updateSections } from "../../../ReduxStates/Sections";
import { API_URL, socket } from "../../../Data/Docs";
import { Logout } from "../../AllFunctions/Logout";
import {v4 as uuidv4} from 'uuid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

import Select from "react-select";
import Feereceiptpdf from "../../Pdfs/Feereceiptpdf";

function Feepayments(){
    const navigate = useNavigate();
    const fetchCheckOnlyOnce = useRef(false);
    const role = useSelector((state)=>state.userdata.role);
    const regid = useSelector((state)=>state.userdata.regid);
    const classSections = useSelector((state)=>state.sections.data);
    const dispatch = useDispatch();
    const[sectionStudents , setSectionStudents] = useState([]);
    const[tempStdFee,setTempStdFee] = useState({
        feeDue:0,
        feeAfterdiscount:0
    });
    const[feeDetails,setFeeDetails] = useState({
        stdclass:'',//student class
        stdsectionid:'',//student section ID
        stdname:'',//student name
        stdregid:'',//student register ID
        stdamountpaidnow:0,//student amount paid now
        feecomments:'',//fee comments
        feepaiddate:'',//student fee paid date
        feepaidtime:'',//student fee paid time
        totalfee:'',//total fee
        feediscount:'',//fee discount
        totalpaid:'',//total paid

        //modified or extra adding data comes here
        feecollectedstaffid:regid?regid:'',
        paidby:'',
        staffrole:role?role:'',
        nextfeedate:''
    });

    const[modeData,setModeData] = useState([]);//here we have to store array of objects

    const[showstudentsFetching,setShowStudentsFetching]=useState(false);
    const[showloading,setshowloading] = useState(false);

    const[showSuccesspayment,setShowSuccessPayment] = useState(false); //payment success card
    const[showErrorpayment , setShowErrorPayment] = useState(false); //payment Error form state


    const[selectStudentData,setSelectStudentData] = useState({//here we are storing the react selected data
        label:'select student',
        value:''
    });

    const[showFeeReceipt,setShowFeeReceipt] = useState(false);//shwoing the preview of the fee receipt
    const[storeFeeReceiptData,setStoreFeeReceipt] = useState({});//storing the data from backend




    //toast notifications
    const loginerror = (msg) =>toast.info(`${msg}`,{
        className:'login-info-notify',
        icon:false
    });

    const invalidError =(msg)=>toast.error(`${msg}`,{
        className:'login-error-notify',
        icon:false
    });

    //response from react select functions
    const reactStudentSelect = (option)=>{

        setFeeDetails(prev=>{//adding the fee details
            const student = sectionStudents.find(item => item.stdregid === option.value);
            setTempStdFee(prev=>({
                ...prev,
                feeDue:student?student.stdtotalfee-((student.stdtotalfee*student.stdfeediscount)/100)-student.stdtotalpaid:'',
                feeAfterdiscount:student?student.stdtotalfee-((student.stdtotalfee*student.stdfeediscount)/100):''
            }))
            if(student){
                setStoreFeeReceipt(student);
            }
            return({
            ...prev,
            stdregid:option.value,
            stdname:student?student.stdfirstname+' '+student.stdmiddlename+' '+student.stdlastname :'',
            totalfee:student?student.stdtotalfee:0,
            feediscount:student?student.stdfeediscount:0,
            totalpaid:student?student.stdtotalpaid:0,
            })
        });


        setSelectStudentData(prev=>({//adding react student selected students data
            ...prev,
            ...option
        }));

        setModeData([]);
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


    //function for fetching students
    async function handleFetchClassStudents(e){
        setShowStudentsFetching(true);
        try{
            setFeeDetails(prev=>({
                ...prev,
                stdsectionid:e.target.value,
                stdname:'',//student name
                stdregid:'',//student register ID
                stdamountpaidnow:0,//student amount paid now
                feecomments:'',//fee comments
                feepaiddate:'',//student fee paid date
                feepaidtime:'',//student fee paid time
                totalfee:'',//total fee
                feediscount:'',//fee discount
                totalpaid:'',//total paid
                nextfeedate:'',//here we are going to add next fee date
            }));
            setTempStdFee(prev=>({
                ...prev,
                feeDue:0,
                feeAfterdiscount:0
            }))
            if(e.target.value!==''){

                const studentsController = new AbortController();
                const stdControllerTimeout = setTimeout(()=>studentsController.abort(),10000);
                const response = await fetch(`${API_URL}/student/getstudentsofasection`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        class:feeDetails.stdclass,
                        section:e.target.value
                    }),
                    credentials:'include',
                    signal:studentsController.signal
                });
                clearTimeout(stdControllerTimeout);

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
                    setSectionStudents(resData.studentsdata);
                    // console.log('here is the students data', resData);

                    
                }else{
                    setSectionStudents([]);
                    alert('getting an error while fetchin the students data');
                }
            }
            
        }catch(err){
            if(err.name === 'AbortError'){
                invalidError("Request timed out. Please try again.");
            }else{
                console.log('while fetching the students you getting an error ',err);
                invalidError("Unable to connect. Please check your internet connection.");
            }
        }
        setShowStudentsFetching(false);
    }

    async function handlePayStudentFee(e){
        e.preventDefault();
        setshowloading(true);
        try{
            const totalAmount = modeData.reduce((sum, item) => sum + Number(item.modeamount), 0);
            // console.log(totalAmount);
            if(feeDetails.stdregid!=='' && feeDetails.stdamountpaidnow>0 && modeData.length>0 && feeDetails.paidby!=='' && Number(feeDetails.stdamountpaidnow)===Number(totalAmount)){
                const paymentController = new AbortController();
                const paymentTimeout = setTimeout(()=>paymentController.abort(),15000);
                const backRes = await fetch(`${API_URL}/studentfee/paystudentfee`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        ...feeDetails,
                        modedata:modeData
                    }),
                    credentials:'include',
                    signal:paymentController.signal
                });
                clearTimeout(paymentTimeout);
                if(!backRes.ok){
                    if(backRes.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }
                    throw new Error(`HTTP error! status: ${backRes.status}`);
                }
                const resData = await backRes.json();
                if(resData.success){
                    // alert(`${resData.message}`);
                    // console.log('here isthe student fee data ',resData);
                    setStoreFeeReceipt(prev=>({
                        ...prev,
                        ...resData.studentfeeres,
                    }));
                    console.log(storeFeeReceiptData);//receipt data
                    setShowSuccessPayment(true);
                    setFeeDetails(prev=>({
                        ...prev,
                        stdclass:'',//student class
                        stdsectionid:'',//student section ID
                        stdname:'',//student name
                        stdregid:'',//student register ID
                        stdamountpaidnow:0,//student amount paid now
                        feecomments:'',//fee comments
                        feepaiddate:'',//student fee paid date
                        feepaidtime:'',//student fee paid time
                        totalfee:'',//total fee
                        feediscount:'',//fee discount
                        totalpaid:'',//total paid

                        feecollectedstaffid:regid?regid:'',
                        paidby:'',
                        staffrole:role?role:'',
                        nextfeedate:'',//here is the next fee data
                    }));
                    setTempStdFee(prev=>({
                        ...prev,
                        feeDue:0,
                        feeAfterdiscount:0
                    }));
                    setSelectStudentData(prev=>({
                        ...prev,
                        label:'select student',
                        value:''
                    }));
                    setModeData([]);
                }else{
                    // alert('getting an error while paying the fee');
                    setShowErrorPayment(true)
                }
            }else{
                
                if(feeDetails.stdregid==='') loginerror('please select the student');
                if(feeDetails.stdamountpaidnow<=0) loginerror('amount should be greater than zero rupees');
                if(modeData.length<=0) loginerror('please add the mode data');
                if(feeDetails.paidby==='') loginerror('please select paid by');
                if(Number(feeDetails.stdamountpaidnow)!==Number(totalAmount)) loginerror("amount paid doesn't match sum of payment_mode amounts");
            }
        }catch(err){
            console.error('getting an error while paying the fee',err);
            invalidError('getting an error while paying the fee');
        }
        setshowloading(false);
    }

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
            fetchCheckOnlyOnce.current = true;
        }
    },[classSections.length,navigate,dispatch]);


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
                        <form className="feepayments-form">
                            {/* FORM heading */}
                            <div className="feepayment-heading">
                                <h2>fee payment form</h2>
                            </div>

                            {/* student details */}
                            <h2 className="feepayment-student-details-header">student details</h2>
                            <div className="feepayment-student-details">
                                <div className="feepayment-student-details-eachdiv">
                                    <label>student class</label>
                                    <select value={feeDetails.stdclass} onChange={(e)=>{
                                        setFeeDetails(prev=>({
                                        ...prev,
                                        stdclass:e.target.value
                                        }));
                                        setSelectStudentData(prev=>({
                                            ...prev,
                                            label:'select student',
                                            value:''
                                        }));
                                        setModeData([]);
                                }}>
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
                                </div>

                                <div className="feepayment-student-details-eachdiv">
                                    <label>student section</label>
                                    <select value={feeDetails.stdsectionid} onChange={(e)=>{
                                        handleFetchClassStudents(e);
                                        setSelectStudentData(prev=>({
                                            ...prev,
                                            label:'select student',
                                            value:''
                                        }));
                                        setModeData([]);
                                    }}>
                                        <option value=''>Select Section</option>
                                        {
                                            classSections.filter((item)=>item.class===feeDetails.stdclass).map((section,idx)=>(
                                                <option key={idx} value={section._id}>{section.sectionname}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="feepayment-student-details-eachdiv">
                                    <label>student name</label>
                                    <Select value={selectStudentData} onChange={reactStudentSelect}
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
                                        sectionStudents.map((tempstudent)=>({
                                            value:tempstudent.stdregid,
                                            label:`${tempstudent.stdfirstname} ${tempstudent.stdmiddlename} ${tempstudent.stdlastname}`
                                        }))
                                    }
                                    components={{ DropdownIndicator: null }}
                                    placeholder="Select an option"
                                    menuPortalTarget={document.body}
                                    />
                                        {/* <option value=''>select student</option>
                                        {
                                            sectionStudents.map((item,idx)=>(
                                                <option key={idx} value={item.stdregid}>{``}</option>
                                            ))
                                        }

                                    </select> */}
                                </div>

                                <div className="feepayment-student-details-eachdiv">
                                    <label>student reg.ID<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={feeDetails.stdregid} readOnly/>
                                </div>
                            </div>

                            {/* student fee details */}
                            <h2 className="feepayment-student-details-header">student fee details</h2>
                            <div className="feepayment-student-details">
                                <div className="feepayment-student-details-eachdiv">
                                    <label>student total fee</label>
                                    <input type='number' value={feeDetails.totalfee} readOnly/>
                                </div>

                                <div className="feepayment-student-details-eachdiv">
                                    <label>fee discount <span style={{color:'red'}}>(%)</span></label>
                                    <input type='number' value={feeDetails.feediscount} readOnly/>
                                </div>

                                <div className="feepayment-student-details-eachdiv">
                                    <label>fee after discount</label>
                                    <input type='number' value={tempStdFee.feeAfterdiscount} readOnly/>
                                </div>

                                <div className="feepayment-student-details-eachdiv">
                                    <label>student total paid</label>
                                    <input type='number' value={feeDetails.totalpaid} readOnly/>
                                </div>

                                <div className="feepayment-student-details-eachdiv">
                                    <label>total fee due</label>
                                    <input type='number' value={tempStdFee.feeDue} readOnly/>
                                </div>
                            </div>

                            {/* student paying amount */}
                            <h2 className="feepayment-student-details-header">paying amount</h2>
                            <div className="feepayment-student-details">
                                <div className="feepayment-student-details-eachdiv">
                                    <label>paying amount<span style={{color:'red'}}>*</span></label>
                                    <input type='number' value={feeDetails.stdamountpaidnow} onChange={(e)=>setFeeDetails(prev=>({
                                        ...prev,
                                        stdamountpaidnow:e.target.value>tempStdFee.feeDue?tempStdFee.feeDue:e.target.value<0?0:e.target.value
                                    }))}/>
                                </div>
                                <div className="feepayment-student-details-eachdiv">
                                    <label>amount paid By<span style={{color:'red'}}>*</span></label>
                                    <select value={feeDetails.paidby} onChange={(e)=>setFeeDetails(prev=>({
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
                                    <input type='date' value={feeDetails.nextfeedate} onChange={(e)=>setFeeDetails(prev=>({
                                        ...prev,
                                        nextfeedate:e.target.value
                                    }))
                                }/>
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
                                                    <input type='number' value={item.modeamount} onChange={(e)=>handleUpdateEachModeData(e,idx,'modeamount')}/>
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
                                    <textarea placeholder="Wrtie Your Comments Here..." value={feeDetails.feecomments} 
                                    onChange={(e)=>setFeeDetails(prev=>({
                                        ...prev,
                                        feecomments:e.target.value
                                    }))}/>
                                </div>
                            </div>

                            <div className="feepayment-student-details">
                                <div className="feepayment-student-details-eachdiv">
                                    <button onClick={(e)=>handlePayStudentFee(e)}>pay amount</button>
                                </div>
                            </div>
                        </form>

                        
                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <div className="feepayments-students-showloading">
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showstudentsFetching}
            >
                <div className="feepayments-students-showloading">
                    <CircularProgress color="inherit" />
                    <p>loading students...</p>
                </div>
            </Backdrop>

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
                        <Feereceiptpdf  storeFeeReceiptData={storeFeeReceiptData} classSections={classSections}/>
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

export default Feepayments;