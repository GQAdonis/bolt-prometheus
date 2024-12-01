import { useState, useRef, useEffect } from 'react';
import { Messages } from './Messages.client';
import { ChatInput } from './ChatInput.client';
import { Header } from '../header/Header';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  artifacts?: Array<{
    type: string;
    content: string;
  }>;
}

export interface BaseChatProps {
  projectName?: string;
  provider?: string;
  model?: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apiKey?: string;
  initialPrompt?: string;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function BaseChat({ 
  projectName = 'Bolt', 
  provider = 'Default', 
  model = 'Default Model', 
  apiKey = '', 
  initialPrompt = 'How can I help you today?' 
}: BaseChatProps) {
  console.log('API Key:', apiKey);
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateMessageId(),
      role: 'user',
      content: initialPrompt
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message: string) => {
    setIsProcessing(true);
    try {
      // Add user message
      const userMessage: Message = {
        id: generateMessageId(),
        role: 'user',
        content: message
      };
      setMessages(prev => [...prev, userMessage]);

      // Here you would make an API call to your AI provider using apiKey
      // For now, we'll simulate a response
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Processing request for ${projectName} using ${provider} ${model}...`,
        artifacts: []
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4">
          <Messages messages={messages} />
        </div>
        <div className="p-4 border-t">
          <ChatInput onSend={handleSend} disabled={isProcessing} />
        </div>
      </div>
    </div>
  );
}
