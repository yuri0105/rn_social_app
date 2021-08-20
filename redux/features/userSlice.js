import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user:null
    ,
    stats:{
      followers: [],
      following: [],
      likes: 0
    },
    userInfo: null
  },
  reducers: {
    login: (state,action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setStats:(state, action) => {
      state.stats = action.payload
    },
    setUserInfo : (state, action) =>{
      state.userInfo = action.payload
    }
    // setPhotoURL: (state,action) =>{
    //     state.photoURL = action.payload
    // }
  },
});

export const { login, logout, setStats,setUserInfo } = userSlice.actions;
 
export const selectUser = state => state.user.user;
export const selectUserStats = state => state.user.stats;
export const selectUserInfo = state => state.user.userInfo

export default userSlice.reducer;
