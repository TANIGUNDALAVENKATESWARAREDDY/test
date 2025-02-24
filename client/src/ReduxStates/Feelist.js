import { createSlice } from "@reduxjs/toolkit";

export const Feelist = createSlice({
    name:'feelist',
    initialState:{
        data:[],
    },
    reducers:{
        updateFeelistData:(state,action)=>{
            state.data = [...action.payload]
        },
        modifySingleFeelist:(state,action)=>{
            state.data = state.data.map((item)=>{
                return item.class===action.payload.class?action.payload:item;
            })
        },
        clearFetchedFeeList:(state)=>{
            state.data=[];
        }
    }
});

export const {clearFetchedFeeList,updateFeelistData , modifySingleFeelist} = Feelist.actions;
export default Feelist.reducer;