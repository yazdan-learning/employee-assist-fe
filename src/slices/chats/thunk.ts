import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatService from "../../services/ChatService";
import { ChatMessage } from "../../common/data/chat";

// Get chat session list
export const getChats = createAsyncThunk("chats/getChats", async () => {
  try {
    const response = await ChatService.getSessions();
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Get messages for a specific chat session
export const getMessages = createAsyncThunk(
  "chats/getMessages",
  async (sessionId: string) => {
    try {
      const session = await ChatService.getSession(sessionId);
      // Map messages ensuring each has the correct isUser property
      const messages = session.messages?.map(message => ({
        ...message,
        // If role is present, use it, otherwise use existing isUser property
        isUser: message.role ? message.role === 'user' : message.isUser
      })) || [];
      
      return {
        sessionId,
        messages
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// Add a new message to a chat session and get AI response
export const addMessage = createAsyncThunk(
  "chats/addMessage",
  async ({ sessionId, message }: { sessionId: string | null; message: ChatMessage }, { dispatch }) => {
    try {
      // Get the AI response - API will create new session if sessionId is null
      const response = await ChatService.sendMessage(sessionId, message.content);
      
      // If this was a new chat (null sessionId), refresh the chat list
      if (!sessionId) {
        dispatch(getChats());
      }
      
      // Return the AI message along with session details
      return {
        sessionId: response.sessionId,
        sessionName: response.sessionName,
        message: {
          id: Date.now(),
          isUser: false,
          content: response.content,
          timestamp: response.timestamp
        }
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// Delete a chat session
export const deleteSession = createAsyncThunk(
  "chats/deleteSession",
  async (sessionId: string) => {
    try {
      await ChatService.deleteSession(sessionId);
      return sessionId;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// Rename a chat session
export const renameSession = createAsyncThunk(
  "chats/renameSession",
  async ({ sessionId, newName }: { sessionId: string; newName: string }) => {
    try {
      const response = await ChatService.renameSession(sessionId, newName);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);
