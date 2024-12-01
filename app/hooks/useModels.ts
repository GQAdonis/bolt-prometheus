import { useState, useEffect } from 'react';
import type { Provider, ModelInfo } from '~/lib/types';

interface UseModelsProps {
  provider: Provider;
  apiKey?: string;
}

interface OpenAIResponse {
  data: Array<{
    id: string;
    context_window?: number;
  }>;
}

interface AnthropicResponse {
  models: Array<{
    name: string;
    context_window?: number;
  }>;
}

interface OllamaResponse {
  models: Array<{
    name: string;
  }>;
}

export function useModels({ provider, apiKey }: UseModelsProps) {
  const [models, setModels] = useState<ModelInfo[]>(provider.staticModels);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provider.modelsEndpoint || !apiKey) {
      setModels(provider.staticModels);
      return;
    }

    async function fetchModels() {
      setIsLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(provider.headers || {}),
        };

        if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(provider.modelsEndpoint!, {
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Transform the response based on provider
        let transformedModels: ModelInfo[] = [];
        
        switch (provider.id) {
          case 'openai':
          case 'openai-compatible': {
            const typedData = data as OpenAIResponse;
            transformedModels = typedData.data
              .filter(model => model.id.includes('gpt'))
              .map(model => ({
                name: model.id,
                label: model.id,
                provider: provider.id,
                maxTokenAllowed: model.context_window || 4096,
              }));
            break;
          }
            
          case 'anthropic': {
            const typedData = data as AnthropicResponse;
            transformedModels = typedData.models.map(model => ({
              name: model.name,
              label: model.name,
              provider: provider.id,
              maxTokenAllowed: model.context_window || 100000,
              capabilities: ['code', 'vision', 'function-calling'],
            }));
            break;
          }
            
          case 'ollama': {
            const typedData = data as OllamaResponse;
            transformedModels = typedData.models.map(model => ({
              name: model.name,
              label: model.name,
              provider: provider.id,
              maxTokenAllowed: 4096,
            }));
            break;
          }
            
          // Add more provider-specific transformations as needed
          
          default:
            console.warn(`No transformer defined for provider: ${provider.id}`);
            transformedModels = provider.staticModels;
        }

        setModels([...provider.staticModels, ...transformedModels]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch models');
        setModels(provider.staticModels);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModels();
  }, [provider, apiKey]);

  return { models, isLoading, error };
}
