import React, { useState } from "react";
import './Login.css';
// import { authenticationFunction } from "../../ReduxStates/BasicStates";
import { useDispatch} from "react-redux";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Vislogo from '../../Assets/vislogo.png';
import { API_URL } from "../../Data/Docs";
import { storeUserLoginDetails } from "../../ReduxStates/Userdata";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../../Data/Docs";

function Login(){
    const dispatch = useDispatch();
    const[showloading,setShowloading] = useState(false);
    const[showPassword,setShowPassword] = useState(false);
    const [loginDetails , setLoginDetails] = useState({
        username:'',
        password:''
    });
    const[reqCredentialErrors ,setReqCredentialErrors] = useState({});
    const[invalidCredentials ,setInvalidCredentials] = useState(false);
    
    //toast notifications
    const loginerror = () =>toast.info('please enter required fields',{
        className:'login-info-notify',
        icon:false
    });

    const invalidError =(msg)=>toast.error(`${msg}`,{
        className:'login-error-notify',
        icon:false
    });

    async function handleLoginFunction(e) {
        e.preventDefault();
        setShowloading(true);
        try {
            if (loginDetails.username !== '' && loginDetails.password !== '') {
                setReqCredentialErrors({});
                setInvalidCredentials(false);
    
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
    
                const response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginDetails),
                    signal: controller.signal
                });
    
                clearTimeout(timeoutId);
    
                const resData = await response.json();
                if (resData.success) {
                    socket.emit("joinRoom",resData.user.username);
                    dispatch(storeUserLoginDetails({
                        ...resData.user,
                        isLoggedIn: true,
                        role: resData.user.role,
                        regid: resData.user.username
                    }));
                } else {
                    invalidError(resData.message);
                    setInvalidCredentials(true);
                }
    
            } else {
                loginerror();
                const temperrors = {};
                if (loginDetails.password === '') temperrors.password = 'Please enter your password';
                if (loginDetails.username === '') temperrors.username = 'Username is required';
                setReqCredentialErrors(temperrors);
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                invalidError("Request timed out. Please try again.");
            } else {
                console.error('Error during login:', err);
                invalidError("Unable to connect. Please check your internet connection.");
            }
        } finally {
            setShowloading(false);
        }
    }

    return(
        <>
            <div className="login-con">
                <div style={{width:'150px',height:'auto',marginBottom:20}}>
                    <img src={Vislogo} style={{width:'100%',height:'100%',objectFit:'contain'
                    }} alt='vislogo'/>
                </div>
                <form className="login-form">
                    <div className="login-head">
                        <p>login</p>
                    </div>

                    <div className="input-form-div">
                        <input type="text" placeholder="UserID" value={loginDetails.username} onChange={(e)=>setLoginDetails(prev=>({
                            ...prev,
                            username:e.target.value
                        }))}/>
                        <PermIdentityIcon sx={{fontSize:25}}/>
                    </div>
                    {reqCredentialErrors.username && <p 
                    style={{fontSize:'0.6rem',fontWeight:'400',
                        textTransform:'capitalize',fontStyle:'italic',color:'red',marginTop:1}}>{reqCredentialErrors.username}</p>}

                    <div className="input-form-div">
                        <input type={showPassword?'text':'password'} placeholder="Password" value={loginDetails.password} 
                        onChange={(e)=>setLoginDetails(prev=>({
                            ...prev,
                            password:e.target.value
                        }))}/>
                        {showPassword===true?
                        <VisibilityIcon  sx={{fontSize:25}} onClick={()=>setShowPassword(false)}/>
                        :<VisibilityOffIcon sx={{fontSize:25}} onClick={()=>setShowPassword(true)}/>}
                    </div>
                    {reqCredentialErrors.password && <p style={{fontSize:'0.6rem',fontWeight:'400',
                        textTransform:'capitalize',fontStyle:'italic',color:'red',marginTop:1}}>{reqCredentialErrors.password}</p>}
                    {invalidCredentials && <p style={{textAlign:'center',marginTop:2,color:'red',fontSize:'0.8rem'}}>invalid credentials</p>}
                    <div className="Login-button">
                        <button onClick={(e)=>handleLoginFunction(e)}>Login</button>
                    </div>
                </form>
            </div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    limit={1}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="light"
                    />
        </>
    );
}

export default Login;