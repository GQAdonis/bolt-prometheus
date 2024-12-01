import type { SearchProvider, SearchResult } from '~/lib/search/types';

export class TavilySearchProvider implements SearchProvider {
  name = 'tavily' as const;

  constructor(public apiKey: string) {}

  async search(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          search_depth: 'advanced',
          include_answer: false,
          include_raw_content: false,
          include_images: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }

      const data = await response.json();

      return this._transformResults(data);
    } catch (error) {
      console.error('Tavily search error:', error);
      throw new Error('Failed to perform Tavily search');
    }
  }

  private _transformResults(data: any): SearchResult[] {
    const results = data.results || [];

    return results.map((result: any) => ({
      content: result.content || '',
      url: result.url,
      relevance: result.score || 1.0,
      metadata: {
        title: result.title,
        timestamp: new Date().toISOString(),
      },
    }));
  }
}
