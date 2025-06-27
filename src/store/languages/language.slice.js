import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectLanguage:{
        name:'',
        value:''
    },
  transcript:''
}

const  languageSlice = createSlice({
    name:"user/languageSlice",
    initialState,
    reducers:{
        setSelectedLanguage:(state,action)=>{
            state.selectLanguage.name  = action.payload.name
            state.selectLanguage.value  = action.payload.value
        },
        setTranscript:(state,action)=>{
            state.transcript = action.payload
        }
    }
})

export const {setSelectedLanguage,setTranscript} =languageSlice.actions;

export default languageSlice.reducer