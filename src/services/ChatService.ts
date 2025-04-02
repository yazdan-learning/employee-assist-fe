import {  ChatSession } from "../common/data/chat";
import { APIClient } from "../helpers/api_helper";

// Base URL for the API
const API_BASE_URL = "http://localhost:8000/api";
const chatApi = new APIClient();

export enum AssistantType {
  GENERAL = "general",
  LOG = "log"
}

interface ChatRequest {
  query: string;
  session_id: string;
  assistant_type: AssistantType;
}

export interface ChatResponse {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: string;
  sessionId: string;
  sessionName: string;
  assistant_type: AssistantType;
}

interface SessionInfo {
  session_id: string;
  session_name: string;
  assist_id: number;
  assistant_type: AssistantType;
}

class ChatService {
  // Fetch all chat sessions
  async getSessions(assistantType: AssistantType = AssistantType.GENERAL): Promise<SessionInfo[]> {
    const url = `${API_BASE_URL}/sessions/list?assistant_type=${assistantType.toLowerCase()}`;
    const response = await chatApi.get(url, null);
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
  async sendMessage(
    sessionId: string | null,
    message: string,
    assistantType: AssistantType = AssistantType.GENERAL
  ): Promise<ChatResponse> {
    const request: ChatRequest = {
      query: message,
      session_id: sessionId || '',
      assistant_type: assistantType
    };
    
    const response = await chatApi.create(`${API_BASE_URL}/assist`, request);
    return (response as unknown) as ChatResponse;
  }
}

export default new ChatService();
