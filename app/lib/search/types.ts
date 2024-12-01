import type { LLMInterface } from '~/lib/llm/types';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore?: number;
  confidence?: number;
  rerankedPosition?: number;
  metadata?: Record<string, unknown>;
}

export interface SearchProvider {
  name: 'serper' | 'tavily' | 'tantivy';
  apiKey: string;
  search(query: string): Promise<SearchResult[]>;
}

export interface ReRankingSystem {
  rerank(results: SearchResult[], query: string): Promise<SearchResult[]>;
  updateContext(context: string): void;
  getContext(): string;
}

export interface SearchSystem {
  providers: Map<string, SearchProvider>;
  reranker: ReRankingSystem;
  currentContext: string;
  activeProvider: SearchProvider;
}
