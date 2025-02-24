import React from "react";
import './Eachstudent.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import avgmarks from "../../../Assets/average marks.png"
import profilepic from "../../../Assets/dupilcatepic.PNG"
import attendance from "../../../Assets/attendance.png"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function Eachstudent() {
    return (
        <>
            <div className='staffdashboard-con'>
                <Sidenav />
                <div className='staffdashboard-inner'>
                    <Topnav />
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}

                        <div className="eachstudent_maincon">
                            <div className="eachstudent_leftcon">
                                <div className="eachstudent_con">
                                    <div className="eachstudent_marks_attendance">
                                        <div className="eachstudent_overallmarks">
                                            <div className="eachstudent_marksheading">
                                                <p>Over all Marks</p>
                                                <KeyboardArrowRightIcon />
                                            </div>
                                            <div className="eachstudent_marks">
                                                <div className="eachstudent_avgmarks">
                                                    <img src={avgmarks} alt="over all marks"></img>
                                                    <p>Average on every test score</p>
                                                </div>
                                                <div className="eachstudent_allmarks">
                                                    <div className="eachstudent_assignments">
                                                        <p>Assignments</p>
                                                        <h4>08</h4>
                                                    </div>
                                                    <div className="eachstudent_assignments">
                                                        <p>Unit Tests</p>
                                                        <h4>08</h4>
                                                    </div>
                                                    <div className="eachstudent_assignments">
                                                        <p>OBJ Test</p>
                                                        <h4>08</h4>
                                                    </div>
                                                    <div className="eachstudent_assignments">
                                                        <p>Half Year</p>
                                                        <h4>08</h4>
                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                    <div className="eachstudent_attendance_fee">
                                        <div className="eachstudent_attendance_section">
                                            <div className="eachstudent_overall_attendance">
                                                <p>Over all Attendance</p>
                                                <KeyboardArrowRightIcon />
                                            </div>
                                            <div className="eachstudent_attendance">
                                                <div className="eachstudent_attendance_img">
                                                    <img src={attendance} alt="attendance graph"></img>
                                                </div>
                                                <div className="eachstudent_attendance_percentage">
                                                    <p>Class Attended</p>
                                                    <h3>75%</h3>
                                                    <p>Absent</p>
                                                    <h3>25%</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="eachstudent_fee_section">
                                            <div className="eachstudent_overall_fee">
                                                <p>Fee Details</p>
                                                <KeyboardArrowRightIcon />
                                            </div>
                                            <div className="eachstudent_fee">
                                                <div className="eachstudent_fee_total">
                                                    <p>Total Due</p>
                                                    <h4>1.23La</h4>
                                                </div>
                                                <div className="eachstudent_fee_total">
                                                    <p>Total Paid</p>
                                                    <h4>0.23La</h4>
                                                </div>
                                            </div>
                                        </div>




                                    </div>
                                </div>

                                <div className="eachstudent_personalonfo">
                                    <div className="eachstudent_personalinfo_container">
                                        <h3>Personal Information</h3>
                                        <div className="eachstudent_personalinfo_row">
                                            <div className="eachstudent_personalinfo_item">
                                                <p>First Name</p>
                                                <h4>Hari</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Last Name</p>
                                                <h4>Keerthi</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Gender</p>
                                                <h4>Female</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Date of Birth</p>
                                                <h4>26 April 2003</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Nationality</p>
                                                <h4>Indian</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Phone</p>
                                                <h4>+91 9553738738</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Email</p>
                                                <h4>FemaleKeerthi@zero.com</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Current Address</p>
                                                <h4>Flat 121, Kavuri hills, Madhapur, Hydrabad, Telangana</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Permanent Address</p>
                                                <h4>Flat 121, Kavuri hills, Madhapur, Hydrabad, Telangana</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="eachstudent_personalonfo">
                                    <div className="eachstudent_personalinfo_container">
                                        <h3>Parent / Guardian Information</h3>
                                        <div className="eachstudent_personalinfo_row">
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Father Name</p>
                                                <h4>Hari</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Mather Name</p>
                                                <h4>Keerthi</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Phone</p>
                                                <h4>+91 9553738738</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Email</p>
                                                <h4>FemaleKeerthi@zero.com</h4>
                                            </div>
                                            <div className="eachstudent_personalinfo_item">
                                                <p>Occupation</p>
                                                <h4>Business man</h4>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div className="eachstudent_rightcon">
                                <div className="eachstudent_studentcard">
                                    <div className="eachstudent_studentimg">
                                        <div className="eachstudent_image">
                                            <img src={profilepic} alt="student_img"></img>
                                        </div>
                                        <h3>Hari Keerthi</h3>
                                        <p>ID 12345678</p>
                                    </div>
                                    <div className="eachstudent_class_details">
                                        <div className="eachstudent_classdetails">
                                            <div className="eachstudent_class">
                                                <p>Class</p>
                                                <h3>6 <sup>th</sup> B</h3>
                                            </div>
                                            <div className="eachstudent_class">
                                                <p>Class Teacher</p>
                                                <h3>Mohan Roa</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="eachstudent_admissiondetails">
                                        <h3>Admission Details</h3>
                                        <div className="eachstudent_add_details">
                                            <p>Add number</p>
                                            <h4>1345678954</h4>
                                        </div>
                                        <div className="eachstudent_add_details">
                                            <p>Date of joining</p>
                                            <h4>April 25, 2000</h4>
                                        </div>
                                        <div className="eachstudent_add_details">
                                            <p>Roll number</p>
                                            <h4>5678954</h4>
                                        </div>
                                        <div className="eachstudent_add_details">
                                            <p>Previous school</p>
                                            <h4>1345678954</h4>
                                        </div>
                                        <div className="eachstudent_add_details">
                                            <p>Academic year</p>
                                            <h4>2015-2016</h4>
                                        </div>
                                    </div>

                                </div>

                                <div className="eachstudent_con">
                                    <div className="eachstudent_marks_attendance">
                                        <div className="eachstudent_overallmarks">
                                            <div className="eachstudent_marksheading">
                                                <p>Uploaded Document Details</p>
                                                <KeyboardArrowRightIcon />
                                            </div>

                                            <div className="eachstudent_docs">
                                                <div className="eachstudent_docs_item">
                                                    <TaskAltIcon sx={{color: '#00A814'}}/>
                                                    <p>Birth certificate</p>
                                                </div>
                                                <div className="eachstudent_docs_item">
                                                    <TaskAltIcon sx={{color: '#00A814'}} />
                                                    <p>Transfer certificate</p>
                                                </div>
                                                <div className="eachstudent_docs_item">
                                                    <TaskAltIcon sx={{color: '#00A814'}}/>
                                                    <p>Cast certificate</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

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

export default Eachstudent;