import type { LLMInterface } from '~/lib/llm/types';
import type { SearchProvider, SearchResult, SearchSystem } from './types';
import { SerperSearchProvider } from './providers/serper';
import { TavilySearchProvider } from './providers/tavily';
import { LLMReRankingSystem } from './reranking';
import { getSearchConfig, validateSearchConfig } from './config';

export type { SearchResult, SearchProvider, SearchSystem };
export { SerperSearchProvider, TavilySearchProvider };

export class SearchManager implements SearchSystem {
  private readonly _providers: Map<string, SearchProvider>;
  private readonly _reranker: LLMReRankingSystem;
  private _currentContext: string;
  private _activeProvider: SearchProvider;

  constructor(llm: LLMInterface) {
    const config = getSearchConfig();
    validateSearchConfig(config);

    this._providers = new Map();
    this._reranker = new LLMReRankingSystem(llm);
    this._currentContext = '';

    // Create a default provider that will be replaced if configuration exists
    const defaultProvider = new SerperSearchProvider('default-key');
    this._activeProvider = defaultProvider;

    // Initialize configured providers
    if (config.serper.enabled) {
      const serperProvider = new SerperSearchProvider(config.serper.apiKey);
      this._providers.set(serperProvider.name, serperProvider);
      this._activeProvider = serperProvider;
    }

    if (config.tavily.enabled) {
      const tavilyProvider = new TavilySearchProvider(config.tavily.apiKey);
      this._providers.set(tavilyProvider.name, tavilyProvider);

      if (this._providers.size === 1) {
        this._activeProvider = tavilyProvider;
      }
    }

    // If no providers were configured, add the default one
    if (this._providers.size === 0) {
      this._providers.set(defaultProvider.name, defaultProvider);
    }
  }

  get providers(): Map<string, SearchProvider> {
    return this._providers;
  }

  get reranker(): LLMReRankingSystem {
    return this._reranker;
  }

  get currentContext(): string {
    return this._currentContext;
  }

  get activeProvider(): SearchProvider {
    return this._activeProvider;
  }

  async search(query: string): Promise<SearchResult[]> {
    const results = await this._activeProvider.search(query);

    return this._reranker.rerank(results, this._currentContext);
  }

  setActiveProvider(name: 'serper' | 'tavily'): void {
    const provider = this._providers.get(name);

    if (!provider) {
      throw new Error(`Provider ${name} is not configured. Check your environment variables.`);
    }

    this._activeProvider = provider;
  }

  updateContext(context: string): void {
    this._currentContext = context;
    this._reranker.updateContext(context);
  }

  static async create(llm: LLMInterface): Promise<SearchManager> {
    return new SearchManager(llm);
  }
}
