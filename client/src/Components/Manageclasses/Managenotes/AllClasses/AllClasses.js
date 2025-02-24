import React, { useEffect, useRef } from 'react';
import './AllClasses.css';
import Sidenav from '../../../Sidenav/Sidenav';
import Topnav from '../../../Topnav/Topnav';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import Preprimary from '../../Images/preprimary.png';
import Primary from '../../Images/primary.png';
import Prehighschool from '../../Images/prehighschool.png';
import Highschool from '../../Images/highschool.png';
import { API_URL, classes, socket } from '../../../../Data/Docs';
import { useDispatch, useSelector } from 'react-redux';
import { addNewSubjectToClass, deleteSubjectFromClass, storeClassSubjectsData } from '../../../../ReduxStates/Coursesdata/ClassSubjectsData';
import { Logout } from '../../../AllFunctions/Logout';

function AllClasses(){
    const navigate = useNavigate();

    const fetchCheckOnlyOnce = useRef(false);
    const classSubjectsData = useSelector((state)=>state.classsubjectsdata.data);
    const dispatch = useDispatch();

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
            fetchCheckOnlyOnce.current=true;
        }

    },[classSubjectsData.length,navigate, dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}

                        <div className='allclasses-top-navigation'>
                            <p onClick={()=>navigate('/manageclasses')} style={{cursor:'pointer'}}>manage classes</p>
                            <ChevronRightIcon sx={{fontSize:18}}/>
                            <p style={{color:'#1976d2',userSelect:'none'}}>student notes</p>
                        </div>

                        {/* classes */}
                        <div className='allclasses-display-classes'>
                            {
                                classes.map((classdata,idx)=>(
                                    <div className='allclasses-display-classes-each' key={idx} onClick={()=>navigate(`/manageclasses/managenotes/allclasses/${classdata}`)}>
                                        <p>{(classdata==='nursery'||classdata==='LKG'||classdata==='UKG')?classdata:`class ${classdata}`}</p>
                                        <div className='allclasses-each-class-heading'>
                                            <div  className='allclasses-each-class-subject'>
                                                <p>Subjects</p>
                                                <p>{classSubjectsData.filter(item=>item.class===classdata).length<10?`0${classSubjectsData.filter(item=>item.class===classdata).length}`:classSubjectsData.filter(item=>item.class===classdata).length}</p>
                                            </div>
                                            <div className='allclasses-each-class-img'>
                                                <img src={(classdata==='nursery'||classdata==='LKG'||classdata==='UKG')?Preprimary:["1","2","3","4","5"].includes(classdata)?Primary:["6","7","8"].includes(classdata)?Prehighschool:Highschool} alt='classicons'/>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            

                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllClasses;