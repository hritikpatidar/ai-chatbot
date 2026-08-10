import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  activePage: "newChat", //newChat, library, projects, scheduled, plugins, settings
  conversationList: [],
  conversationLoading: false,
  messages: [],
  newMessageLoading: false,
  isSendDisable: false,
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
    setConversationList: (state, action) => {
      state.conversationList = action.payload;
    },
    removeConversation: (state, action) => {
      state.conversationList = state.conversationList.filter(
        (conversation) => conversation._id !== action.payload,
      );
    },
    addConversation: (state, action) => {
      state.conversationList = [action.payload, ...state.conversationList];
    },
    setConversationLoading: (state, action) => {
      state.conversationLoading = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    appendAssistantChunk: (state, action) => {
      const text = action.payload;
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage?.role === "assistant") {
        lastMessage.text += text;
      } else {
        state.messages.push({
          id: Date.now().toString(),
          role: "assistant",
          text,
          isError: false,
        });
      }
    },
    addErrorMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        role: "assistant",
        text: action.payload,
        isError: true,
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setNewMessageLoading: (state, action) => {
      state.newMessageLoading = action.payload;
    },
    setIsSendDisable: (state, action) => {
      state.isSendDisable = action.payload;
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
  setConversationList,
  removeConversation,
  addConversation,
  setConversationLoading,
  setMessages,
  addMessage,
  appendAssistantChunk,
  addErrorMessage,
  clearMessages,
  setNewMessageLoading,
  setIsSendDisable,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
