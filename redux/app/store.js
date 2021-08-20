import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import usersReducer from '../features/usersSlice';
import chatUserReducer from '../features/chatUser'
import storyReducer from '../features/storySlice'
import friendReducer from '../features/friendSlice';
import pageReducer from '../features/pageSlice';
import postReducer from '../features/postSlice';
import pagesReducer from '../features/pagesSlice';
import settingReducer from "../features/setting";



export default configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    chatUser: chatUserReducer,
    friend: friendReducer,
    story: storyReducer,
    page: pageReducer,
    post: postReducer,
    pages: pagesReducer,
    setting: settingReducer,
  },
});
