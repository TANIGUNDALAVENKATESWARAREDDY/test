import React, { useEffect, useRef, useState } from "react";
import './AddSubjectsToClass.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import CloseIcon from '@mui/icons-material/Close';
import { API_URL, classes, socket } from "../../../Data/Docs";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import Dialog from '@mui/material/Dialog';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { storeAllCoursesData, updateAddNewCourseData } from "../../../ReduxStates/Coursesdata/AllCoursesData";
import { addNewSubjectToClass, deleteSubjectFromClass, 
storeClassSubjectsData } from "../../../ReduxStates/Coursesdata/ClassSubjectsData";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout } from "../../AllFunctions/Logout";

function AddSubjectsToClass(){
    const navigate = useNavigate();

    const[showloading,setShowloading] = useState(false);
    const [subjectData , setSubjectData] = useState({
        class:'',
        subjectid:''
    });

    const [alertSubjectData,setAlertSubjectData] = useState({
        alertclass:'',
        alertsubjectid:''
    });

    // const [classSubjects,setClassSubjects] = useState([]);

    const fetchCheckOnlyOnce = useRef(false);
    const allCoursesData = useSelector((state)=>state.allcoursesdata.data); // courses data
    const dispatch = useDispatch();

    const classSubjectsData = useSelector((state)=>state.classsubjectsdata.data);//class subjects data


    const [open, setOpen] = useState(false);// by default to close the form
    const[openAlert,setOpenAlert] = useState(false);//by default alert form will be closed
    
    //functions handle the adding subjects
    const handleClickOpen = (e,cls) => {//function to open the form
        e.preventDefault();
        setSubjectData(prev=>({
            ...prev,
            class:cls
        }));
        setOpen(true);
    };

    const handleClose = () => { // function to close the form
        setSubjectData(prev=>({
            ...prev,
            class:'',
            subjectid:''
        }))
        setOpen(false);
    };

    //functions handling the alert form
    const handleClickOpenAlert = (classname, subjectid)=>{
        setAlertSubjectData(prev=>({
            ...prev,
            alertsubjectid:subjectid,
            alertclass:classname
        }));
        setOpenAlert(true);
    }

    const handleClickCloseAlert = () =>{
        setAlertSubjectData(prev=>({
            ...prev,
            alertsubjectid:'',
            alertclass:''
        }))
        setOpenAlert(false);
    }

    async function handleAddSubjectToClass(e){ //add subject to class
        e.preventDefault();
        setShowloading(true);
        try{
            const response = await fetch(`${API_URL}/classSubjects/addSubjectToClass`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(subjectData),
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

            const resdata = await response.json();
            console.log('here is the response data', resdata);
            if(resdata.success){
                console.log('successfully added the data');
                setSubjectData(prev=>({
                    ...prev,
                    class:'',
                    subjectid:''
                }))
                setOpen(false);
            }else{
                alert('sorry getting error while uploading the subject');
            }
        }catch(err){
            console.log('getting an error while adding the subject to class');
            alert('error while adding subject');
        }
        setShowloading(false);

    }

    async function DeleteASubjectToClass(){
        setShowloading(true);
        try{
            // console.log('here is the class and subject',classname,subjectid);
            const response = await fetch(`${API_URL}/classSubjects/deleteaclasssubject/${alertSubjectData.alertclass}/${alertSubjectData.alertsubjectid}`,{
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
            const resdata = await response.json();
            if(resdata.success){
                console.log('successfully deleted the subject');
                setOpenAlert(false);
                setAlertSubjectData(prev=>({
                    ...prev,
                    alertclass:'',
                    alertsubjectid:''
                }));
            }else{
                alert('getting an error while deleting the subject');
            }
        }catch(err){
            console.log('getting an error while deleting the subject of a class',err);
        }
        setShowloading(false);
    }
    

    function getSubjectName(subID){//send the subject name
        const subjectname = allCoursesData.find(item=>item.courseuid===subID);
        return subjectname?subjectname.coursename:'no subject';
    }


    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            
            if(classSubjectsData.length===0){

                const handleDeleteSubjectFromClass = (data) =>{
                    dispatch(deleteSubjectFromClass(data.data));
                }

                if(!socket.hasListeners('deleteasubjectfromclass')){
                    socket.on('deleteasubjectfromclass',handleDeleteSubjectFromClass);
                }

                const handleAddNewSubjectToClass = (data) =>{
                    dispatch(addNewSubjectToClass(data.data));
                }

                if(!socket.hasListeners('addednewsubjecttoclass')){
                    socket.on('addednewsubjecttoclass',handleAddNewSubjectToClass);
                }

                async function handleFetchAllClassSubjects(){
                    try{
                        const response = await fetch(`${API_URL}/classSubjects/getAllClassesSubjects`,{
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
                        const resdata = await response.json();
                        // console.log('here is the response data: ',resdata);
                        if(resdata.success){
                            // setClassSubjects(resdata.classsubjects);
                            dispatch(storeClassSubjectsData(resdata.classsubjects));
                        }else{
                            dispatch(storeClassSubjectsData([]));
                        }
                    }catch(err){
                        console.log('getting while fetching classes subjects',err);
                    }
                }
                handleFetchAllClassSubjects();
            }
            
            if(allCoursesData.length===0){// mange courses fetching and modifiying data

                const handleUpdateNewCourse = (data) =>{
                    dispatch(updateAddNewCourseData(data.data));
                }

                if(!socket.hasListeners('addednewcourse')){
                    socket.on('addednewcourse',handleUpdateNewCourse);
                }

                async function handleFetchAllCoursesData(){
                    try{
                        const response = await fetch(`${API_URL}/courses/getallcourses`,{
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
                        const resdata = await response.json();
                        if(resdata.success){
                            dispatch(storeAllCoursesData(resdata.allcourses))
                        }

                    }catch(err){
                        console.log('getting an error while fetching all courses data',err);
                    }
                }

                handleFetchAllCoursesData()
            }

            fetchCheckOnlyOnce.current=true;
        }
        
    },[allCoursesData.length,classSubjectsData.length,navigate,dispatch]);




    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        
                        <div className="addSubjectsToClass-container">
                            <div className='admissionform-top-back-btn' style={{marginBottom:5,paddingTop:20,paddingLeft:10}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>
                            {/* heading */}
                            <h2 className="addSubjectsToClass-heading">Add Subjects to class</h2>

                            <div className="addsubjectstoclass-table-container">
                                <table>
                                    <thead>
                                        <tr className="addsubjectstoclass-thead-row">
                                            <th >
                                                <div>Class</div>
                                            </th>
                                            <th>
                                                <div>
                                                    subjects
                                                </div>
                                            </th>
                                            <th style={{maxWidth:200,minWidth:120}}>
                                                <div>add</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            classes.map((item,idx)=>(
                                                <tr className="addsubjectstoclass-tbody-row" key={idx}>
                                                    <td className="addsubjectstoclass-tbody-row-first">
                                                        <div>{(item==='nursery'||item==='LKG'||item==='UKG')===true?item:`class ${item}`}</div>
                                                    </td>
                                                    <td className="addsubjectstoclass-tbody-middle">
                                                        {
                                                            allCoursesData.length>0 && classSubjectsData.length>0 &&
                                                            classSubjectsData.filter((classitem)=>classitem.class===item).map((subject,idx)=>(
                                                                <div key={idx}>
                                                                    <div onClick={()=>handleClickOpenAlert(item,subject.subjectid)} 
                                                                    style={{
                                                                        display:'flex',
                                                                        flexDirection:'column',alignItems:'center',
                                                                        justifyContent:'center'}}>
                                                                        <CloseIcon  style={{fontSize:18,cursor:'pointer',color:'red'}}/>
                                                                    </div>
                                                                    <p>{getSubjectName(subject.subjectid)}</p>
                                                                </div>
                                                            ))
                                                        }
                                                        
                                                        
                                                    </td>
                                                    <td className="addsubjectstoclass-tbody-row-btn">
                                                        <button onClick={(e)=>handleClickOpen(e,item)} >+ Add Subject</button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            {/* dialog box */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="addsubjecttoclass-form">
                    <div className="addsubjecttoclass-form-close" >
                        <div style={{width:'fit-content'}} onClick={()=>handleClose()}>
                            <CloseIcon  sx={{fontSize:22,cursor:'pointer'}}/>
                        </div>
                        
                    </div>
                    <h2 style={{textAlign:'center',fontSize:'1.1rem',textTransform:'capitalize',fontWeight:500,marginBottom:20,color:'#042954'}}>add new subject</h2>
                    <div className="addsubjecttoclass-form-inner">
                        <div>
                            <label>Class</label>
                            <input type="text" value={(subjectData.class==='nursery'||subjectData.class==='LKG'||subjectData.class==='UKG')===true?subjectData.class:`class ${subjectData.class}`} readOnly/>
                        </div>
                        <div>
                            <label>subject</label>
                            <select value={subjectData.subjectid} onChange={(e)=>setSubjectData(prev=>({
                                ...prev,
                                subjectid:e.target.value
                            }))}>
                                <option value='' disabled>select subject</option>
                                {
                                    allCoursesData.map((courses,idx)=>(
                                        <option key={idx} value={courses.courseuid} style={{textTransform:'capitalize'}} >{courses.coursename}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="addsubjectstoclass-form-submit">
                        <button onClick={(e)=>handleAddSubjectToClass(e)} style={{cursor:'pointer'}}>submit</button>
                    </div>
                </div>
                
                
            </Dialog>

            <Dialog
                open={openAlert}
                onClose={handleClickCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="addsubjecttoclass-form">
                    <p style={{textTransform:'capitalize'}}>are you sure you want to delete 
                        <span style={{color:'red',marginLeft:10,marginRight:10}}>"{getSubjectName(alertSubjectData.alertsubjectid)}"</span> from <span style={{color:'red',marginLeft:10,marginRight:5}}>"class 
                            {alertSubjectData.alertclass}"</span> ?</p>
                    <div className="addsubjectstoclass0-alert-form-btns">
                        <p onClick={()=>DeleteASubjectToClass()}>Yes</p>
                        <p onClick={()=>handleClickCloseAlert()}>No</p>
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

export default AddSubjectsToClass;