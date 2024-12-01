/**
 * Search provider configuration from environment variables
 */
export interface SearchConfig {
  serper: {
    apiKey: string;
    enabled: boolean;
  };
  tavily: {
    apiKey: string;
    enabled: boolean;
  };
  models: {
    path: string;
  };
}

export function getSearchConfig(): SearchConfig {
  return {
    serper: {
      apiKey: process.env.SERPER_API_KEY || '',
      enabled: Boolean(process.env.SERPER_API_KEY),
    },
    tavily: {
      apiKey: process.env.TAVILY_API_KEY || '',
      enabled: Boolean(process.env.TAVILY_API_KEY),
    },
    models: {
      path: process.env.MODELS_PATH || './models',
    },
  };
}

/**
 * Validate search configuration
 * @throws Error if no search providers are configured
 */
export function validateSearchConfig(config: SearchConfig): void {
  if (!config.serper.enabled && !config.tavily.enabled) {
    throw new Error(
      'No search providers configured. Set either SERPER_API_KEY or TAVILY_API_KEY environment variables.',
    );
  }
}
