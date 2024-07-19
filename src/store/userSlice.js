import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  token:null,
  maxStrength: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setMaxStrength: (state, action) => {
      state.maxStrength = action.payload;
    },
  },
});

export const { setUserId, setToken,  setMaxStrength } = userSlice.actions;

// Make sure this line is present and not modified
export default userSlice.reducer;