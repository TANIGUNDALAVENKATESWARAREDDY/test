import React, { useEffect } from "react";
import './ShowApplications.css';
import Sidenav from "../Sidenav/Sidenav";
import Topnav from "../Topnav/Topnav";
import SearchIcon from '@mui/icons-material/Search';
import { updateAllApplications , updateSingleApplcation } from "../../ReduxStates/AllApplications";
import { useSelector , useDispatch } from "react-redux";
import { API_URL } from "../../Data/Docs";
import { socket } from "../../Data/Docs";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { Logout } from "../AllFunctions/Logout";

function ShowApplications(){
    const navigate = useNavigate();
    const allApplicationsData = useSelector((state)=>state.allapplications.data);
    // console.log('all applications: ',allApplicationsData);
    const dispatch = useDispatch();

    //binary search function to find the element
    function handleBinarySearch(targetId){ //return the object
        let left=0;
        let right=allApplicationsData.length-1;
        while(left<=right){
            const mid = Math.floor((left+right)/2);
            if(allApplicationsData[mid].admissionid===targetId){
                return allApplicationsData[mid];
            }else if(allApplicationsData[mid].admissionid<targetId){
                right=mid-1;
            }else{
                left=mid+1;
            }
        }
        return null;

    }

    
    //updating the application data
    async function handleUpdateApplicationData(uid,field,event){
        event.preventDefault();
        try{
            let updateTempApplication = handleBinarySearch(uid);
            // console.log('here is the updated data: ',updateTempApplication);
            if(updateTempApplication){
                let modifyData = {
                    ...updateTempApplication,
                    [field]:event.target.value
                }
                // console.log('modifyData is: ',modifyData);
                const response = await fetch(`${API_URL}/admissionform/updateapplicationdata`, {
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(modifyData),
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

                // const tempResData = await response.json();
                // console.log('tempResponse Date: ',tempResData);
                // if(tempResData.data.acknowledged){
                //     const index = handleBinarySearchIdex(uid);
                //     let newApplicationData=[...allApplicationsData];// let newApplicationData = allApplicationsData.map((application)=>( application.admissionid===modifyData.admissionid?modifyData:application));
                //     newApplicationData[index]=modifyData;
                //     await dispatch(updateAllApplications(newApplicationData));
                // }

            }
        }catch(err){
            console.log('you getting an error while updating the applications ',err);
        }
    }
    useEffect(() => {

        // socket.on('applicationDataUpdated',(data)=>{
        //     console.log('here is the update data: ',data.data);
        //     dispatch(updateSingleApplcation(data.data));
        // });
        
    

        if(allApplicationsData.length===0){

            //only once the website loads the listener will added here
            const handleApplicationDataUpdated = (data) => {
                dispatch(updateSingleApplcation(data.data));
            };
        
            if (!socket.hasListeners('applicationDataUpdated')) {
                socket.on('applicationDataUpdated', handleApplicationDataUpdated);
            }

            async function fetchAllApplications() {//fetching all the applications data
                try {
                    // Await the response from the fetch request
                    const response = await fetch(`${API_URL}/admissionform`,{
                        credentials:'include'
                    });
                    
                    // Check if the response is OK (status code 200-299)
                    if (!response.ok) {
                        if(response.status === 401) {
                            alert('Your session is expired,please login again');
                            Logout(dispatch,navigate);
                            throw new Error('Unauthorized - Token expired');
                        }
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    // Await the JSON conversion of the response body
                    const tempApplicationsData = await response.json();
                    if(tempApplicationsData.data.length>0){
                        tempApplicationsData.data.sort((a,b)=>b.admissionid-a.admissionid);
                        await dispatch(updateAllApplications(tempApplicationsData.data));
                    }
                    
                    // console.log('Here is all the Applications data: ', tempApplicationsData);
                } catch (err) {
                    console.log('You are getting an error while fetching applications data: ', err);
                }
            }
            fetchAllApplications();
        }
    }, [allApplicationsData.length,navigate,dispatch]);
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
                            <p>Home - <span>All Applications</span></p>
                        </div>

                        <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} style={{marginTop:10,
                            marginBottom:10,width:'fit-content',borderRadius:20,background:'white',paddingRight:5}}>
                                <KeyboardArrowLeftIcon sx={{fontSize:22}}/>
                                <p>back</p>
                        </div>

                        {/* displaying the all applications */}
                        <div className="show-applications-whole-table">
                            <div className="show-application-top-header">
                                <p>All Applications</p>
                                <div className="show-application-search-bar">
                                    <SearchIcon sx={{color:'gray',fontSize:20}}/>
                                    <input/>
                                </div>
                            </div>

                            {allApplicationsData.length>0 && 

                            <div className="show-application-whole-inner-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Application Id</th>
                                            <th>first name</th>
                                            <th>last name</th>
                                            <th>Gender</th>
                                            <th>parent name</th>
                                            <th>class</th>
                                            <th>address</th>
                                            <th>App. status</th>
                                            <th>DOB</th>
                                            <th>mobile</th>
                                            <th>e-mail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allApplicationsData.map((item,idx)=>(
                                            <tr key={idx}>
                                                <td>{item.admissionid}</td>
                                                <td style={{whiteSpace:'nowrap'}}>{item.studentname}</td>
                                                <td>{item.surname}</td>
                                                <td>{item.gender}</td>
                                                <td style={{whiteSpace:'nowrap'}}>{item.fathername}</td>
                                                <td>{item.class}</td>
                                                <td>{item.city}, {item.state}</td>
                                                <td>
                                                    {item.appstatus==='approved'? 
                                                    <p className="showapplication-approved-status-p">{item.appstatus}</p>:
                                                    <select value={item.appstatus} 
                                                    className="showApplication-select-appstatus"
                                                    style={{backgroundColor:`${item.appstatus==='approved'?'green':item.appstatus==='rejected'?'red':'#090979'}`}} 
                                                    onChange={(e)=>handleUpdateApplicationData(item.admissionid,"appstatus",e)} >
                                                        <option value="" disabled>choose</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>}
                                                </td>
                                                <td style={{whiteSpace:'nowrap'}}>{item.dob.split('T')[0]}</td>
                                                <td>{item.mobileno}</td>
                                                <td>{item.emailid}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                        </div>


                        {/* // your code ends here \\  */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShowApplications;