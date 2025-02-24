import { createSlice } from "@reduxjs/toolkit";

export const AllAdminsData = createSlice({
    name:'alladminsdata',
    initialState:{
        data:[]
    },
    reducers:{
        storeAllAdminsData:(state,action)=>{
            state.data = [...action.payload];
        },
        allAdminsClearData:(state)=>{
            state.data=[]
        }
    }
});
export const {storeAllAdminsData,allAdminsClearData} = AllAdminsData.actions;
export default AllAdminsData.reducer;
