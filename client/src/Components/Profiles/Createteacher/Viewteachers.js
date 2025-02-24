import React, { useEffect, useRef } from "react";
import './Viewteachers.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../Data/Docs";
import { useDispatch, useSelector } from "react-redux";
import { storeAllTeachersData } from "../../../ReduxStates/Teachersdata/Teachersdata";
import { Logout } from "../../AllFunctions/Logout";

function Viewteachers(){
    const navigate = useNavigate();
    const AllTeachersData = useSelector((state)=>state.teachersdata.data);
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce = useRef(false);

    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            if(AllTeachersData.length===0){
                async function fetchAllTeachersData(){
                    try{
                        // console.log('fetcing the teachers data');
                        const response = await fetch(`${API_URL}/teachers/getallteachers`,{
                            credentials:'include'
                        });
                        if(response.status === 401) {
                            alert('Your session is expired,please login again');
                            Logout(dispatch,navigate);
                            throw new Error('Unauthorized - Token expired');
                        }
                        const resData = await response.json();
                        // console.log('here is the resData ',resData);
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

            fetchCheckOnlyOnce.current=true;
        }
    },[AllTeachersData.length,navigate, dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="viewteachers-container">
                            <div className='admissionform-top-back-btn' style={{marginBottom:5,paddingTop:15,paddingLeft:5}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>

                            <div className="viewteachers-heading">
                                <h1>view teachers</h1>
                            </div>

                            <div className="viewteachers-table-div">
                                <div className="show-application-whole-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>teacher ID</th>
                                                <th>Name</th>
                                                <th>Mobile.no</th>
                                                <th>Specilized subject</th>
                                                <th>experience</th>
                                                <th>Gender</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                AllTeachersData.length>0 && AllTeachersData.map((item,idx)=>(
                                                    <tr key={idx} onClick={()=>navigate(`/manageprofiles/viewteachers/${item.teacherregid}`)} style={{cursor:'pointer'}}>
                                                        <td className="viewteachers-td-teacherregid">{item.teacherregid}</td>
                                                        <td>{item.teacherfirstname} {item.teachersmiddlename} {item.teacherslastname}</td>
                                                        <td className="viewteachers-td-mobilenumber">{item.teachermobilenumber}</td>
                                                        <td>{item.teacherspecilizedsubject}</td>
                                                        <td>{item.teacherworkexprienceyears}</td>
                                                        <td className="viewteachers-td-teachergender">{item.teachergender==='female'?<h2>{item.teachergender}</h2>:<h3>{item.teachergender}</h3>}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* you code end's here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Viewteachers;