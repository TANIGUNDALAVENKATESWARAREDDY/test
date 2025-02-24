import { createSlice } from "@reduxjs/toolkit";

export const townsData = createSlice({
    name:'townsdata',
    initialState:{
        data:[]
    },
    reducers:{
        storetownsdata:(state,action)=>{
            state.data=action.payload
        },
    }
});

export const {storetownsdata} = townsData.actions
export default townsData.reducer;