import { useState } from 'react';
import { ModelSelector } from './ModelSelector.client';
import { ChatInput } from './ChatInput.client';
import { Messages } from './Messages.client';
import { Sidebar } from './Sidebar.client';
import { providers } from '~/utils/constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  className?: string;
}

export function Chat({ className = '' }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('openrouter');
  const [selectedModel, setSelectedModel] = useState('01.ai/yi-large');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = async (message: string) => {
    if (!selectedProvider || !selectedModel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          provider: selectedProvider,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        assistantMessage += text;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantMessage,
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex flex-col h-full w-full ${className}`}>
        <div className="flex items-center p-4 border-b">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-muted/80 rounded-lg mr-4"
          >
            ☰
          </button>
          <ModelSelector
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            onProviderChange={setSelectedProvider}
            onModelChange={setSelectedModel}
            className="flex-1"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <Messages messages={messages} className="p-4" />
        </div>

        <div className="p-4 border-t">
          <ChatInput onSend={handleSubmit} />
        </div>
      </div>
    </>
  );
}
