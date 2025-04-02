import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { getSessions, getMessages, sendMessage, deleteSession, renameSession } from "./thunk";
import { ChatMessage, ChatSession } from "../../common/data/chat";
import { ChatResponse } from "../../services/ChatService";

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
    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentSessionId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all chats
      .addCase(getSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSessions.fulfilled, (state, action: PayloadAction<ChatSession[]>) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(getSessions.rejected, (state, action: PayloadAction<ErrorPayload | any>) => {
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

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.assistantLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<ChatResponse>) => {
        // For new chats, create and add the session
        if (!state.currentSessionId && action.payload.sessionId) {
          const newSession: ChatSession = {
            session_id: action.payload.sessionId,
            session_name: action.payload.sessionName || "New Chat",
            assist_id: action.payload.assistant_type === 'log' ? 2 : 1,
            messages: []
          };
          // Add new session to the beginning of the list
          state.chats.unshift(newSession);
          state.currentSessionId = action.payload.sessionId;
        }
        
        // Add the message to current messages
        state.messages.push({
          id: parseInt(action.payload.id, 10),
          content: action.payload.content,
          isUser: action.payload.isUser,
          timestamp: action.payload.timestamp
        });
        
        state.assistantLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action: PayloadAction<ErrorPayload | any>) => {
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

export const { addUserMessage, clearMessages } = ChatsSlice.actions;
export default ChatsSlice.reducer;
