

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../commonVar";

export const startConversationThunk = createAsyncThunk(
  "conversation/start",
  async ({ user_id, system_prompt, initial_message, metadata = {} }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/conversations/start`, {
        user_id,
        system_prompt,
        initial_message,
        metadata
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      return rejectWithValue(message);
    }
  }
);

export const continueConversationThunk = createAsyncThunk(
  "conversation/continue",
  async (data, { rejectWithValue,getState }) => {
    try {
     const conversationId = getState().conversation?.conversationId
      const response = await axios.post(`${baseUrl}/api/conversations/${conversationId}/message`, data);
      return response.data?.ai_response;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      return rejectWithValue(message);
    }
  }
);
export const getConversationThunk = createAsyncThunk(
  "conversation/get",
  async (_, { rejectWithValue,getState }) => {
    try {
     const conversationId = getState().conversation?.conversationId
      const response = await axios.get(`${baseUrl}/api/conversations/${conversationId}`);
      return response.data?.messages || [];
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      return rejectWithValue(message);
    }
  }
);

