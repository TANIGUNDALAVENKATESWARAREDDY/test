import { createSlice } from "@reduxjs/toolkit";
export const Teachersdata = createSlice({
    name:'teachersdata',
    initialState:{
        data:[]
    },
    reducers:{
        storeAllTeachersData:(state,action)=>{
            state.data = [...action.payload]
        },
        clearTeachersData:(state)=>{
            state.data=[];
        }
    }
});

export const {clearTeachersData,storeAllTeachersData} = Teachersdata.actions;
export default Teachersdata.reducer;