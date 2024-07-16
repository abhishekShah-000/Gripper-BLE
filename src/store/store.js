import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';

console.log('userSlice:', userSlice);

export const store = configureStore({
  reducer: {
    user: userSlice
  },
});