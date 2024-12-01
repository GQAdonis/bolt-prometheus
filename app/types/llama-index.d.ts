declare module '@llama-index/rerankers' {
  export interface RerankerOptions {
    modelPath: string;
    downloadModels: boolean;
    cacheDir: string;
  }

  export interface RerankingPrompt {
    text: string;
    query: string;
  }

  export class MXBaiReranker {
    constructor(options: RerankerOptions);
    rerank(prompts: RerankingPrompt[]): Promise<number[]>;
  }
}
