import { createSlice } from '@reduxjs/toolkit';

export const friendSlice = createSlice({
	name: 'friend',
	initialState: {
		friend: null
	},
	reducers: {
		addFriend: (state, action) => {
			state.friend = action.payload;
		}

		// setPhotoURL: (state,action) =>{
		//     state.photoURL = action.payload
		// }
	}
});

export const { addFriend } = friendSlice.actions;

export const selectFriend = (state) => state.friend.friend;

export default friendSlice.reducer;
