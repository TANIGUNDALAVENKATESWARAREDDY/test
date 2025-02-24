import { createSlice } from "@reduxjs/toolkit";

export const Sections = createSlice({
    name:'sections',
    initialState:{
        data:[]
    },
    reducers:{
        updateSections:(state,action)=>{
            state.data =[...action.payload].sort((a,b)=>a.class<b.class);
        },
        addedNewSection:(state,action)=>{
            state.data=[...state.data,action.payload];
        },
        sectionModified:(state,action)=>{
            state.data=state.data.map((item)=>{
                return item._id===action.payload._id?action.payload:item;
            })
        },
        clearFetchedSections:(state)=>{
            state.data=[];
        }
    }
});

export const {clearFetchedSections,updateSections,addedNewSection , sectionModified} = Sections.actions;
export default Sections.reducer;