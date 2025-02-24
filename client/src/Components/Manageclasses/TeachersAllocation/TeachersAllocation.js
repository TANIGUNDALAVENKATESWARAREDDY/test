import React, { useEffect, useRef, useState } from "react";
import './TeachersAllocation.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from "react-redux";
import { storeAllCoursesData, updateAddNewCourseData } from "../../../ReduxStates/Coursesdata/AllCoursesData";
import { API_URL, socket } from "../../../Data/Docs";
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Select from "react-select";
import { storeAllTeachersData } from "../../../ReduxStates/Teachersdata/Teachersdata";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { addNewTeacherToSubject, deleteAddedTeacherOfSubject, storeAllSubjectTeachersData } from "../../../ReduxStates/Coursesdata/subjectTeachersData";
import { Logout } from "../../AllFunctions/Logout";

function TeachersAllocation(){
    const navigate = useNavigate();
    const [showloading,setShowloading] = useState(false);
    const fetchCheckOnlyOnce = useRef(false);
    const allCoursesData = useSelector((state)=>state.allcoursesdata.data); //all courses data
    const AllTeachersData = useSelector((state)=>state.teachersdata.data); // all teachers data
    const AllSubjectTeachers = useSelector((state)=>state.subjectteachersdata.data); //all subject treachers
    const dispatch = useDispatch();

    const[subteacherData,setSubteacherData] = useState({
        subjectid:'',
        teacherid:'',

    });

    const [selectTeachetData,setSelectTeacherData] = useState({
        label:'Select Teacher',
        value:''
    });
    //get delete data
    const [deleteData,setDeleteData] = useState({
        subjectid:'',
        teacherid:''
    });
    // const [tempSelectTeacherData , setTempSelectTeacherData] = useState('');
    
    const[formBox , setFormBox] = useState(false);

    function handleOpenFormBox(e,tempData){
        e.preventDefault();
        setSubteacherData(prev=>({
            ...prev,
            subjectid:tempData.courseuid,
        }));
        setFormBox(true);

    }

    function handleCloseFormBox(){
        setFormBox(false);
        setSubteacherData(prev=>({
            ...prev,
            subjectid:'',
            teacherid:''
        }));
        setSelectTeacherData({//when closing the form resting the teachers data
            label:'select teacher',
            value:''
        })
    }

    //delete function alert
    const[deleteAlert,setDeleteAlert] = useState(false);

    function handleOpenDeleteAlert(tempData){
        // console.log(tempData);
        setDeleteAlert(true);
        setDeleteData(prev=>({
            ...prev,
            subjectid:tempData.subjectid,
            teacherid:tempData.teacherid
        }));
    }

    function handleCloseDeleteAlert(){
        setDeleteAlert(false);
        setDeleteData(prev=>({
            ...prev,
            subjectid:'',
            teacherid:''
        }));
    }
    async function deleteAddedSubjectTeacher(){
        setShowloading(true);
        setDeleteAlert(false);
        try{
            if(deleteData.subjectid!=='' && deleteData.teacherid!==''){
                const response = await fetch(`${API_URL}/subjectTeachers/deleteSubjectTeacher/${deleteData.subjectid}/${deleteData.teacherid}`,{
                    method:'DELETE',
                    headers:{
                        "Content-type":"application/json"
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
                    alert('getting error while deleting the teacher');
                }
            }
        }catch(err){
            console.log('getting an error while deleting the subject teacher',err);
        }
        setShowloading(false);
    }
    

    //delete function ends here

    const handleChange = (option) => {
        // setSelectedOption(option);
        // console.log('option data', option);

        setSubteacherData(prev=>({
            ...prev,
            teacherid:option.value
        }));
        setSelectTeacherData(prev=>({ //select teacher changing the data
            ...prev,
            ...option
        }));
    };

    async function addTeacher(e){//adding the teacher to subject
        e.preventDefault();
        setShowloading(true);
        try{
            if(subteacherData.subjectid!=='' && subteacherData.teacherid!==''){
                setFormBox(false);
                const response = await fetch(`${API_URL}/subjectTeachers/addSubjectTeacher`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(subteacherData),
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
                    alert(`${resData.message}`);
                }else{
                    setSubteacherData(prev=>({//here we are clearing the data
                        ...prev,
                        subjectid:'',
                        teacherid:''
                    }));
                    setSelectTeacherData({//select teacher reseting the data
                        label:'select teacher',
                        value:''
                    });
                }
            }else{
                alert('please fill all required fields');
            }
        }catch(err){
            console.log('getting while adding the teacher',err);
            alert('error while adding teacher');
        }
        setShowloading(false);
    }

    function getSubjectName(subID){//send the subject name
        const subjectname = allCoursesData.find(item=>item.courseuid===subID);
        return subjectname?subjectname.coursename:'no subject';
    }

    function getTeacherFullName(teacherID){//send the teachers name
        const teachersname = AllTeachersData.find(item=>item.teacherregid===teacherID);
        return teachersname?`${teachersname.teacherfirstname} ${teachersname.teachersmiddlename} ${teachersname.teacherslastname}`:'teacher not found';
    }


    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

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

            if(AllTeachersData.length===0){ //get all teachers data here
                async function fetchAllTeachersData(){
                    try{
                        // console.log('fetcing the teachers data');
                        const response = await fetch(`${API_URL}/teachers/getallteachers`,{
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
                        if(resData.success){
                            // console.log('teachers Data',resData);
                            dispatch(storeAllTeachersData(resData.teachersdata));
                        }
                    }catch(err){
                        console.log('getting an error while fetching teachers data',err);
                    }
                }
                fetchAllTeachersData();
            }

            if(AllSubjectTeachers.length===0){
                const handleAddNewSubjectTeacher =(data)=>{
                    dispatch(addNewTeacherToSubject(data.data));
                }
                if(!socket.hasListeners('addnewsubjectteacher')){
                    socket.on('addnewsubjectteacher',handleAddNewSubjectTeacher);
                }

                const handleDeleteAddedSubjectTeacher =(data)=>{
                    dispatch(deleteAddedTeacherOfSubject(data.data));
                }
                if(!socket.hasListeners('deleteAddedSubjectTeacher')){
                    socket.on('deleteAddedSubjectTeacher',handleDeleteAddedSubjectTeacher);
                }
                async function fetchAllSubjectTeacher(){
                    try{
                        const response = await fetch(`${API_URL}/subjectTeachers/getAllSubjectTeachers`,{
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
                        if(resData.success){
                            dispatch(storeAllSubjectTeachersData(resData.allSubTeachersData))
                        }else{
                            alert(`${resData.message}`);
                        }
                    }catch(err){
                        console.log('getting an error while fetching all subject teachers data',err);
                    }
                }
                fetchAllSubjectTeacher();
            }

            


            fetchCheckOnlyOnce.current=true;
        }
    },[allCoursesData.length, AllTeachersData.length , AllSubjectTeachers.length,navigate, dispatch]);
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

                        <h2 className="teachersallocation-heading">teachers Allocation</h2>

                        <div className="teachersallocation-all-subjects">
                            {
                                allCoursesData.map((subject,idx)=>(
                                    <div className="teachersallocation-subject-teachers" key={idx}>
                                        <div className="teacherallocation-subject-addbtn">
                                            <p>{subject.coursename}</p>
                                            <button onClick={(e)=>handleOpenFormBox(e,subject)} style={{cursor:'pointer'}}>+ Add Teacher</button>
                                        </div>

                                        <div className="teachersallocation-display-teachers">

                                            {AllSubjectTeachers.filter((tempitem)=>tempitem.subjectid===subject.courseuid).map((teachers,idx)=>(
                                                <div className="teachersallocation-each-teacher" key={idx}>
                                                    <p>{getTeacherFullName(teachers.teacherid)}</p>
                                                    <CloseIcon sx={{fontSize:20,color:'red',cursor:'pointer'}} onClick={()=>handleOpenDeleteAlert(teachers)}/>
                                                </div>
                                            ))}
                                            
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            <Dialog
                open={formBox}
                onClose={handleCloseFormBox}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form className="allchapters-addchapter-form" style={{overflow:'hidden'}}>
                    <div style={{display:'flex',flexDirection:'column',
                        justifyContent:'flex-end',alignItems:'flex-end'}}
                        
                    >
                        <CloseIcon sx={{fontSize:22,cursor:'pointer'}} onClick={()=>handleCloseFormBox()}/>
                    </div>
                    <h2>Add Teacher To Subject</h2>
                    <div>
                        <label>subject</label>
                        <input type='text' value={getSubjectName(subteacherData.subjectid)}  readOnly/> 
                    </div>
                    <div >
                        <label>teacher</label>
                        <Select
                            value={selectTeachetData}
                            onChange={handleChange}
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
                            options={AllTeachersData.map((teacher)=>({
                                value:teacher.teacherregid,
                                label:`${teacher.teacherfirstname} ${teacher.teachersmiddlename} ${teacher.teacherslastname}`
                            }))}
                            components={{ DropdownIndicator: null }}
                            placeholder="Select an option"
                            menuPortalTarget={document.body}
                        />
                    </div>
                    <button onClick={(e)=>addTeacher(e)}>add</button>
                </form>
            </Dialog>


            <Dialog
                open={deleteAlert}
                onClose={handleCloseDeleteAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="addsubjecttoclass-form">
                    <p style={{textTransform:'capitalize'}}>are you sure you want to delete teacher
                        <span style={{color:'red',marginLeft:10,marginRight:10}}>"{getTeacherFullName(deleteData.teacherid)}"</span> of a subject <span style={{color:'red',marginLeft:10,marginRight:5}}>"{getSubjectName(deleteData.subjectid)}"</span> ?</p>
                    <div className="addsubjectstoclass0-alert-form-btns">
                        <p onClick={()=>deleteAddedSubjectTeacher()}>Yes</p>
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

export default TeachersAllocation;