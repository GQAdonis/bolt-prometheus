import { describe, it, expect } from 'vitest';
import {
  generateFilesFromTemplates,
  processTemplate,
  findSimilarTemplates,
  getTemplateEmbedding,
  validateTemplate
} from './template-processor';
import type { TechStack } from './types';

describe('Template Processor', () => {
  const mockData = {
    name: 'test-app',
    title: 'Test App',
    description: 'A test application',
  };

  describe('processTemplate', () => {
    it('should process a template with variables', async () => {
      const content = await processTemplate('next/package.hbs', mockData);
      expect(content).toContain('"name": "test-app"');
      expect(content).toContain('"version": "0.1.0"');
    });

    it('should handle conditional rendering', async () => {
      const content = await processTemplate('next/package.hbs', {
        ...mockData,
        testing: 'jest',
      });
      expect(content).toContain('"jest": "^');
      expect(content).not.toContain('"vitest": "^');
    });
  });

  describe('generateFilesFromTemplates', () => {
    it('should generate Next.js files', async () => {
      const files = await generateFilesFromTemplates('next', mockData);
      
      // Check if all required files are generated
      const fileNames = files.map(f => f.path);
      expect(fileNames).toContain('app/layout.tsx');
      expect(fileNames).toContain('app/page.tsx');
      expect(fileNames).toContain('app/globals.css');
      expect(fileNames).toContain('lib/store.ts');
      expect(fileNames).toContain('lib/validations/form.ts');
      expect(fileNames).toContain('package.json');

      // Check file contents
      const packageJson = files.find(f => f.path === 'package.json');
      expect(packageJson?.content).toContain('"name": "test-app"');

      const layout = files.find(f => f.path === 'app/layout.tsx');
      expect(layout?.content).toContain('title: "Test App"');
      expect(layout?.content).toContain('description: "A test application"');
    });

    it('should throw error for unsupported framework', async () => {
      await expect(
        generateFilesFromTemplates('unsupported' as TechStack['framework'], mockData)
      ).rejects.toThrow('Unsupported framework: unsupported');
    });
  });
});

describe('Template Vector Search', () => {
  const mockDescription = 'A modern Next.js application with authentication and database';

  it('should find similar templates', async () => {
    const results = await findSimilarTemplates(mockDescription);
    expect(results).toHaveLength(3); // Current mock returns 3 results
    expect(results[0]).toHaveProperty('path');
    expect(results[0]).toHaveProperty('similarity');
    expect(results[0].similarity).toBeGreaterThan(0);
  });

  it('should get template embeddings', async () => {
    const embedding = await getTemplateEmbedding('next/app/layout.hbs');
    // Currently returns null as it's not implemented
    expect(embedding).toBeNull();
  });
});

describe('Template Validation', () => {
  it('should validate template syntax', async () => {
    const isValid = await validateTemplate('next/package.hbs');
    expect(isValid).toBe(true);
  });

  it('should fail validation for invalid template', async () => {
    const isValid = await validateTemplate('non-existent.hbs');
    expect(isValid).toBe(false);
  });
});
