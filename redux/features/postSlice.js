import { createSlice } from '@reduxjs/toolkit';

export const postSlice = createSlice({
	name: 'post',
	initialState: {
		post: []
	},
	reducers: {
		addPost: (state, action) => {
			state.post = action.payload;
		}

		// setPhotoURL: (state,action) =>{
		//     state.photoURL = action.payload
		// }
	}
});

export const { addPost } = postSlice.actions;

export const selectPost = (state) => state.post.post;

export default postSlice.reducer;
