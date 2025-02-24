import React, { useEffect, useRef, useState } from "react";
import './AllTopics.css';
import Topnav from "../../../Topnav/Topnav.js";
import Sidenav from "../../../Sidenav/Sidenav.js";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { API_URL, socket } from "../../../../Data/Docs.js";
import {v4 as uuidv4} from 'uuid';
import { useSelector ,useDispatch} from "react-redux";
import { addSingleTopicToChapter, deleteSingleTopicData, storeAllTopicsData, updateSingleTopicData, updateTopicClassSubjectChapterData } from "../../../../ReduxStates/Coursesdata/ClassTopicsData.js";
// import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../Firebase.js";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout } from "../../../AllFunctions/Logout.js";

function AllTopics(){
    const navigate = useNavigate();
    const location = useLocation();
    const {classid , subjectid , chapterid}= useParams();
    const subject_name = location.state?.subjectname;
    const chapter_number = location.state?.chapternumber;
    const chapter_name = location.state?.chaptername;
    //topics details data
    const [showloading,setshowloading] = useState(false);
    const [fileupload,setfileupload] = useState('');
    const[topicData , setTopicData] = useState({
        class:'',
        subjectid:'',
        chapterid:'',
        topicuid:'',
        topicname:'',
        topicnumber:'',
        uploadtype:'',
        topiclink:'',
        topicgeneratedurl:''
    });

    const [deleteTopic,setDeleteTopic] = useState({
        topicuid:'',
        topicname:'',
        topicnumber:'',
    });

    const [editTopic,setEditTopic] = useState({
        class:'',
        subjectid:'',
        chapterid:'',
        topicuid:'',
        topicname:'',
        topicnumber:'',
        uploadtype:'',
        topiclink:'',
        topicgeneratedurl:''
    });
    const[createAlert , setCreateAlert] = useState(false);
    const[deleteAlert , setDeleteAlert] = useState(false);
    const[editAlert , setEditAlert] = useState(false);
    function handleOpenCreateAlert(){ //function to open the create form
        setTopicData(prev=>({
            ...prev,
            class:classid,
            subjectid:subjectid,
            chapterid:chapterid,
        }));
        setCreateAlert(true);
    }

    function handleCloseCreateAlert(){
        setTopicData(prev=>({
            ...prev,
            class:'',
            subjectid:'',
            chapterid:'',
            topicuid:'',
            topicname:'',
            topicnumber:'',
            uploadtype:'',
            topiclink:'',
            topicgeneratedurl:''
        }));
        setCreateAlert(false);
    }

    function handleOpenDeleteAlert(topicData){
        setDeleteTopic(prev=>({
            ...prev,
            ...topicData
        }));
        setDeleteAlert(true);
    }

    function handleCloseDeleteAlert(){
        setDeleteTopic(prev=>({
            ...prev,
            topicuid:'',
            topicname:'',
            topicnumber:'',
        }));
        setDeleteAlert(false);
    }

    function handleOpenEditAlert(topicData){
        setEditTopic(prev=>({
            ...prev,
            ...topicData
        }));

        setEditAlert(true);
    }

    function handleCloseEditAlert(){
        setEditTopic(prev=>({
            ...prev,
            class:'',
            subjectid:'',
            chapterid:'',
            topicuid:'',
            topicname:'',
            topicnumber:'',
            uploadtype:'',
            topiclink:'',
            topicgeneratedurl:''
        }));

        setEditAlert(false);
    }
    //all topics data
    const fetchCheckOnlyOnce = useRef(false);
    const AllTopicsData = useSelector((state)=>state.classtopicsdata.data);
    const topicClass = useSelector((state)=>state.classtopicsdata.class);
    const topicSubject = useSelector((state)=>state.classtopicsdata.subject);
    const topicChapter = useSelector((state)=>state.classtopicsdata.chapter);
    const dispatch = useDispatch();

    //file handling 
    function handledocfile(e){
        const selectedFile = e.target.files[0];
        setfileupload(selectedFile)
    }


    //downloading the file url from datastorage
    const downloadfileurl = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                const storageref = ref(storage,`topics/${classid}/${topicData.topicname}`);
                const downloadurl = getDownloadURL(storageref);
                resolve(downloadurl);
            })
                
        }catch(e){
            console.log('you getting an error while downloading url ',e);
        }
    }


    //function to create a new function
    async function Add_New_Topic_To_Chapter(e){
        setCreateAlert(false);
        setshowloading(true);
        e.preventDefault();
        try{
            if(topicData.topicnumber!=='' && topicData.uploadtype!=='' && topicData.topicname!==''){
                
                if(topicData.uploadtype==='file'){

                    if(fileupload!==''){
                        var fileurl='';
                        try{
                            const storageref = ref(storage,`topics/${classid}/${topicData.topicname}`);
                            const response = await uploadBytes(storageref,fileupload);
                            if(response){
                                fileurl = await downloadfileurl();
                            }else{
                                console.log('response error');
                            }

                        }catch(error){
                            console.error('you got an error while uploading gthe file, ', error);
                            alert('you got an  error');
                        }

                        if(fileurl!==''){
                            const uuid = uuidv4();

                            const response = await fetch(`${API_URL}/classTopics/addNewTopic`,{
                                method:'POST',
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify({
                                    ...topicData,
                                    topicuid:uuid,
                                    topicgeneratedurl:fileurl
                                }),
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
                                setTopicData(prev=>({
                                    ...prev,
                                    class:'',
                                    subjectid:'',
                                    chapterid:'',
                                    topicuid:'',
                                    topicname:'',
                                    topicnumber:'',
                                    uploadtype:'',
                                    topiclink:'',
                                    topicgeneratedurl:''
                                }));
                                // setCreateAlert(false);
                                alert(resData.message);
                            }else{
                                alert(resData.message);
                            }
                            }
                    }else{
                        alert('please upload the file');
                    }

                }else{
                    const uuid = uuidv4();

                    const response = await fetch(`${API_URL}/classTopics/addNewTopic`,{
                        method:'POST',
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            ...topicData,
                            topicuid:uuid
                        }),
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
                        setTopicData(prev=>({
                            ...prev,
                            class:'',
                            subjectid:'',
                            chapterid:'',
                            topicuid:'',
                            topicname:'',
                            topicnumber:'',
                            uploadtype:'',
                            topiclink:'',
                            topicgeneratedurl:''
                        }));
                        // setCreateAlert(false);
                        alert(resData.message);
                    }else{
                        alert(resData.message);
                    }
                }

            }else{
                alert('please fill all required fields');
            }
        }catch(err){
            console.log('getting error while add mew topic to chapetr',err);
            alert('error while adding topic');
        }
        setshowloading(false);
    }

    async function Delete_Added_Topic_Of_A_Chapter(){
        setDeleteAlert(false);
        setshowloading(true);
        try{
            if(deleteTopic.uploadtype==='file'){
                if(deleteTopic.topicgeneratedurl!==''){
                    const desertRef = ref(storage,deleteTopic.topicgeneratedurl);
                    deleteObject(desertRef).then(() => {
                        console.log('deleted the imae storage url');
                    }).catch((error) => {
                        console.log("you got an error while deleting the storage",error);
                    });
                }
                const response = await fetch(`${API_URL}/classTopics/deleteTopic/${classid}/${subjectid}/${chapterid}/${deleteTopic.topicuid}`,{
                    method:'DELETE',
                    headers:{
                        "Content-Type":"application/json"
                    },
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
                    setDeleteTopic(prev=>({
                        ...prev,
                        topicuid:'',
                        topicname:'',
                        topicnumber:'',
                    }));
                    setDeleteAlert(false);
                    alert('successfully deleted');
                }else{
                    alert('error while deleting');
                }
            }else{
                const response = await fetch(`${API_URL}/classTopics/deleteTopic/${classid}/${subjectid}/${chapterid}/${deleteTopic.topicuid}`,{
                    method:'DELETE',
                    headers:{
                        "Content-Type":"application/json"
                    },
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
                    setDeleteTopic(prev=>({
                        ...prev,
                        topicuid:'',
                        topicname:'',
                        topicnumber:'',
                    }));
                    // setDeleteAlert(false);
                    alert('successfully deleted');
                }else{
                    alert('error while deleting');
                }
            }
        }catch(err){
            console.error('getting an error while deleting the topic',err);
            alert('error while deleting the topic');
        }
        setshowloading(false);
    }

    async function Edit_Added_Topic_Of_A_Chapter(e){
        setEditAlert(false);
        setshowloading(true);
        e.preventDefault();
        try{
            const response = await fetch(`${API_URL}/classTopics/editTopic/${classid}/${subjectid}/${chapterid}/${editTopic.topicuid}`,{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(editTopic),
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
                setEditTopic(prev=>({
                    ...prev,
                    class:'',
                    subjectid:'',
                    chapterid:'',
                    topicuid:'',
                    topicname:'',
                    topicnumber:'',
                    uploadtype:'',
                    topiclink:'',
                    topicgeneratedurl:''
                }));
        
                // setEditAlert(false);
                alert('successfully edited');
            }else{
                alert('error while editing');
            }
        }catch(err){
            console.error('getting an error while editing the topic',err);
            alert('error while editing the topic');
        }
        setshowloading(false);
    }
    useEffect(()=>{
        // console.log('fetched once');
        if(!fetchCheckOnlyOnce.current){

            if(classid!==topicClass||topicChapter!==chapterid||topicSubject!==subjectid){
                const handleAddNewTopicToChapter =(data)=>{
                    dispatch(addSingleTopicToChapter(data.data))
                }
                if(!socket.hasListeners('addNewTopicToChapter')){
                    socket.on('addNewTopicToChapter', handleAddNewTopicToChapter);
                }

                const handleDeleteTopicOfChapter =(data)=>{
                    dispatch(deleteSingleTopicData(data.data));
                }
                if(!socket.hasListeners('deleteTopicToChapter')){
                    socket.on('deleteTopicToChapter', handleDeleteTopicOfChapter);
                }

                const handleEditTopicOfChapter =(data)=>{
                    dispatch(updateSingleTopicData(data.data));
                }
                if(!socket.hasListeners('editTopicToChapter')){
                    socket.on('editTopicToChapter', handleEditTopicOfChapter);
                }


                
                async function  handleFetchAllTopicsData(){
                    try{
                        const response = await fetch(`${API_URL}/classTopics/getAllTopics/${classid}/${subjectid}/${chapterid}`,{
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
                            dispatch(storeAllTopicsData(resData.alltopics));
                            dispatch(updateTopicClassSubjectChapterData({
                                classid,
                                subjectid,
                                chapterid
                            }));
                        }
                    }catch(err){
                        console.error('getting an error while all topics of the data',err);
                    }
                }
                handleFetchAllTopicsData();
            }

            fetchCheckOnlyOnce.current=true;
        }

    },[topicClass,topicChapter,topicSubject,classid,subjectid,chapterid,navigate,dispatch]);


    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='allclasses-top-navigation'>
                            <p onClick={()=>navigate(-1)} style={{cursor:'pointer'}}>All Chapters</p>
                            <ChevronRightIcon sx={{fontSize:18}}/>
                            <p style={{color:'#1976d2',userSelect:'none'}}>Topics</p>
                         </div>
                         {/* subject name */}
                         <div className="alltopics-subjectname">
                            <h2>{classid} - {subject_name}</h2>
                         </div>
                         {/* topics container */}
                         <div className="alltopics-container">

                            <div className="alltopics-container-head">
                                <p><span>chapter {chapter_number} </span> : <span>{chapter_name}</span></p>
                            </div>
                            {/* here you will display all topics of the chapter */}
                            <div className="alltopics-display">
                            {
                                AllTopicsData.length>0 &&  classid === topicClass && subjectid === topicSubject && chapterid === topicChapter &&
                               AllTopicsData.map((topic,idx)=>(
                                <a key={idx} href={topic.uploadtype==='file'?topic.topicgeneratedurl:topic.topiclink} rel="noreferrer" target="_blank" style={{textDecoration:'none',color:'black'}}>
                                    <div  className="alltopics-display-eachtopic">
                                        <p>topic {topic.topicnumber} : <span style={{fontWeight:500}}>{topic.topicname}</span></p>
                                        <div className="alltopics-eachtopic-editbtns">
                                            <EditIcon
                                            onClick={(e)=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleOpenEditAlert(topic);
                                            }} sx={{fontSize:20 , color:'#17559f'}}/>
                                            <DeleteOutlineIcon onClick={(e)=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleOpenDeleteAlert(topic);
                                            }} sx={{fontSize:20,color:'red'}}/>
                                        </div>
                                    </div>
                                </a>
                               ))
                            }
                            </div>

                            <div className="allchapters-addchapter-btn" style={{minHeight:35}} onClick={()=>handleOpenCreateAlert()}>
                                <p><span style={{marginRight:5,fontSize:'1.1rem'}}>+</span>Add Topic</p>
                            </div>
                         </div>
                        

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
            <Dialog
            open={createAlert}
            onClose={handleCloseCreateAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
                <form className="alltopics-create-form">
                    <div style={{display:'flex',flexDirection:'column',
                        justifyContent:'flex-end',alignItems:'flex-end'}}
                        
                    >
                        <CloseIcon sx={{fontSize:22,cursor:'pointer'}} onClick={()=>handleCloseCreateAlert()} />
                    </div>
                    <h1 className="alltopics-form-head">Add New Topic</h1>
                    <div className="alltopics-form-inner-div">
                        <div>
                            <label>topic Number<span style={{color:'red'}}>*</span></label>
                            <input type='number' value={topicData.topicnumber} onChange={(e)=>setTopicData(prev=>({
                                ...prev,
                                topicnumber:e.target.value
                            }))}/>
                        </div>
                        <div>
                            <label>type<span style={{color:'red'}}>*</span></label>
                            <select value={topicData.uploadtype} onChange={(e)=>setTopicData(prev=>({
                                ...prev,
                                uploadtype:e.target.value
                            }))}>
                                <option value=''>Select Type</option>
                                <option value='link'>Link</option>
                                <option value='file'>File</option>
                            </select>
                        </div>
                    </div>

                    <div className="alltopics-form-each-div">
                        <label>Topic name<span style={{color:'red'}}>*</span></label>
                        <textarea placeholder="Enter Topic name..." value={topicData.topicname} onChange={(e)=>setTopicData(prev=>({
                            ...prev,
                            topicname:e.target.value
                        }))}/>
                    </div>
                    {
                        topicData.uploadtype==='link'?
                        <div className="alltopics-form-each-div">
                            <label>enter your link <span style={{color:'red'}}>*</span></label>
                            <input type='text' style={{color:'blue'}} value={topicData.topiclink} onChange={(e)=>setTopicData(prev=>({
                                ...prev,
                                topiclink:e.target.value
                            }))}/>
                        </div>:topicData.uploadtype==='file'?<input type='file' accept=".pdf" onChange={(e)=>handledocfile(e)}/>:<></>
                    }
                    <button onClick={(e)=>Add_New_Topic_To_Chapter(e)}>+ Add Topic</button>
                    
                </form>

            </Dialog>

            <Dialog
            open={deleteAlert}
            onClose={handleCloseDeleteAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
                <div className="addsubjecttoclass-form">
                    <p style={{textTransform:'capitalize'}}>are you sure you want to delete the <span style={{color:'blue'}}>topic {deleteTopic.topicnumber}</span> - <span style={{color:'red'}}>{deleteTopic.topicname}</span> </p>
                    <div className="addsubjectstoclass0-alert-form-btns">
                        <p onClick={()=>Delete_Added_Topic_Of_A_Chapter()}>Yes</p>
                        <p onClick={()=>handleCloseDeleteAlert()}>No</p>
                    </div>
                </div>
            </Dialog>

            <Dialog
            open={editAlert}
            onClose={handleCloseEditAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
                <form className="alltopics-create-form">
                    <div style={{display:'flex',flexDirection:'column',
                        justifyContent:'flex-end',alignItems:'flex-end'}}
                        
                    >
                        <CloseIcon sx={{fontSize:22,cursor:'pointer'}} onClick={()=>handleCloseEditAlert()} />
                    </div>
                    <h1 className="alltopics-form-head">Edit Topic</h1>
                    <div className="alltopics-form-inner-div">
                        <div>
                            <label>topic Number<span style={{color:'red'}}>*</span></label>
                            <input type='number' value={editTopic.topicnumber} onChange={(e)=>setEditTopic(prev=>({
                                ...prev,
                                topicnumber:e.target.value
                            }))}/>
                        </div>
                        <div style={{userSelect:'none'}}>
                            <label>type<span style={{color:'red'}}>*</span></label>
                            <input type='text' value={editTopic.uploadtype}  readOnly />
                        </div>
                    </div>

                    <div className="alltopics-form-each-div">
                        <label>Topic name<span style={{color:'red'}}>*</span></label>
                        <textarea placeholder="Enter Topic name..." value={editTopic.topicname} onChange={(e)=>setEditTopic(prev=>({
                            ...prev,
                            topicname:e.target.value
                        }))}/>
                    </div>
                    {
                        editTopic.uploadtype==='link'?
                        <div className="alltopics-form-each-div">
                            <label>enter your link <span style={{color:'red'}}>*</span></label>
                            <input type='text' style={{color:'blue'}} value={editTopic.topiclink} onChange={(e)=>setEditTopic(prev=>({
                                ...prev,
                                topiclink:e.target.value
                            }))}/>
                        </div>:<></>
                    }
                    <button onClick={(e)=>Edit_Added_Topic_Of_A_Chapter(e)}>+ Edit Topic</button>
                    
                </form>

            </Dialog>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default AllTopics;