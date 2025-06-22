import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectLanguage:{
        name:'',
        value:''
    }
}

const  languageSlice = createSlice({
    name:"user/languageSlice",
    initialState,
    reducers:{
        setSelectedLanguage:(state,action)=>{
            state.selectLanguage.name  = action.payload.name
            state.selectLanguage.value  = action.payload.value
        }
    }
})

export const {setSelectedLanguage} =languageSlice.actions;

export default languageSlice.reducer