import React, { useEffect, useState } from "react";
import './Admissions.css';
import Sidenav from "../Sidenav/Sidenav";
import Topnav from "../Topnav/Topnav";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../Data/Docs";
import { updateAdmissionFieldData, updateAllAdmissions, updateSingleAdmission } from "../../ReduxStates/Alladmissions";
import SearchIcon from '@mui/icons-material/Search';
import { socket } from "../../Data/Docs";
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddIcon from '@mui/icons-material/Add';
import { Logout } from "../AllFunctions/Logout";


function Admissions(){
    const allAdmissionsData = useSelector((state)=>state.alladmissions.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [rejectOpen , setRejectOpen] = useState({
        active:false,
        stdname:'',
        appid:''
    });

    const handleRejectClickOpen =(name,appid)=>{//function to open th dialoge box
        setRejectOpen(prev=>({
            ...prev,
            active:true,
            stdname:name,
            appid:appid
        }));
    };

    const handleRejectClickClose = ()=>{//function to close the dialoge box
        setRejectOpen(prev=>({
            ...prev,
            active:false,
            stdname:'',
            appid:''
        }));
    };

    //binary search function to find the element
    function handleBinarySearch(targetId){ //return the object
        let left=0;
        let right=allAdmissionsData.length-1;
        while(left<=right){
            const mid = Math.floor((left+right)/2);
            if(allAdmissionsData[mid].admissionid===targetId){
                return allAdmissionsData[mid];
            }else if(allAdmissionsData[mid].admissionid<targetId){
                right=mid-1;
            }else{
                left=mid+1;
            }
        }
        return null;

    }

    //fucntion to close the admission
    async function handleCloseAdmission(){
        try{
            let updateTempAdm = handleBinarySearch(rejectOpen.appid);
            if(updateTempAdm){
                let modifyadmdata ={
                    ...updateTempAdm,
                    admstatus:'rejected'
                }

                const response = await fetch(`${API_URL}/admissionform//updatingadmissiondata`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(modifyadmdata),
                    credentials:'include'
                });

                if(!response.ok){
                    if(response.status === 401) {
                        alert('Your session is expired,please login again');
                        Logout(dispatch,navigate);
                        throw new Error('Unauthorized - Token expired');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                setRejectOpen(prev=>({
                    ...prev,
                    active:false,
                    stdname:'',
                    appid:''
                }));
            }
        }catch(err){
            console.log('getting an error while closing the admission ',err);
        }

    }



    useEffect(()=>{
        if(allAdmissionsData.length===0){
            //adding listerners when we reading the data . only once when website loads or lreloads 
            const handleAdmissionSingleData = (data)=>{
                dispatch(updateSingleAdmission(data.data));
            };
    
            if(!socket.hasListeners('applicationToAdmission')){
                socket.on('applicationToAdmission',handleAdmissionSingleData);
            }

            //listen the updated admission
            const handleUpdateAdmissionData = (data) =>{
                dispatch(updateAdmissionFieldData(data.data))
            };
            if(!socket.hasListeners('updatingAdmissionData')){
                socket.on('updatingAdmissionData',handleUpdateAdmissionData);
            }
            
            async function fetchAllAdmissions(){//fetching the admissions data
                try{
                    const response = await fetch(`${API_URL}/admissionform/admissionsdata`,{
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
                    const tempAdmissionsData = await response.json();
                    if(tempAdmissionsData.data.length>0){
                        await dispatch(updateAllAdmissions(tempAdmissionsData.data));
                    }
                }catch(err){
                    console.log('you getting an error while fetching admissions data: ',err);
                }
            }
            fetchAllAdmissions();
        }

    },[allAdmissionsData.length,navigate,dispatch]);

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
                            <p>Home - <span>All admissions</span></p>
                        </div>

                        <div className="admissions-add-ol-admissions">
                            <div onClick={()=>navigate(-1)} style={{color:'blue'}}>
                                <KeyboardArrowLeftIcon sx={{fontSize:'1.1rem'}}/>
                                <p>back</p>
                            </div>
                            <div onClick={()=>navigate('/manageadmissions/admissions/oldadmissionform')}>
                                <AddIcon sx={{fontSize:'1.1rem'}}/>
                                <p>existing admission</p>
                            </div>
                        </div>

                        {/* displaying the all admissions */}
                        <div className="show-applications-whole-table">
                            <div className="show-application-top-header">
                                <p>All Admissions</p>
                                <div className="show-application-search-bar">
                                    <SearchIcon sx={{color:'gray',fontSize:20}}/>
                                    <input/>
                                </div>
                            </div>

                            {allAdmissionsData.length>0 && 
                                <div className="show-application-whole-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Application Id</th>
                                                <th>admission status</th>
                                                <th>first name</th>
                                                <th>last name</th>
                                                <th>Gender</th>
                                                <th>parent name</th>
                                                <th>class</th>
                                                <th>mobile</th>
                                                <th>student reg.id</th>
                                                <th>parent reg.id</th>                                            
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allAdmissionsData.map((item,idx)=>(
                                                    <tr key={idx}>
                                                        <td>{item.admissionid}</td>
                                                        <td>
                                                            {item.admstatus==='approved'?
                                                            <p className="admission-admstatus-completed">{item.admstatus}</p>:
                                                            item.admstatus==='pending'?
                                                            <p className="admission-admstatus-pending">{item.admstatus}</p>:
                                                            <p className="admission-admstatus-rejected">{item.admstatus}</p>
                                                            }
                                                        </td>
                                                        <td style={{whiteSpace:'nowrap'}}>{item.studentname}</td>
                                                        <td>{item.surname}</td>
                                                        <td>{item.gender}</td>
                                                        <td style={{whiteSpace:'nowrap'}}>{item.fathername}</td>
                                                        <td>{item.class}</td>
                                                        <td>{item.mobileno}</td>
                                                        <td>{item.stdregid===''?'-':item.stdregid}</td>
                                                        <td>{item.parentregid===''?'-':item.parentregid}</td>
                                                        <td>
                                                            <div className="admissions-actions">
                                                                {item.admstatus==='pending' && <AddCircleOutlineIcon sx={{color:'#0044f2',fontSize:20,cursor:'pointer'}} titleAccess="create" onClick={()=>navigate(`/manageadmissions/admissionform/${item.admissionid}`)}/>}
                                                                {item.admstatus==='pending' && <DoDisturbOnIcon sx={{color:'red',fontSize:20,cursor:'pointer'}} titleAccess="rejected" onClick={()=>handleRejectClickOpen(item.studentname,item.admissionid)}/>}
                                                                {item.admstatus==='rejected' && <DeleteOutlineIcon sx={{color:'red',fontSize:20,cursor:'pointer'}}/>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>



                        {/* // your code ends here \\ */}
                    </div>
                </div>
            </div>
            <Dialog
                open={rejectOpen.active}
                onClose={handleRejectClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{fontSize:'0.9rem'}}>
                {`Are you sure you want to close the admission for '`}<Typography component="span" sx={{fontWeight:'700'}}>{rejectOpen.stdname}</Typography>{`' with Application ID '`}<Typography component="span" sx={{fontWeight:'700'}}>{rejectOpen.appid}</Typography>{`'?`}
                </DialogTitle>
                
                <DialogActions>
                <Button onClick={handleRejectClickClose} sx={{fontSize:'0.8rem'}}>Disagree</Button>
                <Button onClick={()=>handleCloseAdmission()} autoFocus sx={{fontSize:'0.8rem'}}>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Admissions;