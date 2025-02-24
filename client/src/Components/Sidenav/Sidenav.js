import React  from 'react';
import './Sidenav.css';
// import Vislogo from '../../Assets/vislogo.png';
import { NavLink } from 'react-router-dom';

// material ui
import SpeedIcon from '@mui/icons-material/Speed';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ClearIcon from '@mui/icons-material/Clear';
//redux states
import { useSelector,useDispatch } from 'react-redux';
import { toggleSideNavBtn,toggleSideNavTopBtn} from '../../ReduxStates/BasicStates';
import Smslogo from '../../Assets/smslogo.png';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import ArticleIcon from '@mui/icons-material/Article';
// import PeopleIcon from '@mui/icons-material/People';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ClassIcon from '@mui/icons-material/Class';
import PaymentsIcon from '@mui/icons-material/Payments';

import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InventoryIcon from '@mui/icons-material/Inventory';

import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

function Sidenav(){
    const togglesidenav = useSelector((state)=>state.basicstates.sidenavbtn);
    const toggleSideTopnav = useSelector((state)=>state.basicstates.topnavsidebtn);
    const dispatch = useDispatch();
    // const[profileState , setProfileState]=useState("");
    // const[profileEachState , setProfileEachState] = useState('');
    // ${toggleSideTopnav===false?'inactive-sidenav-con-response':'

    return(
        <>
            <div className={togglesidenav?`sidenav-container-inactive ${toggleSideTopnav===false?'inactive-sidenav-con-response':'active-sidenav-con-response'}`:`sidenav-container ${toggleSideTopnav===false?'inactive-sidenav-con-response':'active-sidenav-con-response'}`}>
            {/* school logo */}
                <div className="sidenav-close-cross-btn">
                    <ClearIcon onClick={()=>dispatch(toggleSideNavTopBtn())} sx={{color:'black'}}/>
                </div>
                <div className='sidenav-school-logo'>
                    <img src={Smslogo} alt='school logo'/>
                </div>
            {/* menubar open and close */}
            <div className={`sidenav-close-open-btn ${togglesidenav?'close-open-btn-active':''}`} onClick={()=>dispatch(toggleSideNavBtn())}>
                <KeyboardDoubleArrowLeftIcon/>
            </div>
            {/* nav links comes here */}
                <div className='sidenav-navlinks'>
                    <ul>
                        <li>
                            <NavLink to='/'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <SpeedIcon sx={{fontSize:'22px'}}/>
                                        <p>Dashboard</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>
                        {/* <li>
                            <NavLink to='/showapplications'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <ArticleIcon sx={{fontSize:'22px'}}/>
                                        <p>show Applications</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li> */}
                        <li>
                            <NavLink to='/manageadmissions'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <StickyNote2Icon sx={{fontSize:'22px'}}/>
                                        <p>Admission Desk</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>
                        {/* <li>
                            <div className={`sidenav-each-link`} onClick={()=>setProfileState(prev=>prev==="profiles"?"":"profiles")}>
                                <div className='sidenav-each-link-div'>
                                    <PeopleIcon sx={{fontSize:'22px'}}/>
                                    <p>Profiles</p>
                                </div>
                                <div className={`rotate-profile-arrow-icon ${profileState==='profiles' ? 'active-rotate-profile-arrow-icon':''}`}>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </div>
                            <div className={`sidenav-subnav-profiles-outer ${profileState==='profiles'?'show-profiles-sidenav':''}`}>

                                
                                <div className={`sidenav-subnav-profiles`}>
                                    
                                    <div className='sidenav-manage-each-profiles' onClick={()=>setProfileEachState(prev=>prev==='manageadmin'?'':'manageadmin')}>
                                        <p>manage admin</p>
                                        <div className={`rotate-profile-arrow-icon ${profileEachState==='manageadmin' ? 'active-rotate-profile-arrow-icon':''}`}>
                                            <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                        </div>
                                    </div>
                                    <div className={profileEachState==='manageadmin'?'active-manage-each-profile':'inactive-manage-each-profile'}>
                                        <NavLink to='/createadmin'>
                                            <div className='sidenav-each-link'>
                                                <div className='manage-each-profile-link-div'>
                                                    <AdminPanelSettingsIcon sx={{fontSize:'22px'}}/>
                                                    <p>create admin</p>
                                                </div>
                                            </div>
                                        </NavLink>
                                        <NavLink to='/viewadmins'>
                                            <div className='sidenav-each-link'>
                                                <div className='manage-each-profile-link-div'>
                                                    <VisibilityIcon sx={{fontSize:'22px'}}/>
                                                    <p>view admin</p>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>

                                    <div className='sidenav-manage-each-profiles' onClick={()=>setProfileEachState(prev=>prev==='manageteacher'?'':'manageteacher')}>
                                        <p>manage teacher</p>
                                        <div className={`rotate-profile-arrow-icon ${profileEachState==='manageteacher' ? 'active-rotate-profile-arrow-icon':''}`}>
                                            <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                        </div>
                                    </div>
                                    <div className={profileEachState==='manageteacher'?'active-manage-each-profile':'inactive-manage-each-profile'}>
                                        <NavLink to='/createteacher'>
                                            <div className='sidenav-each-link'>
                                                <div className='manage-each-profile-link-div'>
                                                    <PersonAddAlt1Icon sx={{fontSize:'22px'}}/>
                                                    <p>create teacher</p>
                                                </div>
                                            </div>
                                        </NavLink>
                                        <NavLink to='/viewteachers'>
                                            <div className='sidenav-each-link'>
                                                <div className='manage-each-profile-link-div'>
                                                    <VisibilityIcon sx={{fontSize:'22px'}}/>
                                                    <p>view teacher</p>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>


                                </div>
                            </div>
                        </li> */}

                        <li>
                            <NavLink to='/manageprofiles'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <StickyNote2Icon sx={{fontSize:'22px'}}/>
                                        <p>profiles</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/viewstudents'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <SupervisorAccountIcon sx={{fontSize:24}}/>
                                        <p>Students</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/manageclasses'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <ClassIcon sx={{fontSize:22}}/>
                                        <p>manage classes</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/manageattendence'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <EmojiPeopleIcon sx={{fontSize:22}}/>
                                        <p>Attendence log</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/managefees'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <PaymentsIcon sx={{fontSize:22}}/>
                                        <p>manage fee</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/manageexpense'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <AccountBalanceWalletIcon sx={{fontSize:22}}/>
                                        <p>manage Expense</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/managetransport'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <DirectionsBusIcon sx={{fontSize:22}}/>
                                        <p>manage Transport</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/manageinventory'>
                                <div className='sidenav-each-link'>
                                    <div className='sidenav-each-link-div'>
                                        <InventoryIcon sx={{fontSize:22}}/>
                                        <p>manage Inventory</p>
                                    </div>
                                    <KeyboardArrowRightIcon sx={{fontSize:20}}/>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Sidenav;