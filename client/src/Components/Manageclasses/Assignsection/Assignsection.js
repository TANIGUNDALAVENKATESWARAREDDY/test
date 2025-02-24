import React, { useEffect, useRef, useState } from 'react';
import './Assignsection.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, socket } from '../../../Data/Docs';
import { addedNewSection,sectionModified,updateSections } from '../../../ReduxStates/Sections';
import { updateAddNewStudentAssignSectionData, updateAssignSectionClass, updateAssignStudentSection, updateStudentSectionItem } from '../../../ReduxStates/Studentsdata/Assignstudentsec';
import { Logout } from '../../AllFunctions/Logout';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Assignsection(){
    const navigate = useNavigate();
    const classSections = useSelector((state) => state.sections.data);
    const students = useSelector((state)=>state.assignstudentsec.data);
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce = useRef(false);
    const[showloading,setShowloading] = useState(false);

    const [classData , setClassData] = useState({
        class:'',
        section:'NA',
        searchdata:''
    });

    // const [sectionData , setSectionData] = useState('')

    async function handleFetchClassStudentsData(e){
        setShowloading(true);
        try{
           
            const response = await fetch(`${API_URL}/student/getstudentstoassignsection`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    ...classData,
                    class:e.target.value
                }),
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
            const stdData = await response.json();
            if(e.target.value!==''){
                dispatch(updateAssignSectionClass(e.target.value))
            }
            if(stdData && stdData.studentsdata.length>=0){
                dispatch(updateAssignStudentSection(stdData.studentsdata));
            }
            // console.log('here is the data: ',stdData);
        }catch(err){
            console.log('getting an error while fetching the class data',err);
        }
        setShowloading(false);
    }

    async function updateStudentSection(e,student){
        setShowloading(true);
        try{
            const response = await fetch(`${API_URL}/student/updatestudentsection`,{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    ...student,
                    stdsectionid:e.target.value
                }),
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
            if(resData && !resData.success){
                alert('you getting an error while updating the student section');
            }

        }catch(err){
            console.error('getting an error while updating the student section ',err);
        }
        setShowloading(false);
    }

    // console.log('students data',students);

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){


            if(students.length>0){
                setClassData(prev=>({
                    ...prev,
                    class:students[0].stdclass
                }))
            }

            //handling the studnets class listener for newly added students
            const handleUpdateNewlyAddedStudent=(data)=>{
                dispatch(updateAddNewStudentAssignSectionData(data.data));
            }

            if(!socket.hasListeners('assignsectiondataassameclass')){
                // console.log('started listening the sassign student , student data...');
                socket.on('assignsectiondataassameclass',handleUpdateNewlyAddedStudent);
            }

            //handling the students section data
            const handleUpdateSection =(data)=>{
                dispatch(updateStudentSectionItem(data.data));
            }
            
            if(!socket.hasListeners('updatestudentsection')){
                socket.on('updatestudentsection',handleUpdateSection);
            }

            //this is for classes and sections
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

            fetchCheckOnlyOnce.current=true;
        }
    },[classSections.length, dispatch ,navigate, students]);
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

                        <div className="viewstudents-get-allstudents" style={{minHeight:70}} >
                            <div className="viewstudents-getstudents-header">
                                <p>Assign Section To Students</p>
                            </div>

                            <div className='assignsection-select-class-section'>
                                <div className='assignsection-select-class-div'>
                                    <select value={classData.class} onChange={(e)=>{
                                         setClassData(prev=>({
                                            ...prev,
                                            class:e.target.value
                                        }));
                                        handleFetchClassStudentsData(e);
                                    }}>
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
                                </div>
                                <div className='assignsection-select-section-div'>
                                    <select value={classData.section} onChange={(e)=>setClassData(prev=>({
                                        ...prev,
                                        section:e.target.value
                                    }))}>
                                        <option value='NA' disabled>select section</option>
                                        <option value=''>All</option>
                                        {
                                            classSections.filter((item)=>item.class===classData.class).length>0 && classSections.filter((item)=>item.class===classData.class).map((item,idx)=>(
                                                <option key={idx} value={item._id}>{item.sectionname}</option>
                                            ))
                                        }
                                    </select>
                                    <div className='assignsection-search-bar-input'>
                                        <SearchIcon sx={{fontSize:22,color:'gray'}}/>
                                        <input type='text'/>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='assignsection-search-bar-input-inactive'>
                                <SearchIcon sx={{fontSize:22,color:'gray'}}/>
                                <input type='text'/>
                            </div>

                        </div>

                        {/* class sections */}
                        <div className='assignsection-display-sections'> 
                            <div className='assignsection-display-sections-each'>
                                {
                                    classSections.filter((item)=>item.class===classData.class).length>0 && classSections.filter((item)=>item.class===classData.class).map((item,idx)=>(
                                        <p key={idx} style={{whiteSpace:'nowrap'}}>section {item.sectionname} :<span style={{marginLeft:5}}>{students.filter((student)=>student.stdsectionid===item._id).length}</span></p>
                                    ))
                                }
                            </div>
                            <div className='assignsection-display-sections-each'>
                                <p style={{whiteSpace:'nowrap'}}>Total Students: <span style={{marginLeft:5}}>{students.length}</span></p>
                            </div>
                        </div>

                        {/* students table */}
                        {classData.class!=='' && students.length>0 && 
                        <div className='assignsection-display-students-con'>
                            <div className="viewstudents-getstudents-header" style={{borderBottom:'none'}}>
                                <p style={{fontSize:'1rem'}}>Class - {classData.class} students</p>
                            </div>

                            <div className="show-application-whole-inner-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Reg ID</th>
                                            <th>first name</th>
                                            <th>last name</th>
                                            <th>class</th>
                                            <th>section</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length>0 && students.map((student,idx)=>(
                                            <tr key={idx}>
                                                <td>{student.stdregid}</td>
                                                <td>{student.stdfirstname}</td>
                                                <td>{student.stdlastname}</td>
                                                <td>{student.stdclass}</td>
                                                {/* <td>{student.stdsectionid}</td> */}
                                                <td className='assignsection-table-cell-select'>
                                                    <select value={student.stdsectionid} onChange={(e)=>updateStudentSection(e,student)}>
                                                        <option value=''>select section</option>
                                                        {
                                                            classSections.filter((item)=>item.class===classData.class).length>0 && classSections.filter((item)=>item.class===classData.class).map((item,idx)=>(
                                                                <option key={idx} value={item._id}>{item.sectionname}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                            </div>

                        </div>
                        }


                        {/* you code ends here */}
                    </div>
                </div>
            </div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Assignsection;