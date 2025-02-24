import { createSlice } from "@reduxjs/toolkit";

export const Assignstudentsec = createSlice({
    name:'assignstudentsec',
    initialState:{
        class:'',
        data:[]
    },
    reducers:{
        updateAssignStudentSection :(state,action)=>{
            state.data =[...action.payload];
        },
        updateStudentSectionItem:(state,action)=>{
            state.data = state.data.map((item)=>{
                return item.stdregid===action.payload.stdregid?action.payload:item;
            })
        },
        updateAddNewStudentAssignSectionData:(state,action)=>{
            // console.log('here is the student assig  section data ',state.class,action.payload.stdclass);
            if(action.payload.stdclass===state.class){
                state.data =[...state.data,action.payload]
            }
        },
        updateAssignSectionClass:(state,action)=>{
            // console.log('here is the class data',action.payload);
            state.class=action.payload
        },
        clearAssignStudentSection:(state)=>{
            state.class='';
            state.data=[];
        }
    }
});

export const {clearAssignStudentSection,updateAssignStudentSection , updateStudentSectionItem,
    updateAddNewStudentAssignSectionData , updateAssignSectionClass} = Assignstudentsec.actions;
export default Assignstudentsec.reducer;