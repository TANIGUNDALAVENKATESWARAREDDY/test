import { createSlice } from "@reduxjs/toolkit";

export const ViewTimetabledata = createSlice({
    name:'viewtimetabledata',
    initialState:{
        sectiondata:'',
        classdata:'',
        ttData:'',
        data:{
            class:'',
            sectionid:'',
            totalperiods:7,
            totalbreaks:2,
            break1:{
                starttime:'',
                endtime:'',
                duration:0
            },
            break2:{
                starttime:'',
                endtime:'',
                duration:0
            },
            break3:{
                starttime:'',
                endtime:'',
                duration:0
            },
            lunchbreak:{
                starttime:'',
                endtime:'',
                duration:0
            },
            period1:{starttime:'',endtime:'',duration:0},
            period2:{starttime:'',endtime:'',duration:0},
            period3:{starttime:'',endtime:'',duration:0},
            period4:{starttime:'',endtime:'',duration:0},
            period5:{starttime:'',endtime:'',duration:0},
            period6:{starttime:'',endtime:'',duration:0},
            period7:{starttime:'',endtime:'',duration:0},
            period8:{starttime:'',endtime:'',duration:0},
            period9:{starttime:'',endtime:'',duration:0},
            period10:{starttime:'',endtime:'',duration:0},
            monday: {
                period1: { subjectid: '', teacherid: '' },
                period2: { subjectid: '', teacherid: '' },
                period3: { subjectid: '', teacherid: '' },
                period4: { subjectid: '', teacherid: '' },
                period5: { subjectid: '', teacherid: '' },
                period6: { subjectid: '', teacherid: '' },
                period7: { subjectid: '', teacherid: '' },
                period8: { subjectid: '', teacherid: '' },
                period9: { subjectid: '', teacherid: '' },
                period10: { subjectid: '', teacherid: '' }
              },
            tuesday: {
                period1: { subjectid: '', teacherid: '' },
                period2: { subjectid: '', teacherid: '' },
                period3: { subjectid: '', teacherid: '' },
                period4: { subjectid: '', teacherid: '' },
                period5: { subjectid: '', teacherid: '' },
                period6: { subjectid: '', teacherid: '' },
                period7: { subjectid: '', teacherid: '' },
                period8: { subjectid: '', teacherid: '' },
                period9: { subjectid: '', teacherid: '' },
                period10: { subjectid: '', teacherid: '' }
              },
              wednesday: {
                period1: { subjectid: '', teacherid: '' },
                period2: { subjectid: '', teacherid: '' },
                period3: { subjectid: '', teacherid: '' },
                period4: { subjectid: '', teacherid: '' },
                period5: { subjectid: '', teacherid: '' },
                period6: { subjectid: '', teacherid: '' },
                period7: { subjectid: '', teacherid: '' },
                period8: { subjectid: '', teacherid: '' },
                period9: { subjectid: '', teacherid: '' },
                period10: { subjectid: '', teacherid: '' }
              },
            thursday: {
                period1: { subjectid: '', teacherid: '' },
                period2: { subjectid: '', teacherid: '' },
                period3: { subjectid: '', teacherid: '' },
                period4: { subjectid: '', teacherid: '' },
                period5: { subjectid: '', teacherid: '' },
                period6: { subjectid: '', teacherid: '' },
                period7: { subjectid: '', teacherid: '' },
                period8: { subjectid: '', teacherid: '' },
                period9: { subjectid: '', teacherid: '' },
                period10: { subjectid: '', teacherid: '' }
              },
            friday: {
                period1: { subjectid: '', teacherid: '' },
                period2: { subjectid: '', teacherid: '' },
                period3: { subjectid: '', teacherid: '' },
                period4: { subjectid: '', teacherid: '' },
                period5: { subjectid: '', teacherid: '' },
                period6: { subjectid: '', teacherid: '' },
                period7: { subjectid: '', teacherid: '' },
                period8: { subjectid: '', teacherid: '' },
                period9: { subjectid: '', teacherid: '' },
                period10: { subjectid: '', teacherid: '' }
              },
            saturday: {
                period1: { subjectid: '', teacherid: '' },
                period2: { subjectid: '', teacherid: '' },
                period3: { subjectid: '', teacherid: '' },
                period4: { subjectid: '', teacherid: '' },
                period5: { subjectid: '', teacherid: '' },
                period6: { subjectid: '', teacherid: '' },
                period7: { subjectid: '', teacherid: '' },
                period8: { subjectid: '', teacherid: '' },
                period9: { subjectid: '', teacherid: '' },
                period10: { subjectid: '', teacherid: '' }
              },
        }
    },
    reducers:{
        updateViewTimetable:(state,action)=>{
            state.data=action.payload
        },
        updateViewTTClassAndSection:(state,action)=>{
            state.classdata = action.payload.classdata;
            state.sectiondata = action.payload.sectiondata;
            state.ttData=action.payload.ttData;
        },
        updateExistedTimeTable:(state,action)=>{
            if(state.classdata===action.payload.class && state.sectiondata===action.payload.sectionid){
                state.data = action.payload
            }
        },
        updateEachTimetableSubjectAndTeacher:(state,action)=>{
            if(state.classdata===action.payload.class && state.sectiondata===action.payload.sectionid){
                state.data = {
                    ...state.data,
                    [`${action.payload.day}`]:{
                        ...state.data[`${action.payload.day}`],
                        [`${action.payload.period}`]:{
                            ...state.data[`${action.payload.day}`][`${action.payload.period}`],
                            teacherid:action.payload.teacherid,
                            subjectid:action.payload.subjectid
                        }
                    }
                };
            }
        },
        clearViewTimetableData:(state)=>{
            state.sectiondata='';
            state.classdata='';
            state.ttData='';
            state.data={
                    class:'',
                    sectionid:'',
                    totalperiods:7,
                    totalbreaks:2,
                    break1:{
                        starttime:'',
                        endtime:'',
                        duration:0
                    },
                    break2:{
                        starttime:'',
                        endtime:'',
                        duration:0
                    },
                    break3:{
                        starttime:'',
                        endtime:'',
                        duration:0
                    },
                    lunchbreak:{
                        starttime:'',
                        endtime:'',
                        duration:0
                    },
                    period1:{starttime:'',endtime:'',duration:0},
                    period2:{starttime:'',endtime:'',duration:0},
                    period3:{starttime:'',endtime:'',duration:0},
                    period4:{starttime:'',endtime:'',duration:0},
                    period5:{starttime:'',endtime:'',duration:0},
                    period6:{starttime:'',endtime:'',duration:0},
                    period7:{starttime:'',endtime:'',duration:0},
                    period8:{starttime:'',endtime:'',duration:0},
                    period9:{starttime:'',endtime:'',duration:0},
                    period10:{starttime:'',endtime:'',duration:0},
                    monday: {
                        period1: { subjectid: '', teacherid: '' },
                        period2: { subjectid: '', teacherid: '' },
                        period3: { subjectid: '', teacherid: '' },
                        period4: { subjectid: '', teacherid: '' },
                        period5: { subjectid: '', teacherid: '' },
                        period6: { subjectid: '', teacherid: '' },
                        period7: { subjectid: '', teacherid: '' },
                        period8: { subjectid: '', teacherid: '' },
                        period9: { subjectid: '', teacherid: '' },
                        period10: { subjectid: '', teacherid: '' }
                      },
                    tuesday: {
                        period1: { subjectid: '', teacherid: '' },
                        period2: { subjectid: '', teacherid: '' },
                        period3: { subjectid: '', teacherid: '' },
                        period4: { subjectid: '', teacherid: '' },
                        period5: { subjectid: '', teacherid: '' },
                        period6: { subjectid: '', teacherid: '' },
                        period7: { subjectid: '', teacherid: '' },
                        period8: { subjectid: '', teacherid: '' },
                        period9: { subjectid: '', teacherid: '' },
                        period10: { subjectid: '', teacherid: '' }
                      },
                      wednesday: {
                        period1: { subjectid: '', teacherid: '' },
                        period2: { subjectid: '', teacherid: '' },
                        period3: { subjectid: '', teacherid: '' },
                        period4: { subjectid: '', teacherid: '' },
                        period5: { subjectid: '', teacherid: '' },
                        period6: { subjectid: '', teacherid: '' },
                        period7: { subjectid: '', teacherid: '' },
                        period8: { subjectid: '', teacherid: '' },
                        period9: { subjectid: '', teacherid: '' },
                        period10: { subjectid: '', teacherid: '' }
                      },
                    thursday: {
                        period1: { subjectid: '', teacherid: '' },
                        period2: { subjectid: '', teacherid: '' },
                        period3: { subjectid: '', teacherid: '' },
                        period4: { subjectid: '', teacherid: '' },
                        period5: { subjectid: '', teacherid: '' },
                        period6: { subjectid: '', teacherid: '' },
                        period7: { subjectid: '', teacherid: '' },
                        period8: { subjectid: '', teacherid: '' },
                        period9: { subjectid: '', teacherid: '' },
                        period10: { subjectid: '', teacherid: '' }
                      },
                    friday: {
                        period1: { subjectid: '', teacherid: '' },
                        period2: { subjectid: '', teacherid: '' },
                        period3: { subjectid: '', teacherid: '' },
                        period4: { subjectid: '', teacherid: '' },
                        period5: { subjectid: '', teacherid: '' },
                        period6: { subjectid: '', teacherid: '' },
                        period7: { subjectid: '', teacherid: '' },
                        period8: { subjectid: '', teacherid: '' },
                        period9: { subjectid: '', teacherid: '' },
                        period10: { subjectid: '', teacherid: '' }
                      },
                    saturday: {
                        period1: { subjectid: '', teacherid: '' },
                        period2: { subjectid: '', teacherid: '' },
                        period3: { subjectid: '', teacherid: '' },
                        period4: { subjectid: '', teacherid: '' },
                        period5: { subjectid: '', teacherid: '' },
                        period6: { subjectid: '', teacherid: '' },
                        period7: { subjectid: '', teacherid: '' },
                        period8: { subjectid: '', teacherid: '' },
                        period9: { subjectid: '', teacherid: '' },
                        period10: { subjectid: '', teacherid: '' }
                      },
                }
        }
    }
});

export const {updateViewTimetable,updateViewTTClassAndSection,updateExistedTimeTable ,
    updateEachTimetableSubjectAndTeacher, clearViewTimetableData} = ViewTimetabledata.actions;
export default ViewTimetabledata.reducer;