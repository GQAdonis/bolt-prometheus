import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDatabase, storeTemplateEmbedding, findSimilarTemplates, trackTemplateUsage, recordTemplateFeedback } from './config';
import type { TemplateEmbedding } from './schema';

describe('Database Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDatabase', () => {
    it('should return null until pglite is integrated', async () => {
      const db = await getDatabase();
      expect(db).toBeNull();
    });
  });

  describe('Template Embeddings', () => {
    const mockEmbedding: number[] = Array(384).fill(0).map(() => Math.random());
    const mockMetadata: Omit<TemplateEmbedding, 'id' | 'embedding' | 'createdAt' | 'updatedAt'> = {
      framework: 'next',
      type: 'page',
      description: 'Next.js page template',
      capabilities: ['routing', 'ssr'],
      metadata: {
        version: '13.0.0',
        dependencies: ['react', 'next'],
      },
    };

    it('should handle storing template embeddings', async () => {
      const result = await storeTemplateEmbedding(
        'next/app/page.hbs',
        mockEmbedding,
        mockMetadata
      );
      // Currently returns null until pglite is integrated
      expect(result).toBeNull();
    });

    it('should handle finding similar templates', async () => {
      const results = await findSimilarTemplates(mockEmbedding, 5);
      // Currently returns empty array until pgvector is integrated
      expect(results).toEqual([]);
    });
  });

  describe('Usage Tracking', () => {
    it('should handle template usage tracking', async () => {
      const trackingPromise = trackTemplateUsage(
        'next/app/page.hbs',
        'Create a Next.js app with authentication',
        0.95,
        true
      );
      await expect(trackingPromise).resolves.toBeUndefined();
    });

    it('should handle template feedback', async () => {
      const feedbackPromise = recordTemplateFeedback(
        'next/app/page.hbs',
        'Create a Next.js app with authentication',
        5,
        'Great template, very helpful!'
      );
      await expect(feedbackPromise).resolves.toBeUndefined();
    });
  });
});
