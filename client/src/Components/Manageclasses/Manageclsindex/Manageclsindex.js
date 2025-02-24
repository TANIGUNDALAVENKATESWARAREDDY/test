import React, { useRef ,useEffect} from "react";
import './Manageclsindex.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL , socket} from "../../../Data/Docs";
import addsection from "../../../Assets/Add section.png";
import addsectiontostudent from "../../../Assets/add section to student.png";
import banner from "../../../Assets/classroom management  banner.png"
import { updateSections , sectionModified , addedNewSection} from "../../../ReduxStates/Sections";
import coursemanagement from "../../../Assets/course_management.png";
import managetimetable from "../../../Assets/manage_timetable.png";
import notes from "../../../Assets/student notes.png";
import grading from "../../../Assets/grading.png";
import addsubtocls from "../../../Assets/add subject to class.png";
import Allocateteacher from '../Images/create teacher.png';
import { Logout } from "../../AllFunctions/Logout";

function Manageclsindex(){
    const navigate = useNavigate();

    const fetchCheckOnlyOnce = useRef(false);
    const classSections = useSelector((state)=>state.sections.data);
    const dispatch = useDispatch();

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
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        if(!response.ok){
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
    },[classSections.length,navigate,dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container' style={{paddingBottom:20}}>
                        {/* // write your code here \\ */}

                        <div className="managefee_banner">
                            <img src={banner} alt="banner"></img>
                            <div className="managefee_text-overlay">Classroom Management</div>
                        </div>

                        {/* all features box */}
                        <div className="managefee_con">
                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/addsection')}>
                                <div className="managefee_image">
                                    <img src={addsection} alt="feeImage"></img>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Add Sections</h5>
                                </div>
                            </div>
                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/assignsection')}>
                               
                                    <div className="managefee_image">
                                        <img src={addsectiontostudent} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>Add Sections to Students</h5>
                                    </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/managecourses')}>
                               
                                    <div className="managefee_image">
                                        <img src={coursemanagement} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>Manage Courses</h5>
                                    </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/addsubjectstoclass')}>
                               
                                    <div className="managefee_image">
                                        <img src={addsubtocls} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>Add Subjects to classes</h5>
                                    </div>
                            </div>

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/managetimetable/viewtimetable')}>
                               
                                    <div className="managefee_image">
                                        <img src={managetimetable} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>View Timetable</h5>
                                    </div>
                            </div> 

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/managetimetable/createtimetable')}>
                               
                                    <div className="managefee_image">
                                        <img src={managetimetable} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>Create Timetable</h5>
                                    </div>
                            </div> 
                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/managenotes/allclasses')}>
                               
                                    <div className="managefee_image">
                                        <img src={notes} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>Student Notes</h5>
                                    </div>
                            </div> 
                            <div className="managefee_feefeature">
                               
                                    <div className="managefee_image">
                                        <img src={grading} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>Student Grading</h5>
                                    </div>
                            </div> 

                            <div className="managefee_feefeature" onClick={()=>navigate('/manageclasses/teachersallocation')}>
                               
                                    <div className="managefee_image">
                                        <img src={Allocateteacher} alt="feeImage"></img>
                                    </div>
                                    <div className="managefee_heading">
                                        <h5>Teachers Allocation</h5>
                                    </div>
                            </div>
                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Manageclsindex;