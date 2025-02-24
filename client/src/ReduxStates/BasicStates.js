import {createSlice} from '@reduxjs/toolkit';

export const BasicStates= createSlice({
    name:'basicstates',
    initialState:{
        sidenavbtn:false,
        topnavsidebtn:false,
        isAuthed:false,
    },
    reducers:{
        toggleSideNavBtn:(state) =>{
            state.sidenavbtn=!state.sidenavbtn;
        },
        toggleSideNavTopBtn:(state)=>{
            state.topnavsidebtn=!state.topnavsidebtn
        },
        authenticationFunction:(state)=>{
            state.isAuthed=!state.isAuthed
        },
        clearBasicStates:(state)=>{
            state.sidenavbtn=false;
            state.topnavsidebtn=false;
            state.isAuthed=false;
        }
    },
});

export const {clearBasicStates,toggleSideNavBtn , toggleSideNavTopBtn , authenticationFunction} = BasicStates.actions;
export default BasicStates.reducer;