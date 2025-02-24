import React, { useEffect, useRef, useState } from "react";
import './Eachstudentfeehistory.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import studentphoto from "../../../Assets/dupilcatepic.PNG";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, socket } from "../../../Data/Docs";
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Feereceiptpdf from "../../Pdfs/Feereceiptpdf";
import { useDispatch, useSelector } from "react-redux";
import { addedNewSection, sectionModified, updateSections } from "../../../ReduxStates/Sections";
import { Logout } from "../../AllFunctions/Logout";


function Eachstudentfeehistory() {

    const {classid,studentid} = useParams();
    const fetchCheckOnlyOnce = useRef(false);
    // console.log('sectionid:',sectionid);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [studentFeeHist,setStudentFeeHist]=useState([]);
    const [studentData,setStudentData] = useState({});
    const [fetchError,setFetchError] = useState(false);
    const [dataLoading,setDataloading] = useState(false);


    const [showloading,setShowloading]= useState(false);//showloading
    const [feeReceiptData,setFeeReceiptData] = useState({ //store each receipt data
        isActive:false,
        storeFeeReceiptData:{}
    });

    const classSections = useSelector((state)=>state.sections.data);

    //function to change the date to dd/mm/year
    function formatDate(tempdate) {
        const date = new Date(tempdate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
      
        return `${day}/${month}/${year}`;
    }

    //function to handle store receipt data
    function handleStoreReceiptData(ReceiptData){
        setShowloading(true);
        try{
            setFeeReceiptData(prev=>({
                ...prev,
                isActive:true,
                storeFeeReceiptData:{
                    ...ReceiptData,
                    ...studentData
                }
                
            }));
            setTimeout(() => {
                setShowloading(false);
            }, 1800);
        }catch(err){
            alert('you getting an error while fetching student receipt data..',err);
        }
    }


    useEffect(()=>{
        if(classid!=='' && studentid!==''){
            async function fetchStudentFeeHistory(){
                // console.log('fetching students fee data');
                setDataloading(true);
                try{
                    const feeController = new AbortController();
                    const feeConTimeOut = setTimeout(()=>feeController.abort(),10000);
                    const studentfeeres = await fetch(`${API_URL}/studentfee/eachStudentHistory/${classid}/${studentid}`,{
                        credentials:'include',
                        signal:feeController.signal
                    });
                    clearTimeout(feeConTimeOut);
                    const resData = await studentfeeres.json();
                    // console.log('resdata',resData);
                    if(resData.success){
                        if(resData.studentdata){
                            setStudentData(resData.studentdata);
                        }
                        if(resData.feehistory){
                            setStudentFeeHist(resData.feehistory);
                        }
                    }else{
                        setFetchError(true);
                    }
                    
                }catch(err){
                    console.log('getting an error while fetchin student fee history',err);
                }
                setDataloading(false);
            }
            fetchStudentFeeHistory();
        }

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
                            throw new Error(`Httkp error! status: ${response.status}`);
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
    },[classid,studentid,classSections.length,navigate , dispatch]);

   
    
   
    return (
        <>
            <div className='staffdashboard-con'>
                <Sidenav />
                <div className='staffdashboard-inner'>
                    <Topnav />
                    {dataLoading?<p>Loading...</p>:fetchError?<p>Data Not Found</p>:
                    <div className='main-inner-container'>
                        {/* Code starts here */}
                        <div className='admissionform-top-back-btn' style={{marginBottom:5,marginTop:15}} onClick={()=>navigate(-1)} >
                            <KeyboardArrowLeftIcon/>
                            <p>back</p>
                        </div>
                        <div className="studFeeHis_con">
                            {
                                studentData.stdregid && 
                                <div className="studFeeHis_card-container">
                                    <div className="studFeeHis_student-info">
                                        <img src={studentphoto} alt="student" />
                                        <div className="studFeeHis_student-details">
                                            <p><span>Name :</span> <span className="studInfo_value">{studentData.name}</span></p>
                                            <p><span>Reg No :</span> <span className="studInfo_value">{studentData.stdregid}</span></p>
                                            <p><span>Class :</span> <span className="studInfo_value">{studentData.class} B</span></p>
                                        </div>
                                    </div>

                                    <div className="studFeeHis_fee-info">
                                        <div>
                                            <label>Total fee</label>
                                            <p>₹ {studentData.totalfee} /-</p>
                                        </div>
                                        <div>
                                            <label>Fee discount</label>
                                            <p>{studentData.feediscount}%</p>
                                        </div>
                                        <div>
                                            <label>Amount paid</label>
                                            <p style={{color: 'green'}}>₹ {studentData.stdtotalpaid} /-</p>
                                        </div>
                                        <div>
                                            <label>Fee due</label>
                                            <p style={{color: 'red'}}>₹ {(Number(studentData.totalfee)-(Number(studentData.totalfee)*Number(studentData.feediscount)/100))-Number(studentData.stdtotalpaid)} /-</p>
                                        </div>
                                        {/* <table className="studFeeHis_table">
                                            <thead>
                                                <tr>
                                                    <th>Total Fee</th>
                                                    <th>fee discount</th>
                                                    <th>Amount Paid</th>
                                                    <th>Fee Due</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>₹ {studentData.totalfee} /-</td>
                                                    <td>₹ {studentData.feediscount}</td>
                                                    <td className="amount-paid">₹ {studentData.totalpaid}</td>

                                                    <td className="fee-due">₹ {(Number(studentData.totalfee)-(Number(studentData.totalfee)*Number(studentData.feediscount)/100))-Number(studentData.totalpaid)} /-</td>
                                                </tr>
                                            </tbody>
                                        </table> */}
                                    </div>
                                </div>
                            }

                            <div className="show-application-whole-inner-table" style={{marginBottom:20}}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Receipt ID</th>
                                                <th>Date</th>
                                                <th>Paid By</th>
                                                <th>Amount Paid</th>
                                                <th>Next Date</th>
                                                <th>Actions</th>
                                                <th>Fee Comments</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                studentFeeHist.length>0  &&
                                                studentFeeHist.map((item,idx)=>(
                                                    <tr key={idx}>
                                                        <td><p className="eachstudentfeehistory-receiptnumber">{item.receiptnumber}</p></td>
                                                        <td>{formatDate(item.feepaiddate)}</td>
                                                        <td>{item.paidby}</td>
                                                        <td>
                                                            <p className="eachstudentfeehistory-paidnow">{item.stdamountpaidnow}</p>
                                                        </td>
                                                        <td>{item.nextfeedate?item.nextfeedate.split('T')[0]:''}</td>
                                                        <td><VisibilityIcon sx={{fontSize:18,color:'blue',cursor:'pointer'}} onClick={()=>handleStoreReceiptData(item)}/></td>
                                                        <td>{item.feecomments}</td>
                                                    </tr>
                                                ))
                                            }
                                            
                                        </tbody>

                                    </table>
                                </div>
                        </div>
                        {/* Code ends here */}
                    </div>}
                </div>
            </div>
            {
                !showloading && feeReceiptData.isActive && 
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={feeReceiptData.isActive}
                    >
                    {/* fee recepit pdf */}
                    <div className="feepayments-feereceipt-pdfview-inner"></div>
                    <div className="feepayments-feereceipt-pdfview">
                        <div className="feepayments-feereceipt-pdfview-cross">
                            <p onClick={()=>setFeeReceiptData(prev=>({
                                ...prev,
                                isActive:false,
                                storeFeeReceiptData:{}
                            }))}>close</p>
                        </div>
                        <Feereceiptpdf  storeFeeReceiptData={feeReceiptData.storeFeeReceiptData} classSections={classSections}/>
                    </div>
                </Backdrop>
            }

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <div className="feepayments-students-showloading">
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>
        </>
    );
}

export default Eachstudentfeehistory;
