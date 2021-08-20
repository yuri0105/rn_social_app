import { createSlice } from '@reduxjs/toolkit';

export const storySlice = createSlice({
	name: 'story',
	initialState: {
		story: []
	},
	reducers: {
		addStory: (state, action) => {
			state.story = action.payload;
		}

		// setPhotoURL: (state,action) =>{
		//     state.photoURL = action.payload
		// }
	}
});

export const { addStory } = storySlice.actions;

export const selectStory = (state) => state.story.story;

export default storySlice.reducer;
