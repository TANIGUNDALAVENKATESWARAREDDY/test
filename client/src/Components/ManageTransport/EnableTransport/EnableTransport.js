import React, { useEffect, useRef, useState } from "react";
import './EnableTransport.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { API_URL, socket } from "../../../Data/Docs";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { addedNewSection, sectionModified, updateSections } from "../../../ReduxStates/Sections";
import { Logout } from "../../AllFunctions/Logout";
import { storetownsdata } from "../../../ReduxStates/Townsdata/Townsdata";
import Select from "react-select";

function EnableTransport(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showloading,setshowloading]=useState(false);
    const [studentError , setStudentError] = useState('');
    const [studentRegId , setStudentRegId] = useState('');
    const [selectVillage , setSelectVillage] = useState({
        label:'select town/village',
        value:''
    });
    const classSections = useSelector((state)=>state.sections.data);//sections
    const allTownsAndVillages = useSelector((state)=>state.townsdata.data);//all towns
    const fetchCheckOnlyOnce = useRef(false);

    const [stdTransportData , setStdTransportData] = useState({
        stdregid:'',
        stdfirstname:'',
        stdmiddlename:'',
        stdlastname:'',
        stdclass:'',
        stdsectionid:'',
        stdtransportfeestatus:'',
        stdtransporttotalfee:0,
        stdtransportfeepaid:0,
        stdtransportfrom:'',
        transportstartdate:''
    });
    const [openEnableBox,setOpenEnableBox] = useState(false);
    const [openDisableBox,setOpenDisableBox] = useState(false);

    async function handleFetchStudentData(e){
        e.preventDefault();
        setshowloading(true);
        try{
            if(studentRegId!==''){
                const stdAbortCtrl = new AbortController();
                const stdAbortCtrlTimeout = setTimeout(()=>stdAbortCtrl.abort(),10000);
                const studentRes = await fetch(`${API_URL}/transportHistory/EnableTransport`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        studentid:studentRegId
                    }),
                    credentials:'include',
                    signal:stdAbortCtrl.signal
                });
                clearTimeout(stdAbortCtrlTimeout);
                const resData = await studentRes.json();
                // console.log('resData: ',resData);
                if(resData.success){
                    setStdTransportData(prev=>({
                        ...prev,
                        stdregid:resData.studentdata.stdregid,
                        stdfirstname:resData.studentdata.stdfirstname,
                        stdmiddlename:resData.studentdata.stdmiddlename,
                        stdlastname:resData.studentdata.stdlastname,
                        stdclass:resData.studentdata.stdclass,
                        stdsectionid:resData.studentdata.stdsectionid,
                        stdtransportfeestatus:resData.studentdata.stdtransportfeestatus,
                        stdtransporttotalfee:resData.studentdata.stdtransporttotalfee?Number(resData.studentdata.stdtransporttotalfee):0,
                        stdtransportfeepaid:resData.studentdata.stdtransportfeepaid?Number(resData.studentdata.stdtransportfeepaid):0,
                        stdtransportfrom:resData.studentdata.stdtransportfrom,
                        transportstartdate:resData.studentdata.transportstartdate
                    }));
                    if(studentError!=='') setStudentError('');
                }else{
                    setStdTransportData(prev=>({
                        ...prev,
                        stdregid:'',
                        stdfirstname:'',
                        stdmiddlename:'',
                        stdlastname:'',
                        stdclass:'',
                        stdsectionid:'',
                        stdtransportfeestatus:'',
                        stdtransporttotalfee:0,
                        stdtransportfeepaid:0,
                        stdtransportfrom:'',
                        transportstartdate:''
                    }));
                    setStudentError(resData.message);
                }
            }else{
                setStudentRegId('please enter registeration ID');
            }
        }catch(err){
            console.log('getting an error while fetching the student data ',err);
            setStudentError(`${err}`);
        }
        setshowloading(false);
    }

    //react village select
    function handleReactTownSelect(selOption){
        const tempmoney = allTownsAndVillages.find((towns)=>towns.townid===selOption.value);
        setStdTransportData(prev=>({
            ...prev,
            stdtransportfrom:selOption.value,
            stdtransporttotalfee:tempmoney?Number(tempmoney.towntransportfee):0
        }));
        setSelectVillage(prev=>({
            ...prev,
            ...selOption
        }));
    }

    //function to close the enable box
    function handleOpenEnableBox(e){
        e.preventDefault();
        setOpenEnableBox(true);
    }
    function handleCloseEnableBox(){
        setOpenEnableBox(false);
    }

    //function to close the disable  box
    function handleOpenDisableBox(e){
        e.preventDefault();
        setOpenDisableBox(true);
    }

    function handleCloseDisableBox(){
        setOpenDisableBox(false);
    }

    //get section name
    function handleGetSectionname(secID){
        const section = classSections.find((sec)=>sec._id===secID);
        if(section){
            // console.log('here is the section',section);
            return section.sectionname;
        }
        return 'not found';
    }

    //get village name
    function handleGetVillageName(villageID){
        const temptown = allTownsAndVillages.find((tow)=>tow.townid===villageID);
        if(temptown){
            return temptown.townname;
        }
        return 'not found';
    }
    
    //enable the student transport
    async function handleUpdateEnableTransport(e){
        e.preventDefault();
        setshowloading(true);
        try{
            if(stdTransportData.stdtransportfrom!=='' && stdTransportData.stdtransporttotalfee>=0){
                const stdTransportAbortController = new AbortController();
                const stdtransAbortTimeout =  setTimeout(()=>stdTransportAbortController.abort(),10000);
                const enableRes = await fetch(`${API_URL}/transportHistory/EnableEachStudentTransport`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(stdTransportData),
                    credentials:'include',
                    signal:stdTransportAbortController.signal
                });
                clearTimeout(stdtransAbortTimeout);
                if(!enableRes.ok){
                    if(enableRes.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }
                    throw new Error(`Http error! status: ${enableRes.status}`);
                }
                const resData = await enableRes.json();
                if(resData.success){
                    setStdTransportData(prev=>({
                        ...prev,
                        stdtransportfeestatus:'yes'
                    }));

                    setOpenEnableBox(false);
                }else{
                    alert(`${resData.message}`);
                }
            }else{
                alert('please fill both "transportfrom" and "transport total fee"');
            }

        }catch(err){
            console.log('getting an error while updating the enable transport',err);
        }
        setshowloading(false);
    }

    async function handleUpdateDisableTransport(){
        setshowloading(true);
        try{
            const disableAbortController = new AbortController();
            const disableAbortTimeout = setTimeout(()=>disableAbortController.abort(),10000);
            const disableRes = await fetch(`${API_URL}/transportHistory/DisableEachStudentTransport`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    stdregid:stdTransportData.stdregid
                }),
                credentials:'include',
                signal:disableAbortController.signal
            });
            clearTimeout(disableAbortTimeout);
            const resData = await disableRes.json();
            if(resData.success){
                setStdTransportData(prev=>({
                    ...prev,
                    stdtransportfeestatus:'no',
                    stdtransporttotalfee:0,
                    stdtransportfeepaid:0,
                    stdtransportfrom:'',
                }));
                setOpenDisableBox(false);
            }else{
                alert(`${resData.message}`);
            }
        }catch(err){
            console.log('getting an error while disable the student transport ',err);
            alert('getting error while disabling the transport');
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
                            throw new Error(`Http error! status: ${response.status}`);
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


            fetchCheckOnlyOnce.current = true;
        }
    },[classSections.length,allTownsAndVillages.length,dispatch, navigate]);

    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="enabletransport-con">
                            <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} 
                            style={{width:'fit-content',background:'white',
                                paddingLeft:5,borderRadius:20,
                                marginBottom:10,marginTop:15}}
                                >
                                <KeyboardArrowLeftIcon sx={{fontSize:22}}/>
                                <p>back</p>
                            </div>

                            <h1>update student transport</h1>
                            <div className="enabletransport-input-getstd">
                                <input type='text' value={studentRegId} onChange={(e)=>setStudentRegId(e.target.value)} placeholder="Enter Student RegID..."/>
                                <button onClick={(e)=>handleFetchStudentData(e)}>Get Student</button>
                            </div>
                            {studentError && <small style={{paddingLeft:10,fontSize:'0.7rem',color:'red'}}>{studentError}</small>}

                            {
                                stdTransportData.stdregid!=='' && 
                                <form className="enabletransport-form-con">
                                    <div className="enabletransport-header">
                                        <h1>student details</h1>
                                    </div>
                                    <div className="enabletransport-all-input-fields">
                                        <div className="enabletransport-input-field"> 
                                            <label>class</label>
                                            <input type='text' value={stdTransportData.stdclass} readOnly/>
                                        </div>
                                        <div className="enabletransport-input-field"> 
                                            <label>section</label>
                                            <input type='text' value={handleGetSectionname(stdTransportData.stdsectionid)} readOnly/>
                                        </div>
                                        <div className="enabletransport-input-field"> 
                                            <label>full name</label>
                                            <input type='text' value={`${stdTransportData.stdfirstname} ${stdTransportData.stdmiddlename} ${stdTransportData.stdlastname}`} readOnly/>
                                        </div>
                                        <div className="enabletransport-input-field"> 
                                            <label>transport from</label>
                                            <input type='text' value={stdTransportData.stdtransportfrom?handleGetVillageName(stdTransportData.stdtransportfrom):''} readOnly/>
                                        </div>
                                        <div className="enabletransport-input-field"> 
                                            <label>total transport fee</label>
                                            <input type='text' value={stdTransportData.stdtransporttotalfee?stdTransportData.stdtransporttotalfee:0} readOnly/>
                                        </div>
                                        <div className="enabletransport-input-field"> 
                                            <label>transport fee paid</label>
                                            <input type='number' value={stdTransportData.stdtransportfeepaid?stdTransportData.stdtransportfeepaid:0} readOnly/>
                                        </div>
                                        <div className="enabletransport-input-field"> 
                                            <label>transport total due</label>
                                            <input type='number' value={Number(stdTransportData.stdtransporttotalfee?stdTransportData.stdtransporttotalfee:0)-Number(stdTransportData.stdtransportfeepaid?stdTransportData.stdtransportfeepaid:0)} readOnly/>
                                        </div>
                                    </div>

                                    {
                                        stdTransportData.stdtransportfeestatus!=='yes'?
                                        <div className="enabletransport-enable-btn">
                                            <p>would you like to enable the transport ?</p>
                                            <button onClick={(e)=>handleOpenEnableBox(e)}>Enable</button>
                                        </div>
                                        :
                                        <div className="enabletransport-disable-btn">
                                            <p>would you like to disable the transport ?</p>
                                            <button onClick={(e)=>handleOpenDisableBox(e)}>Disable</button>
                                        </div>
                                    }


                                </form>
                            }

                        </div>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            <Dialog
                open={openEnableBox}
                onClose={handleCloseEnableBox}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        padding: 0, // Remove padding
                        margin: 0,  // Remove margin
                    },
                }}
            >
                <div className="enabletransport-enablebox">
                    <div className="enabletransport-enablebox-closeicon">
                        <CloseIcon sx={{fontSize:20,cursor:'pointer'}} onClick={handleCloseEnableBox}/>
                    </div>
                    <div className="enabletransport-all-input-fields enabletransport-popup-wrap">
                        <div className="enabletransport-input-field"> 
                            <label>transport From</label>
                            {/* <input type='number' value={stdTransportData.stdtransportfeepaid?stdTransportData.stdtransportfeepaid:0} readOnly/> */}
                            <Select value={selectVillage} onChange={handleReactTownSelect} 
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
                                components={{ DropdownIndicator: null }}
                                placeholder="Select town/village"
                                menuPortalTarget={document.body}
                                options={
                                    allTownsAndVillages.map((temptown)=>({
                                        value:temptown.townid,
                                        label:temptown.townname
                                    }))
                                }
                            />
                        </div>
                        <div className="enabletransport-input-field"> 
                            <label>transport total fee</label>
                            <input type='number' value={stdTransportData.stdtransporttotalfee} onChange={(e)=>setStdTransportData(prev=>({
                                ...prev,
                                stdtransporttotalfee:e.target.value
                            }))}/>
                        </div>
                    </div>

                    <div className="enabletransport-all-input-fields">
                        <div className="enabletransport-input-field">
                            <label>Transport Start Date</label>
                            <input type='date' value={stdTransportData.transportstartdate} onChange={(e)=>setStdTransportData(prev=>({
                                ...prev,
                                transportstartdate:e.target.value
                            }))}/>
                        </div>
                    </div>
                    
                    <div className="enabletransport-enablebox-btn">
                        <button onClick={(e)=>handleUpdateEnableTransport(e)}>enable transport</button>
                    </div>
                    
                </div>
            </Dialog>

            {/* disable alert */}
            <Dialog 
            open={openDisableBox}
            onClose={handleCloseDisableBox}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <div className="addsubjecttoclass-form">
                    <p style={{textTransform:'capitalize'}}>Are you sure you want to disable the transport for student with Reg ID <span style={{color:'red'}}>{stdTransportData.stdregid}</span> , <span style={{color:'red'}}>{stdTransportData.stdfirstname} {stdTransportData.stdmiddlename} {stdTransportData.stdlastname}</span>?</p>
                    <div className="addsubjectstoclass0-alert-form-btns">
                        <p onClick={()=>handleUpdateDisableTransport()}>Yes</p>
                        <p onClick={()=>handleCloseDisableBox()}>No</p>
                    </div>
                </div>
            </Dialog>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default EnableTransport;