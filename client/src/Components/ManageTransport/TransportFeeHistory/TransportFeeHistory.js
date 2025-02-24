import React, { useEffect, useRef, useState } from 'react';
import './TransportFeeHistory.css';
import Sidenav from '../../Sidenav/Sidenav';
import Topnav from '../../Topnav/Topnav';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../../../Data/Docs';
import { storeStudentsTransportFeeHistory } from '../../../ReduxStates/Transportfeedata/Transportfeehistory';
import DownloadExcel from '../../DownloadExcel/DownloadExcel';
import { storetownsdata } from '../../../ReduxStates/Townsdata/Townsdata';
import { Logout } from '../../AllFunctions/Logout';
import { classes } from '../../../Data/Docs';
import Select from "react-select";


function TransportFeeHistory(){
    const navigate = useNavigate();
    const fetchCheckOnlyOnce = useRef(false);
    const [stdIdOrName,setStdIdOrName] = useState('');
    const [showNoOfStds , setShownoOfStds] = useState(50);
    const [selectTown,setSelectTown] = useState({
        label:'All Towns',
        value:''
    });
    const [selectClass,setSelectClass] = useState('');
    const StudentsTransportFee = useSelector((state)=>state.transportfeehistory.data);
    const allTownsAndVillages = useSelector((state)=>state.townsdata.data);
    const dispatch = useDispatch();

    //formate date
    const formattedData = StudentsTransportFee.filter(stdItem=>(stdItem.stdregid.includes(stdIdOrName)||`${stdItem.stdfirstname} ${stdItem.stdmiddlename} ${stdItem.stdlastname}`.toLowerCase().includes(stdIdOrName.toLowerCase())))
    .filter((tclass)=>tclass.stdclass.includes(selectClass))
     .filter((tvillage)=>tvillage.stdtransportfrom.includes(selectTown.value))
     .map((stdData)=>{
        return {
            "RegID":stdData.stdregid,
            "Student Name":`${stdData.stdfirstname} ${stdData.stdmiddlename} ${stdData.stdlastname}`,
            "Class":stdData.stdclass,
            "village":stdData.stdtransportfrom?handleGetVillageName(stdData.stdtransportfrom):'',
            "Mobile.No":stdData.stdfatherphone?stdData.stdfatherphone:'',
            "Total Transport Fee":stdData.stdtransporttotalfee,
            "transport Fee Paid":stdData.stdtransportfeepaid,
            "Fee Due":Number(stdData.stdtransporttotalfee)-Number(stdData.stdtransportfeepaid)
        }
    });


    //let's count the total transport fee due
    const calTransportDue =() =>{
        let tempTotalTransportDue =0;
        StudentsTransportFee.filter(stdItem=>(stdItem.stdregid.includes(stdIdOrName)||`${stdItem.stdfirstname} ${stdItem.stdmiddlename} ${stdItem.stdlastname}`.toLowerCase().includes(stdIdOrName.toLowerCase())))
        .filter((tclass)=>tclass.stdclass.includes(selectClass))
        .filter((tvillage)=>tvillage.stdtransportfrom.includes(selectTown.value))
        .forEach(item=>{
            tempTotalTransportDue +=(Number(item.stdtransporttotalfee)-Number(item.stdtransportfeepaid));
        });
        return tempTotalTransportDue;
    }

    function handleGetVillageName(vlgID){
        const findvillage = allTownsAndVillages.find((vlg)=>vlg.townid===vlgID);
        return findvillage?findvillage.townname:'';
    }


    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            if(StudentsTransportFee.length===0){

                async function fetchAllStudentsTransportHistory(){
                    try{
                        const transportFeeHistory = await fetch(`${API_URL}/transportHistory/getAllStudentsTransportFeeHistory`,{
                            credentials:'include'
                        });
                        const resData = await transportFeeHistory.json();
                        if(resData.success){
                            dispatch(storeStudentsTransportFeeHistory(resData.transportfeestudents));
                        }
                    }catch(err){
                        console.log('getting an error while fetching all students transport fee history ',err);
                    }
                }

                fetchAllStudentsTransportHistory();//students transport fee history
            }

            if(allTownsAndVillages.length===0){
                async function handleGetAllVillages(){
                    try{
                        const villageres = await fetch(`${API_URL}/towns/getAllTowns`,{
                            credentials:'include'
                        });

                        if(!villageres.ok){
                            if(villageres.status === 401) {
                                alert('Your session is expired,please login again');
                                Logout(dispatch,navigate);
                                throw new Error('Unauthorized - Token expired');
                            }
                            throw new Error(`Http error! status: ${villageres.status}`);
                        }

                        const villageResData = await villageres.json();
                        if(villageResData.success){
                            dispatch(storetownsdata(villageResData.alltownsdata));
                        }
                    }catch(err){
                        console.log('getting an error while fetching villages',err);
                    }
                }
                handleGetAllVillages();
            }
            fetchCheckOnlyOnce.current=true;
        }
    },[StudentsTransportFee.length,allTownsAndVillages.length,dispatch,navigate]);
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} 
                        style={{width:'fit-content',background:'white',
                            paddingRight:5,borderRadius:20,
                            marginBottom:15,marginTop:20}}
                            >
                            <KeyboardArrowLeftIcon sx={{fontSize:22}}/>
                            <p>back</p>
                        </div>

                        {/* download button */}
                        {
                            StudentsTransportFee.length>0 &&
                            <div className="studentfeehistory-dwnbtn-div" style={{marginBottom:10}}>
                                <button className="studentfeehistory-download-btn" onClick={()=>DownloadExcel(formattedData,`transport_fee`)}>download</button>
                            </div>

                        }

                        <div className='transportfeehistory-con'>
                            

                            {
                                StudentsTransportFee.length>0 && 
                                <div className='transportfeehistory-search-and-total'>
                                    <h2>Transport Fee History</h2>
                                    <p>Total Due:<span>{calTransportDue()}</span>/-</p>
                                </div>
                            }

                            {/* filter transport fee */}

                            {
                                StudentsTransportFee.length>0 && 
                                <div className='transportfeehistory-search-and-total'>
                                    <div className='transportfeehistory-search-field'>
                                        <SearchIcon sx={{fontSize:20}}/>
                                        <input type='text' placeholder='RegID/Name...' value={stdIdOrName} onChange={(e)=>setStdIdOrName(e.target.value)}/>
                                    </div>
                                    <div className='transportfeehistory-cls-filter'>
                                        {/* select class */}
                                        <select value={selectClass} onChange={(e)=>setSelectClass(e.target.value)}>
                                            <option value=''>All Classes</option>
                                            {
                                                classes.map((cls,idx)=>(
                                                    <option key={idx} value={cls}>{cls}</option>
                                                ))
                                            }
                                        </select>

                                        {/* select town */}
                                        <Select value={selectTown} 
                                            onChange={(option)=>setSelectTown(prev=>({
                                                ...prev,
                                                ...option
                                            }))}
                                            styles={{
                                                input:(provided)=>({
                                                    ...provided,
                                                    margin:0,
                                                    padding:0,
                                                    minWidth:160,
                                                }),
                                                valueContainer:(provided)=>({
                                                    ...provided,
                                                    padding:0,
                                                    paddingLeft:5,
                                                    fontWeight:'500',
                                                }),
                                                option: (provided) => ({
                                                    ...provided,
                                                    minHeight: '30px',   
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
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                            }}
                                            options={
                                                [{value:'',label:'All Towns'},
                                                    ...allTownsAndVillages.map((temptown)=>({
                                                        value:temptown.townid,
                                                        label:temptown.townname
                                                }))]  
                                            }
                                            components={{ DropdownIndicator: null }}
                                            placeholder="Select an option"
                                            menuPortalTarget={document.body}
                                        />

                                    </div>
                                </div>
                            }

                            {
                                StudentsTransportFee.length<=0? <p style={{textAlign:'center'}}>No students have registered for the transport facility.</p>:
                                <div className="show-application-whole-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Reg.ID</th>
                                                <th>Student Name</th>
                                                <th>Class</th>
                                                <th>Village</th>
                                                <th>Mobile.No</th>
                                                <th>Total Transport Fee</th>
                                                <th>Transport fee paid</th>
                                                <th>Fee Due</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                StudentsTransportFee.filter(stdItem=>(stdItem.stdregid.includes(stdIdOrName)||`${stdItem.stdfirstname} ${stdItem.stdmiddlename} ${stdItem.stdlastname}`.toLowerCase().includes(stdIdOrName.toLowerCase())))
                                                .filter((tclass)=>tclass.stdclass.includes(selectClass))
                                                .filter((tvillage)=>tvillage.stdtransportfrom.includes(selectTown.value))
                                                .slice(0,showNoOfStds).map((stdData,idx)=>(
                                                    <tr key={idx} onClick={()=>navigate(`/managetransport/transportfeehistory/${stdData.stdregid}`)}>
                                                        <td>{stdData.stdregid}</td>
                                                        <td>{stdData.stdfirstname} {stdData.stdmiddlename} {stdData.stdlastname}</td>
                                                        <td>{stdData.stdclass}</td>
                                                        <td>{stdData.stdtransportfrom?handleGetVillageName(stdData.stdtransportfrom):''}</td>
                                                        <td>{stdData.stdfatherphone?stdData.stdfatherphone:''}</td>
                                                        <td> <p className='transportfeehistory-totalfee'>{stdData.stdtransporttotalfee}</p></td>
                                                        <td><p className='transportfeehistory-totalpaid'>{stdData.stdtransportfeepaid}</p></td>
                                                        <td><p className='transportfeehistory-totaldue'>{Number(stdData.stdtransporttotalfee)-Number(stdData.stdtransportfeepaid)}</p></td>
                                                    </tr>
                                                ))
                                            }
                                            {/* <tr>
                                                <td>123</td>
                                                <td>panchali upendra</td>
                                                <td>9390000682</td>
                                                <td>20000</td>
                                                <td>18000</td>
                                                <td>2000</td>
                                            </tr> */}
                                            {/* <tr>
                                                <td>152</td>
                                                <td>ubbu</td>
                                                <td>9390000682</td>
                                                <td>25000</td>
                                                <td>25000</td>
                                                <td>0</td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                </div>
                            }


                            {
                                StudentsTransportFee.filter(stdItem=>(stdItem.stdregid.includes(stdIdOrName)||`${stdItem.stdfirstname} ${stdItem.stdmiddlename} ${stdItem.stdlastname}`.toLowerCase().includes(stdIdOrName.toLowerCase())))
                                .filter((tclass)=>tclass.stdclass.includes(selectClass))
                                .filter((tvillage)=>tvillage.stdtransportfrom.includes(selectTown.value)).length>showNoOfStds?
                                <div className='transportfeehistory-showmore'>
                                    <p className='transportfeehistory-showmore-btn' onClick={()=>setShownoOfStds(prev=>prev+50)}>+ show more</p>
                                </div>:<></>
                            }
                            
                        </div>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TransportFeeHistory;