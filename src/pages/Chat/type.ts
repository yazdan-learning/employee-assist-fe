export interface Message {
  id: number;
  sender: "user" | "assistant"; // User or AI
  msg: string;
  time: string; // Time format as string
  image?: string; // Optional image URL
}

export interface RecentChat {
  id: number;
  name: string; // Title of the chat session
  messages: Message[]; // Messages in this session
  createdAt: string; // Chat creation timestamp
  lastUpdated: string; // Last updated timestamp
}
