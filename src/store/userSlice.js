import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  maxStrength: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setMaxStrength: (state, action) => {
      state.maxStrength = action.payload;
    },
  },
});

export const { setUserId, setMaxStrength } = userSlice.actions;

// Make sure this line is present and not modified
export default userSlice.reducer;