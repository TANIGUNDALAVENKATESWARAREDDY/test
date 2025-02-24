import React, { useEffect, useRef } from "react";
import './Viewadmins.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../Data/Docs";
import { storeAllAdminsData } from "../../../ReduxStates/Adminsdata/AllAdminsData";
import { Logout } from "../../AllFunctions/Logout";

function Viewadmins(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fetchCheckOnlyOnce = useRef(false);
    const AllAdminsData = useSelector((state)=>state.alladminsdata.data);
    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){
            if(AllAdminsData.length===0){
                async function fetchAllAdmins(){
                    try{
                        const response = await fetch(`${API_URL}/admin/getalladmins`,{
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
                            dispatch(storeAllAdminsData(resData.alladmins));
                        }else{
                            dispatch(storeAllAdminsData([]));
                        }
                    }catch(err){
                        console.log('getting an error while fetching the admins',err);
                    }
                }
                fetchAllAdmins();
            }
        fetchCheckOnlyOnce.current=true;
        }
    },[AllAdminsData.length,navigate,dispatch]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}

                        <div className="viewadmins-container">
                            <div className='admissionform-top-back-btn' style={{marginBottom:5,paddingTop:15,paddingLeft:5}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>

                            <div className="viewteachers-heading">
                                <h1>view admins</h1>
                            </div>

                            <div className="viewteachers-table-div">
                                <div className="show-application-whole-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>admin ID</th>
                                                <th>name</th>
                                                <th>mobile.no</th>
                                                <th>Specilized subject</th>
                                                <th>experience</th>
                                                <th>Gender</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                AllAdminsData.length>0 && AllAdminsData.map((item,idx)=>(
                                                    <tr key={idx} onClick={()=>navigate(`/manageprofiles/viewadmins/${item.adminregid}`)} style={{cursor:'pointer'}}>
                                                        <td className="viewadmins-first-td">{item.adminregid}</td>
                                                        <td>{`${item.adminfirstname} ${item.adminmiddlename} ${item.adminlastname}`}</td>
                                                        <td className="viewadmins-third-td">{item.adminmobilenumber}</td>
                                                        <td>{item.adminspecilizedsubject}</td>
                                                        <td>{item.adminworkexprienceyears}</td>
                                                        <td>{item.admingender}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
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

export default Viewadmins;