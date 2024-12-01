import React from 'react';

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="bg-primary text-primary-foreground rounded-lg py-2 px-4 max-w-[80%]">
        {content}
      </div>
    </div>
  );
}
