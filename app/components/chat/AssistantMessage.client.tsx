import React from 'react';

interface AssistantMessageProps {
  content: string;
}

export function AssistantMessage({ content }: AssistantMessageProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-muted rounded-lg py-2 px-4 max-w-[80%]">
        {content}
      </div>
    </div>
  );
}
