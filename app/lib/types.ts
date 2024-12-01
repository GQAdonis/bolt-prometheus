export type Framework = 'next' | 'svelte' | 'remix' | 'react';

export interface TechStack {
  framework: Framework;
  version: string;
  ui: string;
  stateManagement: string;
  validation: string;
  styling: string;
  testing?: string;
  api?: string;
}

export interface GeneratedApp {
  techStack: TechStack;
  files: Array<{
    path: string;
    content: string;
  }>;
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
  scripts: {
    [key: string]: string;
  };
  instructions?: string;
}

export interface ModelInfo {
  name: string;
  label: string;
  provider: string;
  maxTokenAllowed: number;
  capabilities?: Array<'code' | 'vision' | 'function-calling'>;
}

export interface Provider {
  id: string;
  name: string;
  staticModels: ModelInfo[];
  hasValidKey?: boolean;
  requiresApiKey?: boolean;
  apiKeyUrl?: string;
  getApiKeyLink?: string;
  labelForGetApiKey?: string;
  icon?: string;
  modelsEndpoint?: string;
  headers?: Record<string, string>;
}
