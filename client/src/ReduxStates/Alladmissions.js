import { createSlice } from "@reduxjs/toolkit";

//binary search to find the index
function handleBinarySearchIdex(arr ,targetId){
    let left=0;
    let right=arr.length-1;
    while(left<=right){
        const mid = Math.floor((left+right)/2);
        if(arr[mid].admissionid===targetId){
            return mid;
        }else if(arr[mid].admissionid<targetId){
            right=mid-1;
        }else{
            left=mid+1;
        }
    }
    return null;
}

export const Alladmissions = createSlice({
    name:'alladmissions',
    initialState:{
        data:[]
    },
    reducers:{
        updateAllAdmissions:(state,action)=>{
            state.data=[...action.payload].sort((a,b)=>b.admissionid-a.admissionid);
        },
        updateSingleAdmission:(state,action)=>{
            state.data=[action.payload,...state.data].sort((a,b)=>b.admissionid-a.admissionid);
        },
        updateAdmissionFieldData:(state,action)=>{
            const index = handleBinarySearchIdex(state.data ,action.payload.admissionid);
            if(index>=0){
                state.data[index]=action.payload
            }
        },
        clearAllAdmissions:(state)=>{
            state.data=[]
        }
    }
});
export const {clearAllAdmissions,updateAllAdmissions , updateSingleAdmission , updateAdmissionFieldData} = Alladmissions.actions;
export default Alladmissions.reducer;