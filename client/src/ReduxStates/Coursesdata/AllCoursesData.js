import { createSlice } from "@reduxjs/toolkit";

export const AllCoursesData = createSlice({
    name:'allcoursesdata',
    initialState:{
        data:[]
    },
    reducers:{
        storeAllCoursesData:(state,action)=>{
            state.data = [...action.payload];
        },
        updateAddNewCourseData:(state,action)=>{
            state.data = [action.payload,...state.data];
        },
        clearAllCoursesData:(state)=>{
            state.data =[];
        }
    }
});

export const {storeAllCoursesData , updateAddNewCourseData, clearAllCoursesData} = AllCoursesData.actions;
export default AllCoursesData.reducer;