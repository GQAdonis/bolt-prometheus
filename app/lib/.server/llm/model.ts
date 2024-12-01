import type { Provider } from '~/lib/types';
import type { Message } from 'ai';

export interface LLMModel {
  provider: Provider;
  model: string;
  apiKey: string;
}

interface Env {
  [key: string]: string;
}

export function getModel(provider: string, model: string, env: Env, apiKeys?: Record<string, string>) {
  const apiKey = apiKeys?.[provider] || '';
  const providerObj = {
    id: provider,
    name: provider,
    staticModels: []
  };

  switch (provider) {
    case 'groq': {
      return {
        provider: providerObj,
        model,
        apiKey,
        async doStream({ messages }: { messages: Message[] }) {
          const response = await fetch('https://api.groq.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              messages: messages.map(m => ({
                role: m.role,
                content: m.content
              })),
              stream: true,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error('No reader available');
          }

          return new ReadableStream({
            async start(controller) {
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  const chunk = decoder.decode(value);
                  const lines = chunk.split('\n').filter(line => line.trim() !== '');

                  for (const line of lines) {
                    if (line.startsWith('data: ')) {
                      const data = line.slice(6);
                      if (data === '[DONE]') continue;

                      try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                          controller.enqueue(content);
                        }
                      } catch (e) {
                        console.error('Error parsing JSON:', e);
                      }
                    }
                  }
                }
                controller.close();
              } catch (e) {
                controller.error(e);
              }
            },
          });
        }
      };
    }
    default:
      return {
        provider: providerObj,
        model,
        apiKey,
        async doStream() {
          return new ReadableStream({
            start(controller) {
              controller.enqueue('Streaming not implemented for this provider');
              controller.close();
            }
          });
        }
      };
  }
}
