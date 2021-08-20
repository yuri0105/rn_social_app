import { createSlice } from '@reduxjs/toolkit';

export const pageSlice = createSlice({
  name: 'page',
  initialState: {
    page:null
    ,
    stats:{
      followers: [],
      following: [],
      likes: 0
    },
    pageInfo: null
  },
  reducers: {
    setPage:(state, action) =>{
        state.page = action.payload
    },
    setPageStats:(state, action) => {
      state.stats = action.payload
    },
    setPageInfo : (state, action) =>{
      state.pageInfo = action.payload
    }
    // setPhotoURL: (state,action) =>{
    //     state.photoURL = action.payload
    // }
  },
});

export const { setPage, setPageStats,setPageInfo } = pageSlice.actions;
 
export const selectPage = state => state.page.page;
export const selectPageStats = state => state.page.stats;
export const selectPageInfo = state => state.page.pageInfo

export default pageSlice.reducer;
