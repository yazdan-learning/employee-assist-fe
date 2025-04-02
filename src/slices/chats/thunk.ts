import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatService, { AssistantType } from "../../services/ChatService";

// Get chat session list
export const getSessions = createAsyncThunk(
  "chats/getSessions",
  async (assistantType: AssistantType = AssistantType.GENERAL) => {
    try {
      const response = await ChatService.getSessions(assistantType);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

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
export const sendMessage = createAsyncThunk(
  "chats/sendMessage",
  async ({ 
    sessionId, 
    message, 
    assistantType = AssistantType.GENERAL 
  }: { 
    sessionId: string | null; 
    message: string; 
    assistantType?: AssistantType 
  }, { dispatch }) => {
    try {
      const response = await ChatService.sendMessage(sessionId, message, assistantType);
      // If this was a new chat (no sessionId), refresh the sessions list
      if (!sessionId) {
        await dispatch(getSessions(assistantType));
      }
      return response;
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
