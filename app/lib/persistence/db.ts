import type { ChatHistoryItem } from './index';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface Chat {
  id: string;
  messages: ChatMessage[];
}

class ChatDB {
  private chats: Map<string, Chat>;

  constructor() {
    this.chats = new Map();
  }

  async getAll(): Promise<ChatHistoryItem[]> {
    return Array.from(this.chats.values()).map(chat => ({
      id: chat.id,
      urlId: chat.id,
      title: `Chat ${chat.id}`,
      description: `Chat ${chat.id}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
      messages: chat.messages
    }));
  }

  async getById(id: string): Promise<ChatHistoryItem | null> {
    const chat = this.chats.get(id);
    if (!chat) return null;

    return {
      id: chat.id,
      urlId: chat.id,
      title: `Chat ${chat.id}`,
      description: `Chat ${chat.id}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
      messages: chat.messages
    };
  }

  async deleteById(id: string): Promise<void> {
    this.chats.delete(id);
  }

  async save(chat: ChatHistoryItem): Promise<void> {
    this.chats.set(chat.id, {
      id: chat.id,
      messages: chat.messages
    });
  }

  async addMessage(chatId: string, message: ChatMessage): Promise<void> {
    const chat = this.chats.get(chatId);
    if (!chat) {
      this.chats.set(chatId, {
        id: chatId,
        messages: [message]
      });
      return;
    }

    chat.messages.push(message);
  }

  async removeMessage(chatId: string, messageId: string): Promise<void> {
    const chat = this.chats.get(chatId);
    if (!chat) return;

    const messageIndex = chat.messages.findIndex((msg: ChatMessage) => msg.id === messageId);
    if (messageIndex === -1) return;

    chat.messages.splice(messageIndex, 1);
  }
}

export const db = new ChatDB();
