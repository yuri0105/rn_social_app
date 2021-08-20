import { createSlice } from '@reduxjs/toolkit';

export const settingSlice = createSlice({
    name: 'setting',
    initialState: {
        isDarkTheme: false,
    },
    reducers: {
        changeDarkTheme: (state, action) => {
            state.isDarkTheme = action.payload;
        },

    },
});

export const { changeDarkTheme } = settingSlice.actions;

export const selectDarkThemeStatus = state => state.setting.isDarkTheme;

export default settingSlice.reducer;