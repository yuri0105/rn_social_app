import { createSlice } from '@reduxjs/toolkit';

export const chatUserSlice = createSlice({
  name: 'chatUser',
  initialState: {
    chatUser: null,
  },
  reducers: {
     setChatUser : (state, action) =>{
         state.chatUser = action.payload
     }
    // setPhotoURL: (state,action) =>{
    //     state.photoURL = action.payload
    // }
  },
});

export const { setChatUser } = chatUserSlice.actions;
 
export const selectChatUser = state => state.chatUser.chatUser;

export default chatUserSlice.reducer;
