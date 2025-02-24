import { createSlice } from "@reduxjs/toolkit";

export const Getstudents = createSlice({
    name:'getstudents',
    initialState:{
        data:[],
        class:'',
        section:''
    },
    reducers:{
        updateGetStudentClassAndSection:(state,action)=>{
            state.class=action.payload.class
            state.section = action.payload.section
        },
        updateGetStudentsData:(state,action)=>{
            state.data =[...action.payload];
        },
        updateGetStudentsSingleData:(state,action)=>{
            if(state.class===action.payload.stdclass && state.section===action.payload.stdsectionid){
                state.data = state.data.filter((item)=>item.stdregid===action.payload.stdregid).length>0?
                state.data.map((student)=>{
                    return student.stdregid===action.payload.stdregid?action.payload:student;
                }):[...state.data,action.payload];
            }else if(state.class===action.payload.stdclass && state.section!==action.payload.stdsectionid){
                state.data = state.data.filter((item)=>item.stdregid!==action.payload.stdregid)
            }
        },
        clearGetStudents:(state)=>{
            state.data=[];
            state.class='';
            state.section='';
        }
    }
});

export const {clearGetStudents,updateGetStudentsData,updateGetStudentClassAndSection , updateGetStudentsSingleData} = Getstudents.actions;
export default Getstudents.reducer;