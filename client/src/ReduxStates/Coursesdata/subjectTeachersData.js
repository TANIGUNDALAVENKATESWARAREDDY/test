import { createSlice } from "@reduxjs/toolkit";
export const subjectTeachersData = createSlice({
    name:'subjectteachersdata',
    initialState:{
        data:[]
    },
    reducers:{
        storeAllSubjectTeachersData:(state,action)=>{
            state.data = [...action.payload];
        },
        addNewTeacherToSubject:(state,action)=>{
            state.data = [action.payload,...state.data];
        },
        deleteAddedTeacherOfSubject:(state,action)=>{
           
            state.data = [...state.data].filter((subject)=>!(subject.subjectid===action.payload.subjectid && subject.teacherid===action.payload.teacherid));
        },
        clearSubjectTeachersData:(state)=>{
            state.data=[];
        }
    }
});

export const {clearSubjectTeachersData,storeAllSubjectTeachersData , deleteAddedTeacherOfSubject , addNewTeacherToSubject}=subjectTeachersData.actions

export default subjectTeachersData.reducer;