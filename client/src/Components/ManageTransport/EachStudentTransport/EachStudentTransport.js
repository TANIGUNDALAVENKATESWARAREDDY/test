import React, { useEffect, useRef, useState } from 'react';
import './EachStudentTransport.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import { useNavigate, useParams } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { API_URL, socket } from '../../../Data/Docs';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../AllFunctions/Logout';
import { storetownsdata } from '../../../ReduxStates/Townsdata/Townsdata';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Transportfeereceiptpdf from '../../Pdfs/Transportfeereceiptpdf';
import { addedNewSection, sectionModified, updateSections } from '../../../ReduxStates/Sections';


function EachStudentTransport(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {stdid} = useParams();
    const [studentData , setStudentData] = useState({});
    const [transportHistory ,setTransportHistory] = useState([]);
    const [showloading , setShowloading] = useState(false);
    const fetchCheckOnlyOnce = useRef(false);
    const allTownsAndVillages = useSelector((state)=>state.townsdata.data);
    const classSections = useSelector((state)=>state.sections.data);

    const [TransportfeeReceipt,setTransportfeeReceipt] = useState({
        isActive:false,
        storeTransportfeeReceipt:{}
    });

    function handleGetVillageName(vlgID){
        const findvillage = allTownsAndVillages.find((vlg)=>vlg.townid===vlgID);
        return findvillage?findvillage.townname:'';
    }

    function handleStoreTransportReceiptData(ReceiptData){
        setShowloading(true);
        try{
            setTransportfeeReceipt(prev=>({
                ...prev,
                isActive:true,
                storeTransportfeeReceipt:{
                    ...ReceiptData,
                    ...studentData
                }
            }));
            setTimeout(()=>{
                setShowloading(false);
            },1800);
        }catch(err){
            alert('you getting an error while fetching the student transport receipt...', err);
        }
    }

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            if(stdid){
                async function handleFetchStudentHistory(){
                    try{
                        // console.log('fetching the data ',stdid)
                        const res = await fetch(`${API_URL}/transportHistory/getEachStudentTranportHistory/${stdid}`,{credentials:'include'});
                        const resData = await res.json();
                        // console.log('here is the response data: ',resData);
                        if(resData.success){
                            if(resData.studentdata){
                                setStudentData(resData.studentdata);
                            }
        
                            if(resData.transporthistory){
                                setTransportHistory(resData.transporthistory);
                            }
                        }
                    }catch(err){
                        console.log('getting an error while fetching student transport history: ',err);
                    }
                }
                handleFetchStudentHistory();
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


    },[stdid , allTownsAndVillages.length ,classSections.length, dispatch , navigate]);

    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container' >
                        {/* // write your code here \\ */}
                        <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} style={{marginTop:'20px'}}>
                            <KeyboardArrowLeftIcon sx={{fontSize:22}}/>
                            <p>back</p>
                        </div>

                        {/* student basic data */}
                        {
                            studentData.stdtransportfeestatus?
                            <div className='eachstudenttransport-stddata'>

                                <div className='eachstudenttransport-stddata-each'>
                                    <label>reg ID</label>
                                    <p>{stdid}</p>
                                </div>

                                <div className='eachstudenttransport-stddata-each'>
                                    <label>name</label>
                                    <p>{studentData.stdfirstname} {studentData.stdmiddlename} {studentData.stdlastname}</p>
                                </div>
                                
                                <div className='eachstudenttransport-stddata-each'>
                                    <label>class</label>
                                    <p>{studentData.stdclass}</p>
                                </div>

                                <div className='eachstudenttransport-stddata-each'>
                                    <label>village</label>
                                    <p>{studentData.stdtransportfrom?handleGetVillageName(studentData.stdtransportfrom):''}</p>
                                </div>

                                <div className='eachstudenttransport-stddata-each'>
                                    <label>Transport fee</label>
                                    <p style={{color:'blue'}}>{studentData.stdtransporttotalfee}</p>
                                </div>

                                <div className='eachstudenttransport-stddata-each'>
                                    <label>transport fee paid</label>
                                    <p style={{color:'green'}}>{studentData.stdtransportfeepaid}</p>
                                </div>

                                <div className='eachstudenttransport-stddata-each'>
                                    <label>transport fee due</label>
                                    <p style={{color:'red'}}>{Number(studentData.stdtransporttotalfee?studentData.stdtransporttotalfee:0)-Number(studentData.stdtransportfeepaid?studentData.stdtransportfeepaid:0)}</p>
                                </div>
                            </div>:
                            <p>student does not transport facility</p>
                        }
                        {
                            transportHistory.length>0 &&
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
                                            transportHistory.map((transportrec,idx)=>(
                                                <tr key={idx}>
                                                    <td>
                                                        <p className="eachstudentfeehistory-receiptnumber">{transportrec.receiptnumber}</p>
                                                    </td>
                                                    <td>{transportrec.transportfeepaiddata?transportrec.transportfeepaiddata.split('T')[0]:''}</td>
                                                    <td>{transportrec.paidby}</td>
                                                    <td>
                                                        <p className="eachstudentfeehistory-paidnow">{transportrec.stdamountpaidnow}</p>
                                                    </td>
                                                    <td>{transportrec.transportnextfeedate?transportrec.transportnextfeedate.split('T')[0]:''}</td>
                                                    <td><VisibilityIcon sx={{fontSize:18,color:'blue',cursor:'pointer'}} onClick={()=>handleStoreTransportReceiptData(transportrec)}/></td>
                                                    <td>{transportrec.transportfeecomments}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            {
                !showloading && TransportfeeReceipt.isActive && 
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={TransportfeeReceipt.isActive}
                    >
                    {/* fee recepit pdf */}
                    <div className="feepayments-feereceipt-pdfview-inner"></div>
                    <div className="feepayments-feereceipt-pdfview">
                        <div className="feepayments-feereceipt-pdfview-cross">
                            <p onClick={()=>setTransportfeeReceipt(prev=>({
                                ...prev,
                                isActive:false,
                                storeTransportfeeReceipt:{}
                            }))}>close</p>
                        </div>
                        <Transportfeereceiptpdf storeTransportfeeReceipt={TransportfeeReceipt.storeTransportfeeReceipt} classSections={classSections} allTownsAndVillages={allTownsAndVillages}/>
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

export default EachStudentTransport;