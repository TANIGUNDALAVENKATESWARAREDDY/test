import React, { useEffect,useRef } from 'react';
import './App.css';
import {Routes,Route, Navigate, useNavigate} from 'react-router-dom';
import Application from './Components/Admissions/Application';
import Trackapplication from './Components/Admissions/Trackapplication';
// import StaffDashboard from './Components/Dashboards/StaffDashboard/StaffDashboard';
import AdminDashboard from './Components/Dashboards/AdminDashboard/AdminDashboard';
import ShowApplications from './Components/ShowApplications/ShowApplications';
import Profilepage from './Components/AccountsProfile/Profilepage/Profilepage';
import ParentsDashboard from './Components/Dashboards/ParentsDashboard/ParentsDashboard';
import StudentDashboard from './Components/Dashboards/StudentDashboard/StudentDashboard';
import Admissionform from './Components/Admissions/Admissionform';
import {useDispatch, useSelector} from 'react-redux';
import Login from './Components/Login/Login';
import Admissions from './Components/Admissions/Admissions';
import Createadmin from './Components/Profiles/Createadmin/Createadmin';
import Oldadmissionform from './Components/Admissions/Oldadmissionfom';
import Createteacher from './Components/Profiles/Createteacher/Createteacher';
import Viewteachers from './Components/Profiles/Createteacher/Viewteachers';
import Eachteacherview from './Components/Profiles/Createteacher/Eachteacherview';
import Viewadmins from './Components/Profiles/Createadmin/Viewadmins';
import Eachadminview from './Components/Profiles/Createadmin/Eachadminview';
import Findstudent from './Components/Students/Findstudent/Findstudent';
import Viewstudents from './Components/Students/Viewstudents/Viewstudents';
import Eachstudent from './Components/Students/Eachstudent/Eachstudent';
import Manageclsindex from './Components/Manageclasses/Manageclsindex/Manageclsindex';
import Addsection from './Components/Manageclasses/Addsection/Addsection';
import Managefeeidx from './Components/Managefee/Managefeeidx/Managefeeidx';
import Changefee from './Components/Managefee/Changefees/Changefees';
import Assignsection from './Components/Manageclasses/Assignsection/Assignsection';
import Admissionindex from './Components/Admissions/Admissionindex/Admissionindex';
import Feepayments from './Components/Managefee/Feepayments/Feepayments';
import Studentfeehistory from './Components/Managefee/Studentfeehistory/Studentfeehistory';
import Admissionemployees from './Components/Admissions/Admissionemployees/Admissionemployees';
import Createadmissioinemp from './Components/Admissions/Createadmissionemp/Createadmissionemp';
import Admissioneachview from './Components/Admissions/Createadmissionemp/Admissioneachview';
import Managecourses from './Components/Manageclasses/Managecourses/Managecourses';
import Managetransportidx from './Components/ManageTransport/Managetransportidx/Managetransportidx';
import Manageexpenseidx from './Components/ManageExpense/Manageexpenseidx/Manageexpenseidx';
import Manageinventoryidx from './Components/ManageInventory/Manageinventoryidx/Manageinventoryidx';
import Profilesidx from './Components/Profiles/Profilesidx/Profilesidx';
import Createtimetable from './Components/Manageclasses/Managetimetable/Createtimetable/Createtimetable';
import Viewtimetable from './Components/Manageclasses/Managetimetable/Viewtimetable/Viewtimetable';
import Eachstudentfeehistory from './Components/Managefee/Eachstudentfeehistory/Eachstudentfeehistory';
import AttendenceIdx from './Components/ManageAttendence/AttendenceIdx/AttendenceIdx';
import Createstaff from './Components/Profiles/Createstaff/Createstaff';
import AddSubjectsToClass from './Components/Manageclasses/AddSubjectsToClass/AddSubjectsToClass';
import AllClasses from './Components/Manageclasses/Managenotes/AllClasses/AllClasses';
import AllSubjects from './Components/Manageclasses/Managenotes/AllSubjects/AllSubjects';
import AllChapters from './Components/Manageclasses/Managenotes/AllChapters/AllChapters';
import AllTopics from './Components/Manageclasses/Managenotes/AllTopics/AllTopics';
import { API_URL, socket } from './Data/Docs';
import { storeUserLoginDetails } from './ReduxStates/Userdata';
import TeachersAllocation from './Components/Manageclasses/TeachersAllocation/TeachersAllocation';
import Errorpage from './Components/Error/Errorpage';
import TeachersDashboard from './Components/Dashboards/TeachersDashboard/TeachersDashboard';
import TeacherAccount from './Components/AccountsProfile/TeacherAccount/TeacherAccount';
import StudentAccount from './Components/AccountsProfile/StudentAccount/StudentAccount';
import { Logout } from './Components/AllFunctions/Logout';
import StaffDashboard from './Components/Dashboards/StaffDashboard/StaffDashboard';
import ViewStaff from './Components/Profiles/Createstaff/ViewStaff';
import EachStaffView from './Components/Profiles/Createstaff/EachStaffView';
import PasswordChange from './Components/PasswordChange/PasswordChange';
import TownsAndFee from './Components/ManageTransport/TownsAndFee/TownsAndFee';
import PayTransportFee from './Components/ManageTransport/PayTransportFee/PayTransportFee';
import TransportFeeHistory from './Components/ManageTransport/TransportFeeHistory/TransportFeeHistory';
import EnableTransport from './Components/ManageTransport/EnableTransport/EnableTransport';
import EachStudentTransport from './Components/ManageTransport/EachStudentTransport/EachStudentTransport';

