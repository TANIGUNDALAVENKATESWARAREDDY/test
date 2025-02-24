import React, { useEffect, useRef, useState } from "react";
import './Viewstudents.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL , socket} from "../../../Data/Docs";
import { updateSections , sectionModified , addedNewSection } from "../../../ReduxStates/Sections";
import { updateGetStudentClassAndSection, updateGetStudentsData, updateGetStudentsSingleData } from "../../../ReduxStates/Studentsdata/Getstudents";
import { Logout } from "../../AllFunctions/Logout";

function Viewstudents(){
    const navigate = useNavigate();
    const fetchCheckOnlyOnce = useRef(false);

    //sections data
    const classSections = useSelector((state)=>state.sections.data);
    const dispatch = useDispatch();

    //get students data
    const getStudents = useSelector((state)=>state.getstudents.data);

    const [getClassInfo , setGetClassInfo] = useState({
        class:'',
        section:''
    });

    const [tempClassInfo , setTempClassInfo] = useState({
        class:'',
        section:''
    });

    async function handleGetAllStudentsData(e){
        e.preventDefault();
        try{

            if(getClassInfo.class!=='' && getClassInfo.section!==''){
                setTempClassInfo(prev=>({
                    ...prev,
                    class:getClassInfo.class,
                    section:getClassInfo.section
                }));
                dispatch(updateGetStudentClassAndSection(getClassInfo));

                const response = await fetch(`${API_URL}/student/getstudents`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(getClassInfo),
                    credentials:'include'
                });

                if(response.status === 401) {
                    alert('Your session is expired,please login again');
                    Logout(dispatch,navigate);
                    throw new Error('Unauthorized - Token expired');
                }

                const resData = await response.json();
                if(resData.success){
                    dispatch(updateGetStudentsData(resData.studentsdata));
                    
                }else{
                    alert('getting an error while fetchin the students data');
                }
            }else{
                alert(`please enter ${getClassInfo.class==='' ?'class field':''} ${getClassInfo.section===''?'section field':''}`)
            }
            
        }catch(err){
            console.log('getting error while fetching the students data :',err);
            alert('getting error while fetching students data');
        }
    }

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            //listensers for the getstudents
            const handleGetStudentsListenersdata = (data)=>{
                dispatch(updateGetStudentsSingleData(data.data));
            }

            if(!socket.hasListeners('updategetstudentdata')){
                socket.on('updategetstudentdata',handleGetStudentsListenersdata);
            }

            //class info section
            if(getStudents.length>0){
                setTempClassInfo(prev=>({
                    ...prev,
                    class:getStudents[0].stdclass,
                    section:getStudents[0].stdsectionid
                }));

                setGetClassInfo(prev=>({
                    ...prev,
                    class:getStudents[0].stdclass,
                    section:getStudents[0].stdsectionid
                }))
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
                        if(response.status === 401) {
                            alert('Your session is expired,please login again');
                            Logout(dispatch,navigate);
                            throw new Error('Unauthorized - Token expired');
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
    },[classSections.length,dispatch ,navigate, getStudents]);
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
                            <p>Home - <span>view students</span></p>
                        </div>

                        <div className="viewstudents-student-regid-link">
                            <p onClick={()=>navigate('/viewstudents/findstudent')}>student with regID {`>`}</p>
                        </div>

                        {/* get all students based on class on section */}
                        <div className="viewstudents-get-allstudents">
                            <div className="viewstudents-getstudents-header">
                                <p>Get Students</p>
                            </div>

                            <div className="viewstudents-choose-class-and-section">
                                <div className="viewstudents-choose-class-each">
                                    <label>select class</label>
                                    <select value={getClassInfo.class} onChange={(e)=>setGetClassInfo(prev=>({
                                        ...prev,
                                        class:e.target.value
                                    }))}>
                                        <option value=''>select class</option>
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

                                <div className="viewstudents-choose-class-each">
                                    <label>select section</label>
                                    <select value={getClassInfo.section} onChange={(e)=>setGetClassInfo(prev=>({
                                        ...prev,
                                        section:e.target.value
                                    }))}>
                                        <option value=''>select section</option>
                                        {classSections.filter((item)=>item.class===getClassInfo.class).map((item,idx)=>(
                                            <option key={idx} value={item._id}>{item.sectionname}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="viewstudents-choose-class-each">
                                    {/* <label>button</label> */}
                                    <button onClick={(e)=>handleGetAllStudentsData(e)}>get students</button>
                                </div>
                            </div>
                        </div>

                        {/* inner students table */}
                        <div className="viewstudents-show-students-table">
                            {/* viewstudents heaader */}
                            <div className="viewstudents-show-students-header">
                                <p>class : <span>{tempClassInfo.class}</span></p>
                                <p>section: <span>{(classSections.length>0 && classSections.filter((item)=>item._id===tempClassInfo.section).length>0)?
                                classSections.filter((item)=>item._id===tempClassInfo.section)[0].sectionname:''
                                }</span></p>
                            </div>

                            {/* here is the students table */}
                            <div className="show-application-whole-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>reg ID</th>
                                                <th>first name</th>
                                                <th>last name</th>
                                                <th>Gender</th>
                                                <th>class</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getStudents.length>0 && getStudents.map((student,idx)=>(
                                                <tr key={idx} onClick={()=>navigate(`/viewstudents/${student.stdregid}`)}>
                                                    <td>{student.stdregid}</td>
                                                    <td>{student.stdfirstname}</td>
                                                    <td>{student.stdlastname}</td>
                                                    <td>{student.stdgender}</td>
                                                    <td>{student.stdclass}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                        {
                            tempClassInfo.class!=='' && tempClassInfo.section!=='' && getStudents.length===0 &&
                            <p style={{textAlign:'center',
                                textTransform:'capitalize',
                                marginTop:15,
                                fontSize:'0.9rem',fontWeight:500
                            }}>no results</p>
                        }
                        

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Viewstudents;