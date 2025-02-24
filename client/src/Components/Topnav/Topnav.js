import React, { useState } from "react";
import './Topnav.css';
import Duplicateimg from '../../Assets/dupilcatepic.PNG';

//redux toolkit
import { toggleSideNavTopBtn } from "../../ReduxStates/BasicStates";
import {useDispatch, useSelector} from 'react-redux';

// material ui icons
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

import Badge from '@mui/material/Badge';
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Data/Docs";
// import { storeUserLoginDetails } from "../../ReduxStates/Userdata";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Logout } from "../AllFunctions/Logout";

const CustomBadge = styled(Badge)(({theme})=>({
    '& .MuiBadge-badge':{
        fontSize:'10px',
        height:'16px',
        minWidth:'16px',
        padding:'0 4px',
        // backgroundColor:'orange',
    }
}))
const CustomBadgetwo = styled(Badge)(({theme})=>({
    '& .MuiBadge-badge':{
        fontSize:'10px',
        height:'16px',
        minWidth:'16px',
        padding:'0 4px',
        backgroundColor:'#ff5d2c',
    }
}))

function Topnav(){
    // const togglemenubtn = useSelector((state)=>state.basicstates.topnavsidebtn)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showloading,setShowloading]=  useState(false);
    // const isLoggedIn = useSelector((state)=>state.userdata.isLoggedIn);
    // const showLoading = useSelector((state)=>state.userdata.showLoading);
    const role = useSelector((state)=>state.userdata.role);
    const regid = useSelector((state)=>state.userdata.regid);
    
    async function handleUserLogOut(){
        setShowloading(true);
        try{
            const response = await fetch(`${API_URL}/users/logout`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:'include'
            });

            if (!response.ok) { //calling the function 
                if (response.status === 401) {
                  Logout(dispatch,navigate);
                  throw new Error('Unauthorized - Token expired');
                }
                throw new Error(response.statusText || 'Request failed');
            }

            const resData = await response.json();
            if(resData.success){
                // socket.emit("logout","cleardata");
                alert(resData.message);
                Logout(dispatch,navigate);
                // dispatch(storeUserLoginDetails({
                //     isLoggedIn:false,
                //     role:'',
                //     regid:''
                // }));
                // navigate('/');
            }else{
                alert(resData.message);
            }
        }catch(err){
            console.log('getting an error while logout',err);
            alert('error while logout');
        }
        setShowloading(false);
    }

    return(
        <>
            <div className='top-navbar-con'>
                <div className='top-nav-menu-and-search'>
                    <div className='topnav-menu-icon' onClick={()=>dispatch(toggleSideNavTopBtn())}>
                        <MenuOpenIcon  />
                    </div>
                    <div className="top-nav-search">
                        <input type="text" placeholder='Search what you want...'/>
                        <SearchIcon/>
                    </div>
                </div>
                <div className="top-nav-email-not-profile">
                    <div className="top-nav-enp">
                        
                        <div className="top-nav-enp-each">
                            <CustomBadge badgeContent={4} color="primary">
                                <MailOutlineIcon sx={{fontSize:'20px',color:'black'}}/>
                            </CustomBadge>
                        </div>
                        
                        <div className="top-nav-enp-each">
                            <CustomBadgetwo badgeContent={4} color="primary">
                                <NotificationsNoneIcon sx={{fontSize:'20px',color:'black'}}/>
                            </CustomBadgetwo>
                        </div>
                        <div className="active-top-nav-enp-each-search">
                            <SearchIcon sx={{fontSize:'22px'}}/>
                        </div>
                    </div>
                    <div className="top-nav-profile">
                        <div className="top-nav-profile-img">
                            <img src={Duplicateimg} alt='profilepic'/>
                        </div>
                        <div className="top-nav-profile-dtls">
                            <h2>{regid}</h2>
                            <p style={{textTransform:'capitalize'}}>{role}</p>
                        </div>
                        <KeyboardArrowDownIcon className="top-nav-profile-downarrow"/>
                        <div className="top-nav-profile-dropdown">
                            <div className="top-nav-profile-dropdown-each" onClick={()=>navigate('/profile')}>
                                <PersonIcon sx={{fontSize:'20px'}}/>
                                <p>Profile</p>
                            </div>
                            <div className="top-nav-profile-dropdown-each">
                                <SettingsIcon sx={{fontSize:'20px'}}/>
                                <p>settings</p>
                            </div>
                            <div className="top-nav-profile-dropdown-each" onClick={()=>navigate('/changepassword')}>
                                <LockOpenIcon sx={{fontSize:'20px'}}/>
                                <p style={{whiteSpace:'nowrap'}}>change password</p>
                            </div>
                            <div className="top-nav-profile-dropdown-each" onClick={()=>handleUserLogOut()}>
                                <LogoutIcon sx={{fontSize:'20px',color:'red'}} />
                                <p style={{color:'red'}}>logout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Topnav;