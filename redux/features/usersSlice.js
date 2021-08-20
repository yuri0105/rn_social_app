import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: null,
  },
  reducers: {
    addUsers: (state,action) => {
      state.users = action.payload;
    },
   
    // setPhotoURL: (state,action) =>{
    //     state.photoURL = action.payload
    // }
  },
});

export const { addUsers  } = usersSlice.actions;
 
export const selectUsers = state => state.users.users;

export default usersSlice.reducer;
