import React from 'react';
import { Markdown } from './Markdown';

interface AssistantMessageProps {
  content: string;
}

export function AssistantMessage({ content }: AssistantMessageProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-bolt-elements-background-depth-2" />
        <div className="text-sm font-medium">Assistant</div>
      </div>
      <Markdown content={content} html />
    </div>
  );
}
