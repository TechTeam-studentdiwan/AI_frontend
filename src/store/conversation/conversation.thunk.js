

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../commonVar";

export const startConversationThunk = createAsyncThunk(
  "conversation/start",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/conversations/start`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      // Check for no response (network error)
      if (!err.response) {
        console.error("Network Error: Axios failed to connect");
        return rejectWithValue("Network Error");
      }

      // Handle server errors with details
      const message = err.response.data?.detail || err.message;
      return rejectWithValue(message);
    }
  }
);



export const continueConversationThunk = createAsyncThunk(
  "conversation/continue",
  async (data, { rejectWithValue,getState,dispatch }) => {
    try {
     const conversationId = getState().conversation?.conversationId
     console.log('start');
     console.log(conversationId);
     console.log(data);
     
      const response = await axios.post(`${baseUrl}/api/conversations/${conversationId}/messages`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
       dispatch(getConversationThunk())
      return response.data?.ai_response;
    } catch (err) {
      console.log(err);
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
       console.log(conversationId);
      const response = await axios.get(`${baseUrl}/api/conversations/${conversationId}`);
      console.log(response);
      
      return response.data?.messages || [];
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      return rejectWithValue(message);
    }
  }
);

