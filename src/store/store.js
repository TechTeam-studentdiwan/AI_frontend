// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languages/language.slice'
import conversationReducer from './conversation/conversation.slice'

export const store = configureStore({
  reducer: {
    language:languageReducer,
    conversation:conversationReducer,
  },
});
