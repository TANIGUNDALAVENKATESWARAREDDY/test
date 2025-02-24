import React, { useEffect, useRef, useState } from "react";
import './Changefees.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { API_URL, socket } from "../../../Data/Docs";
import { useDispatch, useSelector } from "react-redux";
import { modifySingleFeelist, updateFeelistData } from "../../../ReduxStates/Feelist";
import { Logout } from "../../AllFunctions/Logout";

function Changefee(){
    const navigate = useNavigate();
    const CheckoutOnlyOnce = useRef(false);
    const classesFee = useSelector((state)=>state.feelist.data);
    const dispatch = useDispatch();
    const [classFeeData , setClassFeeData] = useState({
        class:'',
        fee:0
    });

    // async function handleCreateNewFeeItem(e){
    //     e.preventDefault();
    //     try{
    //         const response = await fetch(`${API_URL}/feelist/addfeelistitem`,{
    //             method:'POST',
    //             headers:{
    //                 'Content-Type':'application/json',
    //             },
    //             body:JSON.stringify(classFeeData)
    //         });
    //         const data  = await response.json();
    //         console.log('here is the response data: ', data);

    //         if(data.success){
    //             setClassFeeData(prev=>({
    //                 ...prev,
    //                 class:'',
    //                 fee:0
    //             }));
    //             alert('successfully added the data');
    //         }else{
    //             alert('getting an error whiel add an fee item');
    //         }
    //     }catch(err){
    //         console.log('you getting asn erroe while add the new ite,m',err);
    //     }
    // }

    async function handleUpdateFeelistItem(e){
        e.preventDefault();
        try{
            const response  = await fetch(`${API_URL}/feelist/updatesinglefeelist`,{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(classFeeData),
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
            // else{
            //     alert('successfully updated');
            // }
        }catch(err){
            console.log('getting an error while updating the feelist item',err);
        }
    }

    useEffect(()=>{
        if(!CheckoutOnlyOnce.current){
            if(classesFee.length===0){

                //modifying the updated data using the listeners
                const handleUpdateFeelistListener = (data)=>{
                    dispatch(modifySingleFeelist(data.data));
                };

                if(!socket.hasListeners('modifiedclassfeelist')){
                    socket.on('modifiedclassfeelist',handleUpdateFeelistListener);
                }

                async function fetchallClassesFee(){
                    try{
                        const response = await fetch(`${API_URL}/feelist/getfeelist`,{
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
                        const tempClassFeeData = await response.json();
                        if (tempClassFeeData.classfeedata.length > 0) {
                            dispatch(updateFeelistData(tempClassFeeData.classfeedata));
                            // console.log('here is the fetched data : ',tempClassFeeData.classfeedata);
                        }
                    }catch(err){
                        console.log('Error while fetching fees data: ',err);
                    }
                }
                fetchallClassesFee();
            }
            CheckoutOnlyOnce.current=true;
        }
    },[classesFee.length,navigate,dispatch]);



    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        
                        <div className="fee-management">
                            <div className='admissionform-top-back-btn' onClick={()=>navigate(-1)} >
                                <KeyboardArrowLeftIcon/>
                                <p>back</p>
                            </div>
                            <h2>Fee Schedule for Each Class</h2>
                            <div className="fee-table-div">
                                <table className="fee-table">
                                    <thead>
                                    <tr>
                                        <th>Class</th>
                                        <th>Fee</th>
                                        <th style={{textAlign:'center'}}>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {classesFee.length>0  && classesFee.map((classNum,idx) => (
                                        <tr key={idx}>
                                            {(classNum.class==='nursery'||classNum.class==='LKG'||classNum.class==='UKG')?
                                            <td style={{fontSize:'0.9rem',fontWeight:'400',whiteSpace:'nowrap'}}>{classNum.class}</td> :
                                            <td style={{fontSize:'0.9rem',fontWeight:'400',whiteSpace:'nowrap'}}>Class {classNum.class}</td>
                                            }
                                            <td>
                                                <input type="number" value={(classNum.class===classFeeData.class && classNum.fee!==classFeeData.fee)===true?classFeeData.fee:classNum.fee} 
                                                placeholder="Enter fee" onChange={(e)=>setClassFeeData(prev=>({
                                                    ...prev,
                                                    fee:Number(e.target.value),
                                                    class:classNum.class
                                                }))}/>
                                            </td>
                                            <td style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                                {(classNum.class===classFeeData.class && classNum.fee!==Number(classFeeData.fee))===true && <button onClick={(e)=>handleUpdateFeelistItem(e)}>update</button>}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* your code end here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Changefee;