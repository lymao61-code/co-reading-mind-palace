export type Language = 'en' | 'zh';

export interface MindPalaceNote {
  id: string;
  date: string; // ISO string
  bookTitle: string;
  chapter: string;
  summary: string;
  takeaways: string[];
}

export interface CelebrityGuest {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  badgeColor: string;
  promptFocus: string;
  isAuthor?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string; // ISO string
  isSystem?: boolean;
  speaker?: string; // Optional speaker identifier e.g. "苏格拉底", "王阳明", "主持人"
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: string; // ISO string
  summarized?: boolean;
  palaceNoteId?: string;
  roundtableGuests?: CelebrityGuest[];
}

export interface SharedPalace {
  code: string;
  title: string;
  author: string;
  createdAt: string;
  visits?: number;
  notes: MindPalaceNote[];
}

