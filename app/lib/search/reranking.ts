import { CohereClient } from 'cohere-ai';
import type { LLMInterface } from '~/lib/llm/types';
import type { ReRankingSystem, SearchResult } from './types';

export interface ReRankingConfig {
  model: string;
  topN: number;
  returnDocuments: boolean;
  batchSize?: number;
  maxRetries?: number;
  retryDelay?: number;
  contextWeight?: number;
}

export interface RerankResult {
  index: number;
  relevanceScore: number;
}

export class CohereReRankingError extends Error {
  constructor(message: string, public readonly originalError: unknown) {
    super(message);
    this.name = 'CohereReRankingError';
  }
}

export class LLMReRankingSystem implements ReRankingSystem {
  private _context: string;
  private readonly _config: ReRankingConfig;
  private readonly _client: CohereClient;

  constructor(
    private readonly llmModel: LLMInterface,
    private readonly apiKey: string = process.env.COHERE_API_KEY ?? '',
    config: Partial<ReRankingConfig> = {}
  ) {
    this._context = '';
    this._config = {
      model: 'rerank-multilingual-v2.0',
      topN: 10,
      returnDocuments: true,
      batchSize: 50,
      maxRetries: 3,
      retryDelay: 1000,
      contextWeight: 0.3,
      ...config,
    };

    if (!this.apiKey) {
      throw new Error('COHERE_API_KEY is required for reranking');
    }

    this._client = new CohereClient({
      token: this.apiKey
    });
  }

  private async rerankBatch(
    batch: SearchResult[],
    query: string,
    retryCount = 0
  ): Promise<SearchResult[]> {
    try {
      const enhancedQuery = this.buildEnhancedQuery(query);
      const response = await this._client.rerank({
        query: enhancedQuery,
        documents: batch.map((result) => ({
          text: result.content,
          id: result.id,
          title: result.title,
        })),
        model: this._config.model,
        topN: Math.min(this._config.topN, batch.length),
        returnDocuments: this._config.returnDocuments,
      });

      return response.results.map((reranked) => {
        const originalResult = batch[reranked.index];
        const contextualScore = this.calculateContextualScore(
          reranked.relevanceScore,
          originalResult
        );

        return {
          ...originalResult,
          relevanceScore: contextualScore,
          confidence: contextualScore * 100,
          rerankedPosition: reranked.index,
        };
      });
    } catch (error) {
      if (retryCount < this._config.maxRetries!) {
        await new Promise(resolve => 
          setTimeout(resolve, this._config.retryDelay! * Math.pow(2, retryCount))
        );
        return this.rerankBatch(batch, query, retryCount + 1);
      }
      throw error;
    }
  }

  private buildEnhancedQuery(query: string): string {
    const contextPart = this._context ? `Context: ${this._context}\n` : '';
    return `${contextPart}Query: ${query}`.trim();
  }

  private calculateContextualScore(
    baseScore: number,
    result: SearchResult
  ): number {
    const contextRelevance = this._context
      ? this.calculateContextRelevance(result)
      : 1;
    return baseScore * (1 - this._config.contextWeight!) +
           contextRelevance * this._config.contextWeight!;
  }

  private calculateContextRelevance(result: SearchResult): number {
    if (!this._context) return 1;
    const contextTerms = this._context.toLowerCase().split(/\s+/);
    const contentTerms = result.content.toLowerCase().split(/\s+/);
    const matchCount = contextTerms.filter(term => 
      contentTerms.includes(term)
    ).length;
    return Math.min(matchCount / contextTerms.length, 1);
  }

  async rerank(results: SearchResult[], query: string): Promise<SearchResult[]> {
    if (results.length === 0) {
      return results;
    }

    try {
      const batches: SearchResult[][] = [];
      for (let i = 0; i < results.length; i += this._config.batchSize!) {
        batches.push(results.slice(i, i + this._config.batchSize!));
      }

      const rerankedBatches = await Promise.all(
        batches.map(batch => this.rerankBatch(batch, query))
      );

      const rerankedResults = rerankedBatches.flat();
      return rerankedResults.sort((a, b) => (b?.relevanceScore ?? 0) - (a?.relevanceScore ?? 0));
    } catch (error) {
      const cohereError = new CohereReRankingError(
        'Cohere reranking failed',
        error
      );
      console.error(cohereError);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }
      return results;
    }
  }

  updateContext(context: string): void {
    this._context = context;
  }

  getContext(): string {
    return this._context;
  }
}
