import { createSlice } from "@reduxjs/toolkit";
export const ClassSubjectsData = createSlice({
    name:'classsubjectsdata',
    initialState:{
        data:[]
    },
    reducers:{
        storeClassSubjectsData:(state,action)=>{
            state.data = [...action.payload];
        },
        addNewSubjectToClass:(state,action)=>{
            state.data =[action.payload,...state.data];
        },
        deleteSubjectFromClass:(state,action)=>{
            state.data = state.data.filter((item)=> !(item.class===action.payload.class && item.subjectid===action.payload.subjectid))
        },
        clearClassSubjectsData:(state)=>{
            state.data=[]
        }
    }
});

export const {clearClassSubjectsData,storeClassSubjectsData , addNewSubjectToClass , deleteSubjectFromClass} = ClassSubjectsData.actions;
export default ClassSubjectsData.reducer;