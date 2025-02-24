import { createSlice } from "@reduxjs/toolkit";

export const ClassTopicsData = createSlice({
    name:'classtopicsdata',
    initialState:{
        data:[],
        class:'',
        subject:'',
        chapter:''
    },
    reducers:{
        storeAllTopicsData:(state,action)=>{
            state.data = [...action.payload]
        },
        addSingleTopicToChapter:(state,action)=>{
            if(state.class===action.payload.class && state.subject===action.payload.subjectid && state.chapter===action.payload.chapterid){
                state.data = [...state.data,action.payload].sort((a,b)=>a.topicnumber-b.topicnumber);
            }
        },
        updateTopicClassSubjectChapterData:(state,action)=>{
            state.class = action.payload.classid;
            state.subject = action.payload.subjectid;
            state.chapter = action.payload.chapterid;
        },
        updateSingleTopicData:(state,action)=>{
            if(state.class===action.payload.class && state.subject===action.payload.subjectid && state.chapter===action.payload.chapterid){
                state.data = state.data.map((topic)=>{
                    return  topic.topicuid===action.payload.topicuid?action.payload:topic;
                });
            }
        },
        deleteSingleTopicData:(state,action)=>{
            if(state.class===action.payload.classid && state.subject===action.payload.subjectid && state.chapter===action.payload.chapterid){
                state.data = state.data.filter((topic)=>topic.topicuid!==action.payload.topicuid)
            }
        },
        clearClassTopicsData:(state)=>{
            state.data=[];
            state.class='';
            state.subject='';
            state.chapter='';
        }
    }
});

export const {clearClassTopicsData,addSingleTopicToChapter , updateTopicClassSubjectChapterData,storeAllTopicsData, updateSingleTopicData , deleteSingleTopicData} = ClassTopicsData.actions

export default ClassTopicsData.reducer;