import { createSlice } from "@reduxjs/toolkit";

// binary search to find the the index;
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


export const AllApplications=createSlice({
    name:'allapplications',
    initialState:{
        data:[]
    },
    reducers:{
        updateAllApplications:(state,action)=>{
            state.data=[...action.payload];
        },
        updateSingleApplcation:(state,action)=>{
            const index = handleBinarySearchIdex(state.data ,action.payload.admissionid);
            if(index>=0){
                state.data[index]=action.payload
            }
        },
        clearAllApplications:(state)=>{
            state.data=[];
        }
    },

});
export const {clearAllApplications,updateAllApplications, updateSingleApplcation} = AllApplications.actions;
export default AllApplications.reducer;