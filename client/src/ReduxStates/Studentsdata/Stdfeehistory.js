import { createSlice } from "@reduxjs/toolkit";

export const Stdfeehistory = createSlice({
    name:'stdfeehistory',
    initialState:{
        data:[],
        class:'',
        section:''
    },
    reducers:{
        updateStudentsFeeHistory:(state,action)=>{
            state.data =[...action.payload];
        },
        updateStdClassSection:(state,action)=>{
            state.class=action.payload.class;
            state.section=action.payload.section
        },
        tempUpdateStudentFeeData:(state,action)=>{
            if(state.class===action.payload.class && state.section===action.payload.section){
                state.data = [...state.data].map((student)=>{
                    return student.stdregid===action.payload.stdregid?{
                        ...student,
                        stdtotalfee:Number(action.payload.totalfee),
                        stdtotalpaid:Number(action.payload.totalpaid),
                        stdfeediscount:Number(action.payload.feediscount)
                    }:student;
                });
            }
        },
        clearStdFeeHistory:(state)=>{
            state.data=[];
            state.class='';
            state.section='';
        }
    }
});

export const {clearStdFeeHistory,updateStudentsFeeHistory, updateStdClassSection , tempUpdateStudentFeeData} = Stdfeehistory.actions;
export default Stdfeehistory.reducer;