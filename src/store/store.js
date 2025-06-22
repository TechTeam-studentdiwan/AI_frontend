// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languages/language.slice'

export const store = configureStore({
  reducer: {
    language:languageReducer
  },
});
