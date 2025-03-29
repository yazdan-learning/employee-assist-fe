export interface ChatMessage {
    id: number;
    isUser: boolean; // true for user message, false for assistant response
    content: string;
    timestamp: string;
    role?: 'user' | 'assistant'; // Role field from API
  }
  
  export interface ChatSession {
    session_id: string | null;
    session_name: string;
    assist_id: number;
    messages?: ChatMessage[];
  }
  
  export const chatHistory: ChatSession[] = [];
  
  export const chatMessages: Record<string, ChatMessage[]> = {};
  