function App() {
  // const isAuthed = useSelector((state)=>state.basicstates.isAuthed);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state)=>state.userdata.isLoggedIn);
  // const showLoading = useSelector((state)=>state.userdata.showLoading);
  const role = useSelector((state)=>state.userdata.role);
  const regid = useSelector((state)=>state.userdata.regid);

  const fetchCheckOnlyOnce = useRef(false);



  useEffect(()=>{
    // console.log('hello world!!!');
    if(!fetchCheckOnlyOnce.current){
      async function handleFetchUserData(){
        try{
          const response = await fetch(`${API_URL}/users/checkauth`,{
            method:'GET',
            credentials:'include'
          });

          if (!response.ok) {
            if (response.status === 401) {
              Logout(dispatch,navigate);
              throw new Error('Unauthorized - Token expired');
            }
            throw new Error(response.statusText || 'Request failed');
          }
          
          const resData = await response.json();
          // console.log('here is the response data',resData);
          if(resData.success){
            socket.emit("joinRoom",resData.user.username);
            dispatch(storeUserLoginDetails({
              isLoggedIn:true,
              role:resData.user.role,
              regid:resData.user.username
          }));
          }
        }catch(err){
          console.log('getting an error while fetching the users data',err);
        }
      }
      handleFetchUserData()
      fetchCheckOnlyOnce.current=true;
    }
  },[dispatch,navigate]);
  return (
   
      <Routes>
        
        <Route path='/' element={(isLoggedIn && role!=='' && regid!=='')?(role==='superadmin'||role==='admin')?
        <AdminDashboard/>:(role==='teacher')?<Navigate to='/teacherdashboard' replace/>:(role==='staff')?<StaffDashboard/>:
        <StudentDashboard/>:<Navigate to='/login' replace/>} />

        <Route path='/login' element={isLoggedIn?<Navigate to='/' replace/>:<Login/>}/>
        <Route path='/applicationform' element={<Application/>}/>
        <Route path='/trackapplication' element={<Trackapplication/>}/>
        { (isLoggedIn && role!=='' && regid!=='') &&
        <>
          {/* dashboards */}
          <Route path='/teacherdashboard' element={<TeachersDashboard/>}/>{/* teachers dashboard */}

          {/* admission page */}
          <Route path='/manageadmissions' element={<Admissionindex/>}/>
          <Route path='/manageadmissions/showapplications' element={<ShowApplications/>}/>
          <Route path='/manageadmissions/admissions' element={<Admissions/>}/>
          <Route path='/manageadmissions/admissionform/:id' element={<Admissionform/>}/>
          <Route path='/manageadmissions/admissions/oldadmissionform' element={<Oldadmissionform/>}/>
          <Route path='/manageadmissions/admissionemployees' element={<Admissionemployees/>}/>
          <Route path='/manageadmissions/createadmissionemployee' element={<Createadmissioinemp/>}/>
          <Route path='/manageadmissions/admissionemployees/:admemployeeid' element={<Admissioneachview/>}/>


          {/* students dashboard */}
          <Route path='/studentdashboard' element={<StudentDashboard/>}/>
          {/* parents dashboard */}
          <Route path='/parentsdashboard' element={<ParentsDashboard/>}/>
          {/* profiles */}
          <Route path='/manageprofiles' element={<Profilesidx/>}/>

          <Route path='/profile' element={(role==='admin'||role==='superadmin')?<Profilepage/>:role==='teacher'?<TeacherAccount/>:<StudentAccount/>}/>


          <Route path='/manageprofiles/createadmin' element={<Createadmin/>}/>
          <Route path='/manageprofiles/viewadmins' element={<Viewadmins/>}/>
          <Route path='/manageprofiles/viewadmins/:adminid' element={<Eachadminview/>}/>
          <Route path='/manageprofiles/createstaff' element={<Createstaff/>}/>
          <Route path='/manageprofiles/viewstaff' element={<ViewStaff/>}/>
          <Route path='/manageprofiles/viewstaff/:staffid' element={<EachStaffView/>}/>

          <Route path='/manageprofiles/createteacher' element={<Createteacher/>}/>
          <Route path='/manageprofiles/viewteachers' element={<Viewteachers/>}/>
          <Route path='/manageprofiles/viewteachers/:teacherid' element={<Eachteacherview/>}/>

          {/* students */}
          <Route path='/viewstudents' element={<Viewstudents/>}/>
          <Route path='/viewstudents/findstudent' element={<Findstudent/>}/>
          <Route path='/viewstudents/:studentid' element={<Eachstudent/>}/>

          {/* class management system */}
          <Route path='/manageclasses' element={<Manageclsindex/>}/>
          <Route path='/manageclasses/addsection' element={<Addsection/>}/>
          <Route path='/manageclasses/assignsection' element={<Assignsection/>}/>
          <Route path='/manageclasses/managecourses' element={<Managecourses/>}/>
          <Route path='/manageclasses/managetimetable/createtimetable' element={<Createtimetable/>}/>
          <Route path='/manageclasses/managetimetable/viewtimetable' element={<Viewtimetable/>}/>
          <Route path='/manageclasses/addsubjectstoclass' element={<AddSubjectsToClass/>}/>
          <Route path='/manageclasses/teachersallocation' element={<TeachersAllocation/>}/>

          {/* note book management */}
          <Route path='/manageclasses/managenotes/allclasses' element={<AllClasses/>}/>
          <Route path='/manageclasses/managenotes/allclasses/:classid' element={<AllSubjects/>}/>
          <Route path='/manageclasses/managenotes/allclasses/:classid/:subjectid' element={<AllChapters/>}/>
          <Route path='/manageclasses/managenotes/allclasses/:classid/:subjectid/:chapterid' element={<AllTopics/>}/>


          {/* fee management system */}
          <Route path='/managefees' element={<Managefeeidx/>}/>
          <Route path='/managefees/changefee' element={<Changefee/>}/>
          <Route path='/managefees/feepayments' element={<Feepayments/>}/>
          <Route path='/managefees/studentsfeehistory' element={<Studentfeehistory/>}/>
          <Route path='/managefees/studentsfeehistory/:classid/:sectionid/:studentid' element={<Eachstudentfeehistory/>}/>

          {/* manage transport */}
          <Route path='/managetransport' element={<Managetransportidx/>}/>
          <Route path='/managetransport/townsandfee' element={<TownsAndFee/>}/>
          <Route path='/managetransport/paytransportfee' element={<PayTransportFee/>}/>
          <Route path='/managetransport/transportfeehistory' element={<TransportFeeHistory/>}/>
          <Route path='/managetransport/enabletransport' element={<EnableTransport/>}/>
          <Route path='/managetransport/transportfeehistory/:stdid' element={<EachStudentTransport/>}/>

          {/* manage Expense */}
          <Route path='/manageexpense' element={<Manageexpenseidx/>}/>

          {/* Inventory management */}
          <Route path='/manageinventory' element={<Manageinventoryidx/>}/>

          {/* attendence management */}
          <Route path='/manageattendence' element={<AttendenceIdx/>} />

          {/* password change */}
          <Route path='/changepassword' element={<PasswordChange/>}/>
        </>
        }
        
        {/* <Route path='/*' element={isLoggedIn?<Navigate to='/error' replace/>:<Navigate to='/login' replace/>}/> */}
        <Route path='/*' element={<Errorpage/>}/>
       

      </Routes>
    
    
  );
}

export default App;