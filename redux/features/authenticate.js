import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    auth: false,
  },
  reducers: {
    setAuth: (state,action) => {
      state.auth = action.payload;
    },
   
  },
});

export const { setAuth  } = authSlice.actions;
 
export const selectAuth = state => state.auth.auth;

export default authSlice.reducer;
