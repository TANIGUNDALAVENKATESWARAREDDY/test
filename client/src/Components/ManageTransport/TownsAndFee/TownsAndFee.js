import React, { useEffect, useRef, useState } from "react";
import './TownsAndFee.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { API_URL } from "../../../Data/Docs";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from "react-redux";
import { storetownsdata } from "../../../ReduxStates/Townsdata/Townsdata";
import { Logout } from "../../AllFunctions/Logout";


function TownsAndFee(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce = useRef(false);
    const allTownsAndVillages = useSelector((state)=>state.townsdata.data);
    const [showloading, setShowloading] = useState(false)
    const [openAddAlert,setOpenAddAlert] = useState(false);
    const [townData,setTownData] = useState({
        townid:'',
        townname:'',
        towntransportfee:''
    });


    function handleCloseOpenAddAlert(){//function to close the open add town
        setOpenAddAlert(false);
    }

    async function createNewTown(e){
        e.preventDefault();
        setShowloading(true);
        try{
            if(townData.townname!=='' && townData.towntransportfee!==''){
                const tempuuid = uuidv4();
                const response = await fetch(`${API_URL}/towns/addNewTown`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        ...townData,
                        townid:tempuuid
                    }),
                    credentials:'include',
                });

                const resData = await response.json();
                if(resData.success){
                    setOpenAddAlert(false);
                    alert('successfully added');
                }else{
                    alert('error while adding');
                }
            }else{
                alert('please fill the required fields!!');
            }
            
        }catch(err){
            console.log('getting an error while adding ',err);
        }
        setShowloading(false);
    }

    useEffect(()=>{
        
        if(!fetchCheckOnlyOnce.current){
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
        
        
    },[allTownsAndVillages.length , dispatch , navigate]);

    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="townsandfee-container">
                            <div className='admissionform-top-back-btn' style={{marginBottom:5,marginTop:15}} onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>
                            <h2 className="townsandfee-header"> towns and fee's</h2>
                            <div className="townsandfee-inner-con">
                                <div className="townsandfee-inner-fun">
                                    <div className="townsandfee-inner-fun-search">
                                        <SearchIcon sx={{fontSize:20,color:'grey'}}/>
                                        <input type="text" placeholder="Search Villages..."/>
                                    </div>
                                    <div className="townsandfee-inner-fun-villages">
                                        <p>total village: <span>{allTownsAndVillages.length}</span></p>
                                    </div>
                                </div>
                                {/* table start from here */}
                                {
                                    allTownsAndVillages.length>0 &&
                                    <div className="townsandfee-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>SI.No</th>
                                                <th>Towns/Villages</th>
                                                <th>Fee</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            allTownsAndVillages.map((item,idx)=>(
                                                <tr key={idx}>
                                                    <td>{idx+1}</td>
                                                    <td>{item.townname}</td>
                                                    <td>{item.towntransportfee}</td>
                                                    <td>
                                                        <div className="townsandfee-table-actions">
                                                            <EditIcon sx={{fontSize:20,color:'#1976d2',cursor:'pointer'}}/>
                                                            <DeleteOutlineIcon sx={{fontSize:20,color:'red',cursor:'pointer'}}/>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>                                
                                    </table>
                                </div>
                                }
                                {/* table ends here */}
                                <div className="townsandfee-add-village">
                                    <div className="townsandfee-add-village-inner" onClick={()=>setOpenAddAlert(true)}>
                                        <AddIcon sx={{fontSize:16,color:'white'}}/>
                                        <p>add village</p>
                                    </div>
                                </div>                               
                            </div>
                        </div>
                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            <Dialog
                open={openAddAlert}
                onClose={handleCloseOpenAddAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="townsandfee-addvillage-form">
                    <div className="townsandfee-addvillage-form-inner">
                        <div className="townsandfee-addvillage-form-inner-cross">
                            <CloseIcon sx={{fontSize:20,backgroundColor:'#e9e9e9e5',borderRadius:'50%'}} onClick={handleCloseOpenAddAlert}/>
                        </div>
                        <div className="townsandfee-addvillage-form-each">
                            <label>Town/Village name</label>
                            <input type="text" value={townData.townname} onChange={(e)=>setTownData(prev=>({
                                ...prev,
                                townname:e.target.value
                            }))}/>
                        </div>
                        <div className="townsandfee-addvillage-form-each">
                            <label>transport fee</label>
                            <input type='number' value={townData.towntransportfee} onChange={(e)=>setTownData(prev=>({
                                ...prev,
                                towntransportfee:e.target.value
                            }))}/>
                        </div>
                        <button onClick={(e)=>createNewTown(e)}>add village</button>
                    </div>
                </div>
            </Dialog>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

        </>
    );
}

export default TownsAndFee;