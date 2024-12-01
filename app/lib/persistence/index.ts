import { useChatHistory } from './useChatHistory';

export interface ChatHistoryItem {
  id: string;
  urlId: string;
  title: string;
  description: string;
  timestamp: string;
  createdAt: Date;
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
  }>;
}

export interface ChatDB {
  getAll: () => Promise<ChatHistoryItem[]>;
  getById: (id: string) => Promise<ChatHistoryItem | null>;
  deleteById: (id: string) => Promise<void>;
  save: (chat: ChatHistoryItem) => Promise<void>;
}

export const db: ChatDB = {
  async getAll() {
    // Implementation would go here
    return [];
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getById(id: string) {
    // Implementation would go here
    return null;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteById(id: string) {
    // Implementation would go here
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async save(chat: ChatHistoryItem) {
    // Implementation would go here
  }
};

export const chatId = {
  get current(): string | null {
    return localStorage.getItem('currentChatId');
  },
  set current(id: string | null) {
    if (id) {
      localStorage.setItem('currentChatId', id);
    } else {
      localStorage.removeItem('currentChatId');
    }
  }
};

export const description = {
  get(chat: ChatHistoryItem): string {
    if (!chat.description) {
      return chat.title || 'Untitled Chat';
    }
    return chat.description;
  }
};

export { useChatHistory };

export async function deleteById(id: string): Promise<void> {
  await db.deleteById(id);
}

export async function getAll(): Promise<ChatHistoryItem[]> {
  return db.getAll();
}
