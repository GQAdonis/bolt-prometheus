import type { Provider } from '~/lib/types';

export const MODIFICATIONS_TAG_NAME = 'MODIFICATIONS';
export const WORK_DIR = '/tmp/workdir';
export const DEFAULT_PROVIDER = 'groq';
export const DEFAULT_MODEL = 'llama2-70b-4096';
export const MODEL_REGEX = /^[a-zA-Z0-9-]+$/;
export const PROVIDER_REGEX = /^[a-zA-Z0-9-]+$/;

export const providers: Provider[] = [
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
  }
];

export const MODEL_LIST = providers.flatMap(provider => provider.staticModels);

export async function initializeModelList() {
  // This is now a no-op since we're using static models
  return;
}
