import {  ChatSession } from "../common/data/chat";
import { APIClient } from "../helpers/api_helper";

// Base URL for the API
const API_BASE_URL = "http://localhost:8000/api";
const chatApi = new APIClient();

interface ChatRequest {
  session_id: string;
  query: string;
}

interface ChatResponse {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: string;
  sessionId: string;
  sessionName: string;
}

interface SessionInfo {
  session_id: string;
  session_name: string;
  assist_id: number;
}

class ChatService {
  // Fetch all chat sessions
  async getSessions(assistId?: number): Promise<SessionInfo[]> {
    const params = assistId ? { assist_id: assistId } : null;
    const response = await chatApi.get(`${API_BASE_URL}/sessions`, params);
    return (response as unknown) as SessionInfo[];
  }

  // Get a specific session
  async getSession(sessionId: string): Promise<ChatSession> {
    const response = await chatApi.get(`${API_BASE_URL}/sessions/${sessionId}`, null);
    return (response as unknown) as ChatSession;
  }

  // Create a new session
  async createSession(session: ChatSession): Promise<ChatSession> {
    const response = await chatApi.create(`${API_BASE_URL}/sessions`, session);
    return (response as unknown) as ChatSession;
  }

  // Delete a session
  async deleteSession(sessionId: string): Promise<void> {
    await chatApi.delete(`${API_BASE_URL}/sessions/${sessionId}`, null);
  }

  // Rename a session
  async renameSession(sessionId: string, newName: string): Promise<ChatSession> {
    const response = await chatApi.put(`${API_BASE_URL}/sessions/rename`, {
      session_id: sessionId,
      new_name: newName
    });
    return (response as unknown) as ChatSession;
  }

  // Send a message and get AI response
  async sendMessage(sessionId: string | null, message: string): Promise<ChatResponse> {
    const request: ChatRequest = {
      session_id: sessionId || '',
      query: message
    };
    
    const response = await chatApi.create(`${API_BASE_URL}/assist`, request);
    return (response as unknown) as ChatResponse;
  }
}

export default new ChatService();
