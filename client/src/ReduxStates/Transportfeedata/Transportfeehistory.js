import { createSlice } from "@reduxjs/toolkit";

export const Transportfeehistory = createSlice({
    name:'transportfeehistory',
    initialState:{
        data:[]
    },
    reducers:{
        storeStudentsTransportFeeHistory:(state,action)=>{
            state.data=[...action.payload];
        },
        clearStudentsTransportFeehistory:(state)=>{
            state.data=[];
        }
    }
});

export const {storeStudentsTransportFeeHistory , clearStudentsTransportFeehistory} = Transportfeehistory.actions;
export default Transportfeehistory.reducer;