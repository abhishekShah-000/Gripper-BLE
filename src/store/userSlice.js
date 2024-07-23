import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  token:null,
  maxStrength: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  isSpotlightActive: true,
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
    setSpotlightActive: (state, action) => {
      state.isSpotlightActive = action.payload;
    },
    resetState: (state) => {
      state.isSpotlightActive =  initialState;
    },


  },
});

export const { setUserId, setToken,  setMaxStrength, setSpotlightActive, resetState  } = userSlice.actions;

// Make sure this line is present and not modified
export default userSlice.reducer;