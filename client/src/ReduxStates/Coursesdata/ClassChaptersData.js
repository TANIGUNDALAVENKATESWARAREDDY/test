import { createSlice } from "@reduxjs/toolkit";;

export const ClassChaptersData = createSlice({
    name:'classchaptersdata',
    initialState:{
        class:'',
        subject:'',
        data:[]
    },
    reducers:{
        storeAllChaptersData:(state,action)=>{
            state.data = [...action.payload].sort((a,b)=>a.chapternumber-b.chapternumber);
        },
        updateChapterClassAndSubject:(state,action)=>{
            state.class=action.payload.class;
            state.subject=action.payload.subject;
        },
        updateAddNewChapterData:(state,action)=>{
            if(state.class===action.payload.class && state.subject===action.payload.subjectid){
                state.data = [action.payload,...state.data].sort((a,b)=>a.chapternumber-b.chapternumber);
            }
        },
        updateDeleteAddedChapterOfSubject:(state,action)=>{
            // console.log('heare is the action payload data: ',action.payload);
            if(state.class===action.payload.classid && state.subject===action.payload.subjectid){
                state.data = state.data.filter((chapter)=>chapter.chapteruid!==action.payload.chapterid);
            }
        },
        updateExistingChapterOfASubject:(state,action)=>{
            if(state.class===action.payload.class && state.subject===action.payload.subjectid){
                state.data = state.data.map((chapter)=>{
                    return chapter.chapteruid===action.payload.chapteruid?action.payload:chapter;
                });
            }
        },
        clearClassChaptersData:(state)=>{
            state.data=[];
            state.class='';
            state.subject='';
        }
    }
});

export const {storeAllChaptersData,updateChapterClassAndSubject, clearClassChaptersData,
    updateAddNewChapterData, updateDeleteAddedChapterOfSubject,updateExistingChapterOfASubject} = ClassChaptersData.actions;
export default ClassChaptersData.reducer;