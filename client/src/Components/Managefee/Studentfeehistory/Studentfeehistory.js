import React, { useEffect, useRef, useState } from "react";
import './Studentfeehistory.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addedNewSection, sectionModified, updateSections } from "../../../ReduxStates/Sections";
import { API_URL, socket } from "../../../Data/Docs";
import { updateStudentsFeeHistory , updateStdClassSection, tempUpdateStudentFeeData } from "../../../ReduxStates/Studentsdata/Stdfeehistory";
import { Logout } from "../../AllFunctions/Logout";
import DownloadExcel from "../../DownloadExcel/DownloadExcel";
import SearchIcon from '@mui/icons-material/Search';

function Studentfeehistory(){
    const navigate = useNavigate();
    const classSections = useSelector((state)=>state.sections.data);
    const dispatch = useDispatch();
    const fetchCheckOnlyOnce = useRef(false)
    const userRole = useSelector((state)=>state.userdata.role);

    //search states
    const[searchIdAndName,setSearchIdAndName] = useState('');
    const[percentageType , setPercentageType] = useState('greaterthan');
    const[filterPercentage,setFilterPercentage] = useState(0);

    const[tempClassData,setTempClassData] = useState({
        class:'',
        section:''
    });

    //we have to remove this one once we completed with update student profile--------------------------------------------------------------
    const [studentTotalFeeModify,setStudentTotalFeeModify] = useState({//student fee modification
        class:'',
        section:'',
        totalfee:'',
        stdregid:'',
        totalpaid:'',
        feediscount:''
    });

    const [studentTotalDiscountModify,setStudentTotalDiscountModify] = useState({//student discount modification
        class:'',
        section:'',
        totalfee:'',
        stdregid:'',
        totalpaid:'',
        feediscount:''
    });

    const [studentTotalPaidModify,setStudentTotalPaidModify] = useState({//student total paid modification
        class:'',
        section:'',
        totalfee:'',
        stdregid:'',
        totalpaid:'',
        feediscount:''
    });

    function handleModifyStudentTotalFee(e,tempStdData){ //total
        // console.log(tempStdData);
        e.preventDefault();
        setStudentTotalFeeModify(prev=>({
            ...prev,
            class:tempStdData.stdclass,
            section:tempStdData.stdsectionid,
            totalfee:Number(e.target.value),
            stdregid:tempStdData.stdregid,
            totalpaid:Number(tempStdData.stdtotalpaid),
            feediscount:Number(tempStdData.stdfeediscount)
        }));
    }

    function handleModifyStudentTotalDiscount(e,tempStdData){ //total discount
        // console.log(e.target.value);
        e.preventDefault();
        setStudentTotalDiscountModify(prev=>({
            ...prev,
            class:tempStdData.stdclass,
            section:tempStdData.stdsectionid,
            totalfee:Number(tempStdData.stdtotalfee),
            stdregid:tempStdData.stdregid,
            totalpaid:Number(tempStdData.stdtotalpaid),
            feediscount:Number(e.target.value)
        }));
    }

    function handleModifyStudentTotalPaid(e,tempStdData){ //total discount
        // console.log(e.target.value);
        e.preventDefault();
        setStudentTotalPaidModify(prev=>({
            ...prev,
            class:tempStdData.stdclass,
            section:tempStdData.stdsectionid,
            totalfee:Number(tempStdData.stdtotalfee),
            stdregid:tempStdData.stdregid,
            totalpaid:Number(e.target.value),
            feediscount:Number(tempStdData.stdfeediscount)
        }));
    }



    async function handleUpdateStudentTotalFee(e,data){
        e.preventDefault();
        try{
            const updateres = await fetch(`${API_URL}/studentfee/tempupdatefeediscountpaid`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:'include',
                body:JSON.stringify(data)
            });

            if(!updateres.ok){
                if(updateres.status === 401) {
                    alert('Your session is expired,please login again');
                    Logout(dispatch,navigate);
                    throw new Error('Unauthorized - Token expired');
                }
                throw new Error(`HTTP error! status: ${updateres.status}`);
            }

            const resData = await updateres.json();
            if(!resData.success){
                alert(`${resData.message}`);
            }

        }catch(err){
            console.log('getting an error while updatin the data')
        }

    }

    //-------------------------------------------------------------------------ends here----------------------------------------------------

    // const[totalfeeDue, setTotalFeeDue] = useState(0);
    // let dueValue =0;

    const FeeHistoryStudents = useSelector((state)=>state.stdfeehistory.data);
    const FeeHistoryClass = useSelector((state)=>state.stdfeehistory.class);
    const FeeHistorySection = useSelector((state)=>state.stdfeehistory.section);

    //excel sheet download data
    const formattedData = FeeHistoryStudents
        .filter((studentnameitem)=>(studentnameitem.stdregid.includes(searchIdAndName)||`${studentnameitem.stdfirstname} ${studentnameitem.stdmiddlename} ${studentnameitem.stdlastname}`.toLowerCase().includes(searchIdAndName.toLowerCase())))
        .filter((studentitem)=>{
            const tempFeeAfterDiscount = studentitem.stdtotalfee-(studentitem.stdtotalfee*studentitem.stdfeediscount/100);
            const tempTotalFeeAfterPercentage = (filterPercentage*tempFeeAfterDiscount)/100;
            return percentageType==='lessthan'?studentitem.stdtotalpaid<tempTotalFeeAfterPercentage:studentitem.stdtotalpaid>=tempTotalFeeAfterPercentage;
        }).map((item) => {
        const feeAfterDiscount = item.stdtotalfee - (item.stdtotalfee * item.stdfeediscount / 100);
        const feeDue = feeAfterDiscount - item.stdtotalpaid;

        return {
            "Reg.ID": item.stdregid,
            "Student Name": `${item.stdfirstname} ${item.stdmiddlename} ${item.stdlastname}`,
            "Mobile.No":item.stdparentorguard==='parents'?item.stdfatherphone:item.stdguardphone,
            "Total Fee": item.stdtotalfee,
            "Fee Discount (%)": item.stdfeediscount,
            "Fee After Discount": feeAfterDiscount,
            "Total Paid": item.stdtotalpaid,
            "Fee Due": feeDue
        };
    });



    async function fetchStudentsFeeData(e){
        e.preventDefault();
        try{
            // console.log('fetching the students fee data');
            if(tempClassData.class!=='' && tempClassData.section!==''){
                dispatch(updateStdClassSection(tempClassData));
                const response = await fetch(`${API_URL}/studentfee/studentsfeehistory`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(tempClassData),
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
                    // setStdData(resData.studentsdata);
                    dispatch(updateStudentsFeeHistory(resData.studentsdata));
                }else{
                    const tmpdata=[];
                    dispatch(updateStudentsFeeHistory(tmpdata));
                }
            }else{
                alert('please all the required fields');
            }
            
        }catch(err){
            console.error('you getting an error while fetching the students fee data',err);
            alert('getting an error while fetching the students data');
        }
    }

    function getWholeFeeDue(){
        let calculatedDueValue = 0;
        FeeHistoryStudents.forEach(item => {
        calculatedDueValue += item.stdtotalfee - (item.stdtotalfee * item.stdfeediscount / 100) - item.stdtotalpaid;
        });
        return calculatedDueValue;
    }


    useEffect(()=>{
        if(!fetchCheckOnlyOnce.current){

            const handletempModifyStudentFeeData=(data)=>{
                // console.log('fee history data',data);
                dispatch(tempUpdateStudentFeeData(data.data))
            }

            if(!socket.hasListeners('tempModifiystudentFee')){
                socket.on('tempModifiystudentFee',handletempModifyStudentFeeData)
            }
            
            if(classSections.length===0){

                const handleModifiedSection = (data)=>{//if data modified this function will triggered
                    dispatch(sectionModified(data.data));
                }

                if(!socket.hasListeners('sectionModified')){
                    socket.on('sectionModified',handleModifiedSection);
                }

                const handleAddedNewSection = (data) =>{//if new section is added this function will triggered
                    dispatch(addedNewSection(data.data));
                }

                if(!socket.hasListeners('addedNewSection')){
                    socket.on('addedNewSection',handleAddedNewSection);
                }

                async function fetchSections(){
                    try{
                        const response = await fetch(`${API_URL}/sections/getsections`,{
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
                        const tempSections = await response.json();
                        if( tempSections.allSections.length>0){
                             dispatch(updateSections(tempSections.allSections));
                        }
                        // console.log('here is the all sections data',tempSections);
                    }catch(err){
                        console.log('getting error while fetching the sections data',err);
                    }
                }
                fetchSections();
            }
        }
    },[classSections.length,navigate,dispatch]);
    // console.log('here is the section: ',classSections);

    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='admissionform-top-back-btn' style={{marginBottom:5,marginTop:15}} onClick={()=>navigate(-1)} >
                            <KeyboardArrowLeftIcon/>
                            <p>back</p>
                        </div>
                        <form className="studentfeehistory-form">
                            {/* form heading */}
                            <div className="studentfeehistory-form-heading">
                                <p>Student Fee History Form</p>
                            </div>

                            <div className="studentfeehistory-collecting-data">
                                <div className="studentfeehistory-collecting-data-each">
                                    <label>class</label>
                                    <select value={tempClassData.class} onChange={(e)=>setTempClassData(prev=>({
                                        ...prev,
                                        class:e.target.value
                                    }))}>
                                        <option value=''>Select Class</option>
                                        <option value="nursery">Nursery</option>
                                        <option value="LKG">LKG</option>
                                        <option value="UKG">UKG</option>
                                        <option value="1">Class 1</option>
                                        <option value="2">Class 2</option>
                                        <option value="3">Class 3</option>
                                        <option value="4">Class 4</option>
                                        <option value="5">Class 5</option>
                                        <option value="6">Class 6</option>
                                        <option value="7">Class 7</option>
                                        <option value="8">Class 8</option>
                                        <option value="9">Class 9</option>
                                        <option value="10">Class 10</option>
                                    </select>
                                </div>
                                <div className="studentfeehistory-collecting-data-each">
                                    <label>Section</label>
                                    <select value={tempClassData.section} onChange={(e)=>setTempClassData(prev=>({
                                        ...prev,
                                        section:e.target.value
                                    }))}>
                                        <option value=''>Select Section</option>
                                        {
                                            classSections.filter((item)=>item.class===tempClassData.class).map((section,idx)=>(
                                                <option key={idx} value={section._id}>{section.sectionname}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="studentfeehistory-collecting-data-each">
                                    <button style={{whiteSpace:'nowrap'}} onClick={(e)=>fetchStudentsFeeData(e)}>Get Fee History</button>
                                </div>
                            </div>
                        </form>

                        {/* student fee history table */}
                        {
                            FeeHistoryStudents.length>0 &&
                            <div className="studentfeehistory-dwnbtn-div">
                                <button className="studentfeehistory-download-btn" onClick={()=>DownloadExcel(formattedData,`class_${FeeHistoryClass}_${classSections.filter(item=>item._id===FeeHistorySection).length>0?classSections.filter(item=>item._id===FeeHistorySection)[0].sectionname:''}_FeeHistory`)}>download</button>
                            </div>
                        }
                        {
                            FeeHistoryStudents.length>0 && 
                            <div style={{background:'white',marginTop:10}}>
                                <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
                                    <div className="studentfeehistory-form-heading" style={{border:'none',paddingTop:10}}>
                                        <p>Class '{FeeHistoryClass}' - Section '{classSections.filter(item=>item._id===FeeHistorySection).length>0?classSections.filter(item=>item._id===FeeHistorySection)[0].sectionname:''}' <span style={{marginLeft:8}}>Fee History</span></p>
                                    </div>

                                    <div className="studentsfeehistroy-totalfeedue" style={{paddingLeft:10}}>
                                        <p>Total Due: <span style={{color:'green'}}>{getWholeFeeDue()}</span></p>
                                    </div>
                                </div>

                                {/* search option and filter option */}
                                <div className="studentfeehistory-search-filter">
                                    <div className="studentfeehistory-search">
                                        <SearchIcon sx={{fontSize:18,color:'grey'}}/>
                                        <input type="text" placeholder="RegID/Student Name" value={searchIdAndName} onChange={(e)=>setSearchIdAndName(e.target.value)}/>
                                    </div>
                                    <div className="studentfeehistory-filter">
                                        <select value={percentageType} onChange={(e)=>setPercentageType(e.target.value)}>
                                            <option value='lessthan'>Lessthan</option>
                                            <option value='greaterthan'>Greaterthan</option>
                                        </select>
                                        <input type="number" min={0} max={100} value={filterPercentage}
                                        onChange={(e)=>{
                                            const tempval = e.target.value>100?100:e.target.value<0?0:e.target.value;
                                            setFilterPercentage(tempval);
                                        }}
                                        /><small>%</small>
                                    </div>
                                </div>
                                
                                <div className="show-application-whole-inner-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Reg.ID</th>
                                                <th>Student Name</th>
                                                <th>Mobile.No</th>
                                                <th>Total Fee</th>
                                                <th>Fee discount(%)</th>
                                                <th>Fee After discount</th>
                                                <th>Total Paid</th>
                                                <th>Fee Due</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                FeeHistoryStudents
                                                .filter((studentnameitem)=>(studentnameitem.stdregid.includes(searchIdAndName)||`${studentnameitem.stdfirstname} ${studentnameitem.stdmiddlename} ${studentnameitem.stdlastname}`.toLowerCase().includes(searchIdAndName.toLowerCase())))
                                                .filter((studentitem)=>{
                                                    const tempFeeAfterDiscount = studentitem.stdtotalfee-(studentitem.stdtotalfee*studentitem.stdfeediscount/100);
                                                    const tempTotalFeeAfterPercentage = (filterPercentage*tempFeeAfterDiscount)/100;
                                                    return percentageType==='lessthan'?studentitem.stdtotalpaid<tempTotalFeeAfterPercentage:studentitem.stdtotalpaid>=tempTotalFeeAfterPercentage;
                                                }).map((item,idx)=>{
                                                    // dueValue+=item.stdtotalfee-(item.stdtotalfee*item.stdfeediscount/100)-item.stdtotalpaid;
                                                    // console.log(dueValue);
                                                    return(
                                                    <tr key={idx} className="studentfeehistory-eachstudent-row" onClick={()=>navigate(`/managefees/studentsfeehistory/${FeeHistoryClass}/${FeeHistorySection}/${item.stdregid}`)}>
                                                        <td style={{textTransform:'none'}}>{item.stdregid}</td>
                                                        <td>{`${item.stdfirstname} ${item.stdmiddlename} ${item.stdlastname}`}</td>
                                                        <td>{item.stdparentorguard==='parents'?item.stdfatherphone:item.stdguardphone}</td>
                                                        {/* <td>{item.stdtotalfee}</td> */}
                                                        {
                                                            userRole==='superadmin'?
                                                            <td onClick={(e)=>{
                                                                e.stopPropagation();
                                                            }}>
                                                                <input style={{width:100}} type="number" value={(item.stdclass===studentTotalFeeModify.class && item.stdsectionid===studentTotalFeeModify.section && item.stdregid===studentTotalFeeModify.stdregid && item.stdtotalfee!==studentTotalFeeModify.totalfee)?Number(studentTotalFeeModify.totalfee):Number(item.stdtotalfee)} onChange={(e)=>handleModifyStudentTotalFee(e,item)}/>
                                                                {item.stdclass===studentTotalFeeModify.class && item.stdsectionid===studentTotalFeeModify.section && item.stdregid===studentTotalFeeModify.stdregid && item.stdtotalfee!==studentTotalFeeModify.totalfee && <p className="studentfeehistory-temp-update-btn" onClick={(e)=>handleUpdateStudentTotalFee(e,studentTotalFeeModify)}>update</p>}
                                                            </td>:
                                                            <td>
                                                                <p>{item.stdtotalfee}</p>
                                                            </td>
                                                        }
                                                        
                                                        {
                                                            userRole==='superadmin'?
                                                            <td onClick={(e)=>{
                                                                e.stopPropagation();
                                                            }}>
                                                                {/* {item.stdfeediscount} */}
                                                                <input style={{width:100}} type="number"  min={0} max={100} value={(item.stdclass===studentTotalDiscountModify.class && item.stdsectionid=== studentTotalDiscountModify.section && item.stdregid===studentTotalDiscountModify.stdregid && Number(item.stdfeediscount)!==Number(studentTotalDiscountModify.feediscount))?studentTotalDiscountModify.feediscount:item.stdfeediscount}
                                                                 onChange={(e)=>handleModifyStudentTotalDiscount(e,item)}/>
                                                                {(item.stdclass===studentTotalDiscountModify.class && item.stdsectionid=== studentTotalDiscountModify.section && item.stdregid===studentTotalDiscountModify.stdregid && Number(item.stdfeediscount)!==Number(studentTotalDiscountModify.feediscount)) && <p className="studentfeehistory-temp-update-btn" onClick={(e)=>handleUpdateStudentTotalFee(e,studentTotalDiscountModify)}>update</p>}
                                                            </td>:
                                                            <td>
                                                                <p>{item.stdfeediscount}</p>
                                                            </td>
                                                        }
                                                        
                                                        <td>
                                                            <p className="stdfeehistory-feeafterdis-feenum">{item.stdtotalfee-(item.stdtotalfee*item.stdfeediscount/100)}</p>
                                                        </td>
                                                        {
                                                            userRole==='superadmin'?
                                                            <td 
                                                            onClick={(e)=>{
                                                                e.stopPropagation();
                                                            }}
                                                            >
                                                                {/* {item.stdtotalpaid} */}
                                                                <input style={{width:100}} type="number" min={0} max={0} value={(item.stdclass===studentTotalPaidModify.class && item.stdsectionid===studentTotalPaidModify.section && item.stdregid===studentTotalPaidModify.stdregid && Number(item.stdtotalpaid)!==Number(studentTotalPaidModify.totalpaid))?Number(studentTotalPaidModify.totalpaid):Number(item.stdtotalpaid)}
                                                                onChange={(e)=>handleModifyStudentTotalPaid(e,item)}
                                                                />
                                                                {item.stdclass===studentTotalPaidModify.class && item.stdsectionid===studentTotalPaidModify.section && item.stdregid===studentTotalPaidModify.stdregid && Number(item.stdtotalpaid)!==Number(studentTotalPaidModify.totalpaid) && <p className="studentfeehistory-temp-update-btn" onClick={(e)=>handleUpdateStudentTotalFee(e,studentTotalPaidModify)}>update</p>}
                                                            </td>:
                                                            <td>
                                                                <p className="stdfeehistory-feeafterdis-feenum-two">{Number(item.stdtotalpaid)}</p>
                                                            </td>
                                                        }
                                                        
                                                        <td >
                                                            <p className="stdfeehistory-feeafterdis-feenum-three">
                                                                {item.stdtotalfee-(item.stdtotalfee*item.stdfeediscount/100)-item.stdtotalpaid}
                                                            </p>
                                                        </td>
                                                    </tr>)
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Studentfeehistory;