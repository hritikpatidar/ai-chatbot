import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  activePage: "newChat", //newChat, library, projects, scheduled, plugins, settings
};

// export const getUserList = createAsyncThunk(
//   "chat/getUserList",
//   async (role) => {
//     const response = await getUserListService(role);
//     return response.data || [];
//   }
// );

// Create chat slice using createSlice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },

    clearChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder;
    // .addCase(getUserList.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(getUserList.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.userList = action.payload.data || [];
    //   state.error = "";
    // })
    // .addCase(getUserList.rejected, (state, action) => {
    //   state.loading = false;
    //   state.userList = [];
    //   state.error = action.error.message;
    // })
    //-----------------------------------------------------------
  },
});

// Export actions and reducer
export const {
  setActivePage,

  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
