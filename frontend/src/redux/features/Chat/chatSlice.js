import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getClientConfig } from "../../../service/Client/clientServices";

// Initial state
const initialState = {
  activePage: "newChat", //newChat, library, projects, scheduled, plugins, settings

  conversationList: [],
  conversationLoading: false,

  messages: [],

  newMessageLoading: false,
  isSendDisable: false,

  // Client chatbot configuration
  clientConfig: null,
  clientConfigLoading: false,
  clientConfigError: null,
};

// export const getUserList = createAsyncThunk(
//   "chat/getUserList",
//   async (role) => {
//     const response = await getUserListService(role);
//     return response.data || [];
//   }
// );

export const fetchClientConfig = createAsyncThunk(
  "chat/fetchClientConfig",
  async (clientKey, { rejectWithValue }) => {
    try {
      const response = await getClientConfig(clientKey);

      if (!response?.data?.success) {
        return rejectWithValue(
          response?.data?.message || "Failed to fetch client configuration",
        );
      }

      return response.data.config;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch client configuration",
      );
    }
  },
);

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
    clearClientConfig: (state) => {
      state.clientConfig = null;
      state.clientConfigLoading = false;
      state.clientConfigError = null;
    },
    clearChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientConfig.pending, (state) => {
        state.clientConfigLoading = true;
        state.clientConfigError = null;
      })

      .addCase(fetchClientConfig.fulfilled, (state, action) => {
        state.clientConfigLoading = false;
        state.clientConfig = action.payload;
        state.clientConfigError = null;
      })

      .addCase(fetchClientConfig.rejected, (state, action) => {
        state.clientConfigLoading = false;
        state.clientConfig = null;
        state.clientConfigError =
          action.payload || "Failed to fetch client configuration";
      });
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
  clearClientConfig,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
