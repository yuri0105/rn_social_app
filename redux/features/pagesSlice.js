import { createSlice } from '@reduxjs/toolkit';

export const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    pages: null,
  },
  reducers: {
    addPages: (state,action) => {
      state.pages = action.payload;
    },
   
    // setPhotoURL: (state,action) =>{
    //     state.photoURL = action.payload
    // }
  },
});

export const { addPages  } = pagesSlice.actions;
 
export const selectPages = state => state.pages.pages;

export default pagesSlice.reducer;
