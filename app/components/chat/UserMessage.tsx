import React from 'react';
import { Markdown } from './Markdown';

interface UserMessageProps {
  content: string;
}

export function sanitizeUserMessage(content: string): string {
  // Remove any HTML tags for security
  return content.replace(/<[^>]*>/g, '');
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-bolt-elements-background-depth-2" />
        <div className="text-sm font-medium">You</div>
      </div>
      <Markdown content={sanitizeUserMessage(content)} limitedMarkdown />
    </div>
  );
}
