import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { getChats, getMessages, addMessage, deleteSession, renameSession } from "./thunk";
import { ChatMessage, ChatSession } from "../../common/data/chat";

interface InitialState {
  chats: ChatSession[];
  messages: ChatMessage[];
  currentSessionId: string | null;
  error: object;
  loading: boolean;
  assistantLoading: boolean;
}

interface ErrorPayload {
  error: object;
}

export const initialState: InitialState = {
  chats: [],
  messages: [],
  currentSessionId: null,
  error: {},
  loading: false,
  assistantLoading: false,
};

const ChatsSlice = createSlice({
  name: "ChatsSlice",
  initialState,
  reducers: {
    // Add a new reducer for adding user message
    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addNewSession: (state) => {
      const newSession: ChatSession = {
        session_id: null,
        session_name: "",
        assist_id: 1,
        messages: []
      };
      state.chats.unshift(newSession);
      state.currentSessionId = null;
      state.messages = [];
    },
    updateSessionDetails: (state, action: PayloadAction<{ sessionId: string; sessionName: string }>) => {
      const session = state.chats.find(chat => !chat.session_id || chat.session_id === action.payload.sessionId);
      if (session) {
        session.session_id = action.payload.sessionId;
        session.session_name = action.payload.sessionName;
      }
      state.currentSessionId = action.payload.sessionId;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all chats
      .addCase(getChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChats.fulfilled, (state, action: PayloadAction<ChatSession[]>) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(getChats.rejected, (state, action: PayloadAction<ErrorPayload | any>) => {
        state.error = action.payload?.error || {};
        state.loading = false;
      })

      // Get messages for one session
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<{ sessionId: string | null; messages: ChatMessage[] }>) => {
          state.currentSessionId = action.payload.sessionId;
          state.messages = action.payload.messages;
          state.loading = false;
        }
      )
      .addCase(getMessages.rejected, (state, action: PayloadAction<ErrorPayload | any>) => {
        state.error = action.payload?.error || {};
        state.loading = false;
      })

      // Add messages
      .addCase(addMessage.pending, (state) => {
        state.assistantLoading = true;
      })
      .addCase(
        addMessage.fulfilled,
        (state, action: PayloadAction<{ sessionId: string; message: ChatMessage; sessionName: string }>) => {
          // Update the session details if this was a new chat
          const session = state.chats.find(chat => !chat.session_id || chat.session_id === action.payload.sessionId);
          if (session) {
            session.session_id = action.payload.sessionId;
            session.session_name = action.payload.sessionName;
          }
          
          // Update current session ID if it was a new chat
          if (!state.currentSessionId) {
            state.currentSessionId = action.payload.sessionId;
          }
          
          // Add the AI message
          if (state.currentSessionId === action.payload.sessionId) {
            state.messages.push(action.payload.message);
          }
          
          state.assistantLoading = false;
        }
      )
      .addCase(addMessage.rejected, (state, action: PayloadAction<ErrorPayload | any>) => {
        state.error = action.payload?.error || {};
        state.assistantLoading = false;
      })

      // Delete session
      .addCase(deleteSession.fulfilled, (state, action: PayloadAction<string>) => {
        state.chats = state.chats.filter(chat => chat.session_id !== action.payload);
        if (state.currentSessionId === action.payload) {
          state.currentSessionId = null;
          state.messages = [];
        }
      })

      // Rename session
      .addCase(renameSession.fulfilled, (state, action: PayloadAction<ChatSession>) => {
        const session = state.chats.find(chat => chat.session_id === action.payload.session_id);
        if (session) {
          session.session_name = action.payload.session_name;
        }
      });
  },
});

export const { addUserMessage, clearMessages, addNewSession, updateSessionDetails } = ChatsSlice.actions;
export default ChatsSlice.reducer;
