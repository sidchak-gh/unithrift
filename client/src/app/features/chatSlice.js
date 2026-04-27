import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    listing: null,
    chatId: null
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChat: (state, action) => {
            state.isOpen = true;
            state.listing = action.payload.listing || state.listing;
            state.chatId = action.payload.chatId || state.chatId;
        },
        clearChat: (state) => {
            state.isOpen = false;
            // state.listing = null;
            // state.chatId = null;
        }
    }
});

export const { setChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
