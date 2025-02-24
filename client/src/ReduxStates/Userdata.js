import { createSlice } from "@reduxjs/toolkit";
export const Userdata = createSlice({
    name:'userdata',
    initialState:{
        isLoggedIn:false,
        showLoading:true,
        role:'',
        regid:'',
        userdata:[]
    },
    reducers:{
        storeUserLoginDetails:(state,action)=>{
            state.isLoggedIn = action.payload.isLoggedIn;
            state.showLoading = action.payload.showLoading;
            state.role=action.payload.role;
            state.regid = action.payload.regid;
        },
        clearStoredUserData:(state)=>{
            state.isLoggedIn=false;
            state.showLoading=true;
            state.role='';
            state.regid='';
            state.userdata=[];
        }

    }
});

export const {clearStoredUserData,storeUserLoginDetails} = Userdata.actions;
export default Userdata.reducer;