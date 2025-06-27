import { createSlice } from "@reduxjs/toolkit";
import { continueConversationThunk, getConversationThunk, startConversationThunk } from "./conversation.thunk";

const initialState = {
    loading:false,
    error:null,
    data:[],
    conversationId:null
}

const  conversationSlice = createSlice({
    name:"user/conversationSlice",
    initialState,
      reducers: {
    resetConversationState: () => initialState,
  },
    extraReducers: (builder) => {
    builder
      .addCase(startConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationId = action.payload.conversation_id;
      })
      .addCase(startConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
    builder
      .addCase(continueConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(continueConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data.push(action.payload?.ai_response)
      })
      .addCase(continueConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
    builder
      .addCase(getConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.messages || []
      })
      .addCase(getConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
  },
    
})


export default conversationSlice.reducer