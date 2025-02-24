import React, { useEffect, useRef, useState } from "react";
import './Addsection.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import { API_URL , socket } from "../../../Data/Docs";
import { useDispatch, useSelector } from "react-redux";
import { addedNewSection, sectionModified, updateSections } from "../../../ReduxStates/Sections";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout } from "../../AllFunctions/Logout";

function Addsection(){
    const[showloading,setShowloading] = useState(false);
    const [sectionData , setSectionData] = useState({
        class:'',
        sectionname:'',
        classteacherid:'',
        schoolstarttime:'',
        Schoolendtime:''
    });

    //edit dialog box

    const [updateAlert,setUpdateAlert] = useState(false);
    const [updateSectionData,setUpdateSectionData] = useState({
        _id:'',
        class:'',
        sectionname:'',
        classteacherid:'',
        schoolstarttime:'',
        Schoolendtime:''
    });
    function handlingOpenUpdateAlert(data){
        setUpdateSectionData(prev=>({
            ...prev,
            ...data
        }));
        setUpdateAlert(true);
    }

    function handlingCloseUpdateAlert(){
        setUpdateSectionData(prev=>({
            ...prev,
            _id:'',
            class:'',
            sectionname:'',
            classteacherid:'',
            schoolstarttime:'',
            Schoolendtime:''
        }));
        setUpdateAlert(false);
    }

    //delete alert
    const [deleteAlert , setDeleteAlert] = useState(false);
    const [deleteData,setDeleteData] = useState({
        _id:'',
        sectionname:'',
        class:''
    });

    function handleOpenDeleteAlert(sectionData){
        setDeleteData(prev=>({
            ...prev,
            ...sectionData
        }));
        setDeleteAlert(true);
    }

    function handleCloseDeleteAlert(){
        setDeleteData(prev=>({
            ...prev,
            _id:'',
            sectionname:'',
            class:''
        }));
        setDeleteAlert(false);
    }


    const navigate = useNavigate();
    const classSections = useSelector((state)=>state.sections.data);
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce = useRef(false);

    async function handleCreateSection(e){
        e.preventDefault();
        setShowloading(true);
        try{
            // console.log('here is the section data: ', sectionData);
            if(sectionData.class!=='' && sectionData.sectionname!==''){
                const response = await fetch(`${API_URL}/sections/addsection`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(sectionData),
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

                const data = await response.json();
                if(data.success){
                    alert('successfully added the section');
                    setSectionData(prev=>({
                        ...prev,
                        sectionname:'',
                        classteacherid:'',
                    }))
                }else{
                    alert('getting error while adding the section');
                }
            }else{
                alert('please fill all the required fields');
            }
        }catch(err){
            console.log('you getting an error while creating the section',err);
        }
        setShowloading(false);
    }

    async function handleUpdateEachSectionName(e){
        e.preventDefault();
        try{
            const response = await fetch(`${API_URL}/sections/editsection`,{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(updateSectionData),
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
            const resData = await response.json();
            if(!resData.success){
                alert('getting an error while updating the section');
            }else{
                setUpdateSectionData(prev=>({
                    ...prev,
                    _id:'',
                    class:'',
                    sectionname:'',
                    classteacherid:'',
                    schoolstarttime:'',
                    Schoolendtime:''
                }));
                setUpdateAlert(false);
            }
        }catch(err){
            console.log('getting an error while updating the section anem',err);
        }
    }

    async function handleDeleteEachSection(){
        try{
            const response = await fetch(`${API_URL}/sections/deletesection/${deleteData._id}`,{
                method:'DELETE',
                headers:{
                    "Content-Type":"application/json"
                },
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
            const resData = await response.json();
            if(!resData.success){
                alert('getting error while deleting the section');
            }else{
                setDeleteData(prev=>({
                    ...prev,
                    _id:'',
                    sectionname:'',
                    class:''
                }));
                setDeleteAlert(false);
                alert('successfully deleted the section');
            }
            
        }catch(err){
            console.error('getting error while deleting the section',err);
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

            fetchCheckOnlyOnce.current = true;
        }

    },[classSections.length,navigate , dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-top-back-btn' style={{marginBottom:5,marginTop:15}} onClick={()=>navigate(-1)} >
                            <KeyboardArrowLeftIcon/>
                            <p>back</p>
                        </div>

                        {/* top box */}
                        <div className="addsection_con" style={{marginTop:10}}>
                            <div className="addsection_header">
                                <p>Add section</p>
                            </div>
                            <div className="addsection_section">
                                <div className="addsection_class_section">
                                    <label>Select Class</label>
                                    <select value={sectionData.class} 
                                    onChange={(e)=>setSectionData(prev=>({
                                        ...prev,
                                        class:e.target.value
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
                                </div>

                                <div className="addsection_class_section">
                                    <label>Add Section Name</label>
                                    <input type="text" value={sectionData.sectionname} 
                                    onChange={(e)=>setSectionData(prev=>({
                                        ...prev,
                                        sectionname:e.target.value
                                    }))}/>
                                </div>

                                <div className="addsection_class_section">
                                    <label>Start Time:</label>
                                    <input type="time" value={sectionData.schoolstarttime}
                                    onChange={(e)=>setSectionData(prev=>({
                                        ...prev,
                                        schoolstarttime:e.target.value
                                    }))}/>
                                </div>

                                <div className="addsection_class_section">
                                    <label>End Time:</label>
                                    <input type="time" value={sectionData.Schoolendtime}
                                    onChange={(e)=>setSectionData(prev=>({
                                        ...prev,
                                        Schoolendtime:e.target.value
                                    }))}/>
                                </div>

                                <div className="addsection_class_section">
                                    <label>Select Class Teacher</label>
                                    <select value={sectionData.classteacherid} onChange={(e)=>setSectionData(prev=>({
                                        ...prev,
                                        classteacherid:e.target.value
                                    }))}>
                                        <option value=''>Select Class Teacher</option>
                                        <option value=''>Class Teacher 1</option>
                                        <option value=''>Class Teacher 2</option>
                                    </select>
                                </div>
                                
                                <div className="addsection_class_section">
                                    <button onClick={(e)=>handleCreateSection(e)}>Save</button>
                                </div>
                            </div>
                        </div>

                        {/* bottom box */}
                        {classSections.filter((item)=>item.class===sectionData.class).length>0 && 
                        <>
                        {/* top path display */}
                        <div className="show-applications-top-path">
                            <p><span>class ' {sectionData.class} '</span></p>
                        </div>
                        <div className="show-application-whole-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>section Name</th>
                                                <th>class teacher</th>
                                                <th>school start time</th>
                                                <th>school end time</th>
                                                <th>actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {classSections.filter((item)=>item.class===sectionData.class).map((item,idx)=>(
                                                <tr key={idx}>
                                                    <td>{item.sectionname}</td>
                                                    <td>{item.classteacherid}</td>
                                                    <td>{item.schoolstarttime}</td>
                                                    <td>{item.Schoolendtime}</td>
                                                    <td>
                                                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:5}}>
                                                            <EditIcon sx={{fontSize:20, color:'#1976d2',cursor:'pointer'}} onClick={()=>handlingOpenUpdateAlert(item)}/>
                                                            <DeleteIcon sx={{fontSize:20, color:'red',cursor:'pointer'}} onClick={()=>handleOpenDeleteAlert(item)}/>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                        </div>
                        </>
                        }
                        
                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            <Dialog
                open={updateAlert}
                onClose={handlingCloseUpdateAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form className="addsection-form">
                    <div style={{display:'flex',flexDirection:'column',
                        justifyContent:'flex-end',alignItems:'flex-end'}}
                        
                    >
                        <CloseIcon sx={{fontSize:22,cursor:'pointer'}} onClick={()=>handlingCloseUpdateAlert()}/>
                    </div>
                    <h1 className="addsection-form-heading">edit section</h1>
                    <div className="addsection-each-div">
                        <label>section name</label>
                        <input type='text' value={updateSectionData.sectionname} 
                        onChange={(e)=>setUpdateSectionData(prev=>({
                            ...prev,
                            sectionname:e.target.value
                        }))}/>
                    </div>
                    <div className="addsection-form-row">
                        <div className="addsection-each-div">
                            <label>school start</label>
                            <input type='time' value={updateSectionData.schoolstarttime}
                            onChange={(e)=>setUpdateSectionData(prev=>({
                                ...prev,
                                schoolstarttime:e.target.value
                            }))}/>
                        </div>
                        <div className="addsection-each-div">
                            <label>school end</label>
                            <input type='time' value={updateSectionData.Schoolendtime}
                            onChange={(e)=>setUpdateSectionData(prev=>({
                                ...prev,
                                Schoolendtime:e.target.value
                            }))}/>
                        </div>
                    </div>
                    <div className="addsection-each-div">
                        <label>class teacher</label>
                        <select value={updateSectionData.classteacherid} 
                        onChange={(e)=>setUpdateSectionData(prev=>({
                            ...prev,
                            classteacherid:e.target.value
                        }))}>
                            <option value=''>select class teacher</option>
                        </select>
                    </div>
                    <button onClick={(e)=>handleUpdateEachSectionName(e)}>Update</button>
                </form>
            </Dialog>

            {/* delete alert */}
            <Dialog
                open={deleteAlert}
                onClose={handleCloseDeleteAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="addsubjecttoclass-form">
                    <p style={{textTransform:'capitalize'}}>are you sure you want to delete the section  <span style={{color:'blue'}}>{deleteData.sectionname}</span> of a class <span style={{color:'red'}}>{deleteData.class}</span> </p>
                    <div className="addsubjectstoclass0-alert-form-btns">
                        <p onClick={()=>handleDeleteEachSection()}>Yes</p>
                        <p onClick={()=>handleCloseDeleteAlert()}>No</p>
                    </div>
                </div>
            </Dialog>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Addsection;