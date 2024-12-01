import React from 'react';
import { description } from './index';
import type { ChatHistoryItem } from './index';

interface ChatDescriptionProps {
  chat: ChatHistoryItem;
}

export function ChatDescription({ chat }: ChatDescriptionProps) {
  return (
    <div className="text-sm text-bolt-elements-textSecondary">
      {description.get(chat)}
    </div>
  );
}
