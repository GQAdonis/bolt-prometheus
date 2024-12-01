import React, { useEffect, useRef } from 'react';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface MessagesProps {
  messages: Message[];
  className?: string;
}

export function Messages({ messages, className }: MessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={className}>
      {messages.map((message) => (
        <div key={message.id} className="mb-8">
          {message.role === 'user' ? (
            <UserMessage content={message.content} />
          ) : (
            <AssistantMessage content={message.content} />
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
