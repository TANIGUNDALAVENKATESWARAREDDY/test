import React,{useEffect, useRef, useState} from "react";
import './AllChapters.css';
import Sidenav from "../../../Sidenav/Sidenav";
import Topnav from "../../../Topnav/Topnav";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import {v4 as uuidv4} from 'uuid';
import { API_URL, socket } from "../../../../Data/Docs";
import { useDispatch, useSelector } from "react-redux";
import { storeAllChaptersData, updateAddNewChapterData, updateChapterClassAndSubject, updateDeleteAddedChapterOfSubject, updateExistingChapterOfASubject } from "../../../../ReduxStates/Coursesdata/ClassChaptersData";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout } from "../../../AllFunctions/Logout";

function AllChapters(){
    const navigate = useNavigate();
    const location  = useLocation();
    const {classid,subjectid} = useParams();
    const subjectname = location.state?.subjectname;

    const fetchCheckOnlyOnce = useRef(false);

    const AllChaptersData = useSelector((state)=>state.classchaptersdata.data);
    const chapterClass = useSelector((state)=>state.classchaptersdata.class);
    const chapterSubject = useSelector((state)=>state.classchaptersdata.subject);
    const dispatch = useDispatch();
    const [showloading,setshowloading] = useState(false);

    //add new chapter form details
    const [chapterData , setChapterData] = useState({
        class:'',
        subjectid:'',
        chapteruid:'',
        chaptername:'',
        chapternumber:''
    });

    //deleting chapter details
    const [deleteChapterId,setDeleteChapterId] = useState({
        chaptername:'',
        chapternumber:'',
        chapteruid:''
    });

    //editing the chapter details
    const [editChapter, setEditChapter] = useState({
        class:'',
        subjectid:'',
        chapteruid:'',
        chaptername:'',
        chapternumber:''
    });


    const [open, setOpen] = useState(false);//to open the add chapter form
    const [deleteAlert , setDeleteAlert] = useState(false);//delete alert
    const [editAlert , setEditAlert] = useState(false);//edit alert
    //functions handle the adding Chapters
    const handleClickOpen = () => {//function to open the form
        setChapterData(prev=>({
            ...prev,
            class:classid,
            subjectid:subjectid,
        }));
        setOpen(true);
    };

    const handleClose = () => { // function to close the form
        setChapterData(prev=>({
            ...prev,
            class:'',
            subjectid:'',
            chapteruid:'',
            chaptername:'',
            chapternumber:''
        }));
        setOpen(false);
    };
    //function handling delete 
    const handleOpenDeleteAlert=(cid)=>{
        setDeleteChapterId(prev=>({
            ...prev,
            ...cid
        }));
        setDeleteAlert(true);
    }
    const handleClickCloseDeleteAlert=()=>{
        setDeleteChapterId(prev=>({
            ...prev,
            chaptername:'',
            chapternumber:'',
            chapteruid:''
        }));
        setDeleteAlert(false);
    }

    //function handling for edit alert
    const handleClickOpenEditAlert = (cdetails)=>{
        setEditChapter(prev=>({
            ...prev,
            ...cdetails
        }));
        setEditAlert(true);
    }

    const handleClickCloseEditAlert = () =>{
        setEditChapter(prev=>({
            ...prev,
            class:'',
            subjectid:'',
            chapteruid:'',
            chaptername:'',
            chapternumber:''
        }));
        setEditAlert(false);
    }

    //Add New Chapter to the subject
    async function AddChapterToClassSubject(e){
        setOpen(false);
        setshowloading(true);
        e.preventDefault();
        try{
            const uuid = uuidv4();//generating a unique id
            const response = await fetch(`${API_URL}/classChapters/addChapterToSubject`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    ...chapterData,
                    chapteruid:uuid 
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
                setChapterData(prev=>({
                    ...prev,
                    class:'',
                    subjectid:'',
                    chapteruid:'',
                    chaptername:'',
                    chapternumber:''
                }));
                setOpen(false);
                alert('successfully added the course');
            }else{
                alert(resData.message);
            }

        }catch(err){
            console.log('getting an error while adding the chapter to subject',err);
            alert('error while adding subject');
        }
        setshowloading(false);
    }
    //handling to delete the added chapter to a subject
    async function handleDeleteAchapterOfASubject(){
        setDeleteAlert(false);
        setshowloading(true);
        try{
            if(deleteChapterId.chapteruid!==''){
                const response= await fetch(`${API_URL}/classChapters/deleteChapterOfASubject/${classid}/${subjectid}/${deleteChapterId.chapteruid}`,{
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
                const resdata = await response.json();
                if(resdata.success){
                    setDeleteChapterId(prev=>({
                        ...prev,
                        chaptername:'',
                        chapternumber:'',
                        chapteruid:''
                    }));
                    setDeleteAlert(false);
                    alert('successfully deleted the chapter');
                }else{
                    alert('error while deleting');
                }
            }
        }catch(err){
            console.log('getting an error while deleting the chapter',err);
            alert('error while deleting the chapter');
        }
        setshowloading(false);
    }

    //function to handle the edit chapter
    async function handleEditChapterofASubject(e){
        setEditAlert(false);
        setshowloading(true);
        e.preventDefault();
        try{
            const response = await fetch(`${API_URL}/classChapters/updateAddedChapterToSubject`,{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(editChapter),
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
                setEditChapter(prev=>({
                    ...prev,
                    class:'',
                    subjectid:'',
                    chapteruid:'',
                    chaptername:'',
                    chapternumber:''
                }));
                setEditAlert(false);
                alert('successfully updated');
            }else{
                alert('error while updating chapter');
            }
        }catch(err){
            console.log('getting an error while updating',err);
            console.log('error while updating');
        }
        setshowloading(false);
    }

    useEffect(()=>{
        // console.log('fetched again');
        if(!fetchCheckOnlyOnce.current){
            if(classid!==chapterClass || subjectid!==chapterSubject){
                async function handleFetchAllChapters(){

                    const handleAddNewChapterToSubject =(data)=>{
                        dispatch(updateAddNewChapterData(data.data));
                    }
                    if(!socket.hasListeners('addedNewChapterToSubject')){
                        socket.on('addedNewChapterToSubject',handleAddNewChapterToSubject);
                    }

                    const handleDeleteAddedChapterToSubject =(data)=>{
                        dispatch(updateDeleteAddedChapterOfSubject(data.data));
                    }
                    if(!socket.hasListeners('deletedAddedChapterOfSubject')){
                        socket.on('deletedAddedChapterOfSubject',handleDeleteAddedChapterToSubject);
                    }

                    const handleUpdateAddedNewChapterSubject = (data) =>{
                        dispatch(updateExistingChapterOfASubject(data.data));
                    }
                    if(!socket.hasListeners('updateAddedChapterOfSubject')){
                        socket.on('updateAddedChapterOfSubject',handleUpdateAddedNewChapterSubject);
                    }

                    try{
                        const response = await fetch(`${API_URL}/classChapters/getAllChaptersOfASubject/${classid}/${subjectid}`,{
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
                        const resdata = await response.json();
                        if(resdata.success){
                            dispatch(storeAllChaptersData(resdata.allchapters));
                            dispatch(updateChapterClassAndSubject({
                                class:classid,
                                subject:subjectid
                            }));
                        }
                    }catch(err){
                        console.log('getting an error while fetching class subject chapters',err);
                    }
                }
                handleFetchAllChapters();
            }
            fetchCheckOnlyOnce.current=true;
        }
    },[classid,subjectid,chapterClass,chapterSubject,navigate,dispatch]);


    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className='allclasses-top-navigation'>
                            <p onClick={()=>navigate(-1)} style={{cursor:'pointer'}}>All Subjects</p>
                            <ChevronRightIcon sx={{fontSize:18}}/>
                            {subjectname?<p style={{color:'#1976d2',userSelect:'none'}}>{subjectname}</p>:<p>Sorry Wrong Request</p>}
                         </div>

                         <div className="allchapters-class-subject-display">
                            <p>{(classid==='nursery'||classid==='LKG'||classid==='UKG')?classid:`class ${classid}`}</p>
                            <p>-</p>
                            <p>{(subjectname && subjectid)?subjectname:'sorry wrong request'}</p>
                         </div>

                         {/* display all chapters here */}
                         {
                            AllChaptersData.length>0 && classid===chapterClass  && subjectid===chapterSubject && 
                            <div className="allchapters-display-each">
                            {
                                AllChaptersData.map((chapter,idx)=>(
                                <div className="allchapters-each-chaptername" key={idx} onClick={()=>navigate(`/manageclasses/managenotes/allclasses/${classid}/${subjectid}/${chapter.chapteruid}`,{state:{
                                    subjectname:subjectname,
                                    chapternumber:chapter.chapternumber,
                                    chaptername:chapter.chaptername
                                }})}>
                                    <p>chapter {chapter.chapternumber} : {chapter.chaptername}</p>
                                    <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:5}}>
                                        <EditIcon sx={{fontSize:22,color:'#1976d2',cursor:'pointer'}}
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            handleClickOpenEditAlert(chapter);
                                        }}
                                        />
                                        <DeleteIcon sx={{fontSize:22, color:'red',cursor:'pointer'}} 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents the parent onClick from triggering
                                            handleOpenDeleteAlert(chapter);
                                          }}/>
                                        <p style={{fontSize:'1.3rem',fontWeight:500}}>{`>`}</p>
                                    </div>
                                </div>
                                ))
                            } 
                            </div>
                         }
                         
                         <div className="allchapters-addchapter-btn" onClick={()=>handleClickOpen()}>
                            <p><span style={{marginRight:5,fontSize:'1.1rem'}}>+</span>Add Chapter</p>
                         </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form className="allchapters-addchapter-form">
                    <div style={{display:'flex',flexDirection:'column',
                        justifyContent:'flex-end',alignItems:'flex-end'}}
                        
                    >
                        <CloseIcon sx={{fontSize:22,cursor:'pointer'}} onClick={()=>handleClose()}/>
                    </div>
                    <h2>add New Chapter</h2>
                    <div>
                        <label>chapter number</label>
                        <input type='number' min={0} value={chapterData.chapternumber} 
                        onChange={(e)=>setChapterData(prev=>({
                            ...prev,
                            chapternumber:e.target.value
                        }))}
                        />
                    </div>
                    <div>
                        <label>chapter name</label>
                        <input type='text' value={chapterData.chaptername}
                        onChange={(e)=>setChapterData(prev=>({
                            ...prev,
                            chaptername:e.target.value
                        }))}/>
                    </div>
                    <button onClick={(e)=>AddChapterToClassSubject(e)}>Add Chapter</button>
                </form>
            </Dialog>
            {/* delete alert */}
            <Dialog
                open={deleteAlert}
                onClose={handleClickCloseDeleteAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="addsubjecttoclass-form">
                    <p style={{textTransform:'capitalize'}}>are you sure you want to delete the <span style={{color:'blue'}}>chapter {deleteChapterId.chapternumber}</span> - <span style={{color:'red'}}>{deleteChapterId.chaptername}</span> </p>
                    <div className="addsubjectstoclass0-alert-form-btns">
                        <p onClick={()=>handleDeleteAchapterOfASubject()}>Yes</p>
                        <p onClick={()=>handleClickCloseDeleteAlert()}>No</p>
                    </div>
                </div>
            </Dialog>

            {/* edit alert */}
            <Dialog
                open={editAlert}
                onClose={handleClickCloseEditAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form className="allchapters-addchapter-form">
                    <div style={{display:'flex',flexDirection:'column',
                        justifyContent:'flex-end',alignItems:'flex-end'}}
                        
                    >
                        <CloseIcon sx={{fontSize:22,cursor:'pointer'}} onClick={()=>handleClickCloseEditAlert()}/>
                    </div>
                    <h2>Edit Chapter</h2>
                    <div>
                        <label>chapter number</label>
                        <input type='number' min={0} value={editChapter.chapternumber} 
                        onChange={(e)=>setEditChapter(prev=>({
                            ...prev,
                            chapternumber:e.target.value
                        }))}
                        />
                    </div>
                    <div>
                        <label>chapter name</label>
                        <input type='text' value={editChapter.chaptername}
                        onChange={(e)=>setEditChapter(prev=>({
                            ...prev,
                            chaptername:e.target.value
                        }))}/>
                    </div>
                    <button onClick={(e)=>handleEditChapterofASubject(e)}>Edit Chapter</button>
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

export default AllChapters;