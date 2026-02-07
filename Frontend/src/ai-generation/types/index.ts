export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type AIMode = 'trends' | 'captions' | 'images';

export interface GeneratedContent {
  id: string;
  type: AIMode;
  content: string;
  imageUrl?: string;
  timestamp: Date;
}
