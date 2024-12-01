import type { SearchProvider, SearchResult } from '~/lib/search/types';

export class SerperSearchProvider implements SearchProvider {
  name = 'serper' as const;

  constructor(public apiKey: string) {}

  async search(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          gl: 'us',
          hl: 'en',
        }),
      });

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.statusText}`);
      }

      const data = await response.json();

      return this._transformResults(data);
    } catch (error) {
      console.error('Serper search error:', error);
      throw new Error('Failed to perform Serper search');
    }
  }

  private _transformResults(data: any): SearchResult[] {
    const organic = data.organic || [];

    return organic.map((result: any) => ({
      content: result.snippet || '',
      url: result.link,
      relevance: 1.0, // Base relevance, will be adjusted by reranker
      metadata: {
        title: result.title,
        position: result.position,
        timestamp: new Date().toISOString(),
      },
    }));
  }
}
