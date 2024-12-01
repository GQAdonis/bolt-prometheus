import type { Provider } from './types';

export const providers: Provider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    requiresApiKey: true,
    apiKeyUrl: 'https://console.anthropic.com/account/keys',
    getApiKeyLink: 'https://console.anthropic.com/account/keys',
    labelForGetApiKey: 'Get Anthropic API Key',
    modelsEndpoint: 'https://api.anthropic.com/v1/models',
    icon: '/providers/anthropic.svg',
    staticModels: [
      { 
        name: 'claude-3-opus',
        label: 'Claude 3 Opus',
        provider: 'anthropic',
        maxTokenAllowed: 200000,
        capabilities: ['code', 'vision', 'function-calling']
      },
      { 
        name: 'claude-3-sonnet',
        label: 'Claude 3 Sonnet',
        provider: 'anthropic',
        maxTokenAllowed: 200000,
        capabilities: ['code', 'vision', 'function-calling']
      }
    ]
  },
  {
    id: 'ollama',
    name: 'Ollama',
    requiresApiKey: false,
    modelsEndpoint: 'http://localhost:11434/api/tags',
    icon: '/providers/ollama.svg',
    staticModels: []
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI Like',
    requiresApiKey: true,
    modelsEndpoint: '/v1/models',
    icon: '/providers/openai.svg',
    staticModels: []
  },
  {
    id: 'openai',
    name: 'OpenAI',
    requiresApiKey: true,
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    getApiKeyLink: 'https://platform.openai.com/api-keys',
    labelForGetApiKey: 'Get OpenAI API Key',
    modelsEndpoint: 'https://api.openai.com/v1/models',
    icon: '/providers/openai.svg',
    staticModels: [
      { 
        name: 'gpt-4-turbo',
        label: 'GPT-4 Turbo',
        provider: 'openai',
        maxTokenAllowed: 128000,
        capabilities: ['code', 'vision', 'function-calling']
      }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    requiresApiKey: true,
    apiKeyUrl: 'https://dashboard.cohere.ai/api-keys',
    getApiKeyLink: 'https://dashboard.cohere.ai/api-keys',
    labelForGetApiKey: 'Get Cohere API Key',
    modelsEndpoint: 'https://api.cohere.ai/v1/models',
    icon: '/providers/cohere.svg',
    staticModels: []
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    requiresApiKey: true,
    apiKeyUrl: 'https://openrouter.ai/keys',
    getApiKeyLink: 'https://openrouter.ai/keys',
    labelForGetApiKey: 'Get OpenRouter API Key',
    modelsEndpoint: 'https://openrouter.ai/api/v1/models',
    icon: '/providers/openrouter.svg',
    staticModels: []
  },
  {
    id: 'google',
    name: 'Google',
    requiresApiKey: true,
    apiKeyUrl: 'https://console.cloud.google.com/apis/credentials',
    getApiKeyLink: 'https://console.cloud.google.com/apis/credentials',
    labelForGetApiKey: 'Get Google API Key',
    modelsEndpoint: 'https://generativelanguage.googleapis.com/v1/models',
    icon: '/providers/google.svg',
    staticModels: []
  },
  {
    id: 'groq',
    name: 'Groq',
    requiresApiKey: true,
    apiKeyUrl: 'https://console.groq.com/keys',
    getApiKeyLink: 'https://console.groq.com/keys',
    labelForGetApiKey: 'Get Groq API Key',
    modelsEndpoint: 'https://api.groq.com/v1/models',
    icon: '/providers/groq.svg',
    staticModels: [
      {
        name: 'llama2-70b-4096',
        label: 'LLaMA 2 70B',
        provider: 'groq',
        maxTokenAllowed: 4096,
        capabilities: ['code', 'function-calling']
      },
      {
        name: 'mixtral-8x7b-32768',
        label: 'Mixtral 8x7B',
        provider: 'groq',
        maxTokenAllowed: 32768,
        capabilities: ['code', 'function-calling']
      }
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    requiresApiKey: true,
    apiKeyUrl: 'https://huggingface.co/settings/tokens',
    getApiKeyLink: 'https://huggingface.co/settings/tokens',
    labelForGetApiKey: 'Get Hugging Face API Key',
    modelsEndpoint: 'https://api-inference.huggingface.co/models',
    icon: '/providers/huggingface.svg',
    staticModels: []
  },
  {
    id: 'xai',
    name: 'xAI',
    requiresApiKey: true,
    apiKeyUrl: 'https://x.ai',
    getApiKeyLink: 'https://x.ai',
    labelForGetApiKey: 'Get xAI API Key',
    icon: '/providers/xai.svg',
    staticModels: []
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    requiresApiKey: true,
    apiKeyUrl: 'https://platform.deepseek.com/api',
    getApiKeyLink: 'https://platform.deepseek.com/api',
    labelForGetApiKey: 'Get DeepSeek API Key',
    modelsEndpoint: 'https://api.deepseek.com/v1/models',
    icon: '/providers/deepseek.svg',
    staticModels: []
  },
  {
    id: 'mistral',
    name: 'Mistral',
    requiresApiKey: true,
    apiKeyUrl: 'https://console.mistral.ai/api-keys',
    getApiKeyLink: 'https://console.mistral.ai/api-keys',
    labelForGetApiKey: 'Get Mistral API Key',
    modelsEndpoint: 'https://api.mistral.ai/v1/models',
    icon: '/providers/mistral.svg',
    staticModels: []
  },
  {
    id: 'lmstudio',
    name: 'LMStudio',
    requiresApiKey: false,
    modelsEndpoint: 'http://localhost:1234/v1/models',
    icon: '/providers/lmstudio.svg',
    staticModels: []
  }
];
