import React, { useState } from 'react';
import './Trackapplication.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { API_URL } from '../../Data/Docs';

function Trackapplication(){
    const [usrappdtls,setusrappdtls] = useState({
        appid:'',
        dob:'',
    });

    const [recordstatus,setrecordstatus] = useState('');
    const [recordinfo, setrecordinfo] = useState('');

    async function handlecheckstatus(e){
        e.preventDefault();
        try{
            if(usrappdtls.appid!=='' && usrappdtls.dob!==''){
                const checkstatusresponse =  await fetch(`${API_URL}/admissionform/checkappstatus`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(usrappdtls)
                });
                const data = await checkstatusresponse.json();
                if(data.success){
                    setrecordstatus(data.success);
                    setrecordinfo(data.application);
                    
                    const date = new Date(data.application.dateofsub);

                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
                    const day = String(date.getDate()).padStart(2, '0');

                    const formattedDate = `${year}-${month}-${day}`;
                    setrecordinfo(prev=>({
                        ...prev,
                        dateofsub:formattedDate
                    }));
                }else{
                    setrecordstatus(data.success);
                    setrecordinfo('');
                }
                // console.log('here is you data from server: ',data);
            }else{
                alert('please fill the required fields!!');
            }

        }catch(error){
            console.log('you got an error while fetching',error);
        }
    }
    


    return(
        <>
            <div className='application-status-check'>
                <h1>check your application status</h1>
                <form>
                    <div>
                        <label>Application ID</label>
                        <input value={usrappdtls.appid} 
                            type='number' 
                            placeholder='enter your application id..'
                            onChange={(e)=>setusrappdtls(prev=>({
                                ...prev,
                                appid:e.target.value
                            }))}
                        />
                    </div>
                    <div>
                        <label>Date of birth</label>
                        <input value={usrappdtls.dob} type='date'
                            onChange={(e)=>setusrappdtls(prev=>({
                                ...prev,
                                dob:e.target.value
                            }))}
                        />
                    </div>
                    <button onClick={(e)=>handlecheckstatus(e)}>Check status</button>
                </form>
            </div>

            {recordstatus===true?
            <div className='application-details'>
                <div className='application-details-header'>
                    <h1>Application Details</h1>
                </div>
                <div className='application-details-list'>
                    <ul>
                        <li>
                            <h2>student name :</h2>
                            <h3>{recordinfo.studentname}</h3>
                        </li>
                        <li>
                            <h2>academic year :</h2>
                            <h3>{recordinfo.academicyear}</h3>
                        </li>
                        <li>
                            <h2>class :</h2>
                            <h3>{recordinfo.class}</h3>
                        </li>
                        <li>
                            <h2>age :</h2>
                            <h3>{recordinfo.age}</h3>
                        </li>
                        <li>
                            <h2>nationality :</h2>
                            <h3>{recordinfo.nationality}</h3>
                        </li>
                        <li>
                            <h2>father name :</h2>
                            <h3>{recordinfo.fathername}</h3>
                        </li>

                        <li>
                            <h2>mother name :</h2>
                            <h3>{recordinfo.mothername}</h3>
                        </li>
                        <li>
                            <h2>mobile no. :</h2>
                            <h3>{recordinfo.mobileno}</h3>
                        </li>
                        <li>
                            <h2>Application Status :</h2>
                            <h4 className={recordinfo.appstatus==='pending'?'trackapp-pending':recordinfo.appstatus==='approved'?'trackapp-approved':'trackapp-notapproved'}>{recordinfo.appstatus}</h4>
                        </li>

                        <li>
                            <h2>email id :</h2>
                            <h3 style={{textTransform:'none'}}>{recordinfo.emailid}</h3>
                        </li>
                        <li>
                            <h2>state :</h2>
                            <h3>{recordinfo.state}</h3>
                        </li>
                        <li>
                            <h2>city :</h2>
                            <h3>{recordinfo.city}</h3>
                        </li>

                        <li>
                            <h2>submitted date :</h2>
                            <input type='date' value={recordinfo.dateofsub} readOnly/>
                        </li>

                    </ul>
                </div>
                {recordinfo.status==='approved' &&
                <div className='track-application-fill-admin-form'>
                    <p>Click here to fill your admission form</p>
                    <ChevronRightIcon/>
                </div>
                }
            </div>
            :
            recordstatus===false?<p className='check-app-check-status'>Sry Application Not Found...</p>:<></>
            }
        </>
    );
}

export default Trackapplication;