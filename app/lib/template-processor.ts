import Handlebars from 'handlebars';
import type { TechStack } from './types';

interface TemplateData {
  name: string;
  version: string;
  title: string;
  description: string;
  nextVersion: string;
  reactVersion: string;
  zustandVersion: string;
  zodVersion: string;
  hookformVersion: string;
  cvaVersion: string;
  clsxVersion: string;
  twMergeVersion: string;
  typescriptVersion: string;
  tailwindVersion: string;
  postcssVersion: string;
  autoprefixerVersion: string;
  testingVersion: string;
  nodeTypesVersion: string;
  testing?: string;
}

interface TemplateEmbedding {
  path: string;
  embedding: number[];
  metadata: {
    framework: string;
    type: string;
    description: string;
  };
}

const defaultVersions: Omit<TemplateData, 'name' | 'title' | 'description'> = {
  version: '0.1.0',
  nextVersion: '15.0.0',
  reactVersion: '18.2.0',
  zustandVersion: '4.5.0',
  zodVersion: '3.22.0',
  hookformVersion: '7.50.0',
  cvaVersion: '0.7.0',
  clsxVersion: '2.1.0',
  twMergeVersion: '2.2.1',
  typescriptVersion: '5.0.0',
  tailwindVersion: '3.3.0',
  postcssVersion: '8.4.0',
  autoprefixerVersion: '10.4.0',
  testingVersion: '1.0.0',
  nodeTypesVersion: '20.0.0',
};

// Template cache to avoid re-fetching templates
const templateCache = new Map<string, Handlebars.TemplateDelegate>();
const embeddingCache = new Map<string, TemplateEmbedding>();

async function getTemplate(templatePath: string): Promise<Handlebars.TemplateDelegate> {
  if (templateCache.has(templatePath)) {
    return templateCache.get(templatePath)!;
  }

  const response = await fetch(`/templates/${templatePath}`);
  if (!response.ok) {
    throw new Error(`Failed to load template ${templatePath}`);
  }

  const templateContent = await response.text();
  const template = Handlebars.compile(templateContent);
  templateCache.set(templatePath, template);
  return template;
}

export async function processTemplate(
  templatePath: string,
  data: Partial<TemplateData> & Pick<TemplateData, 'name' | 'title' | 'description'>
): Promise<string> {
  try {
    const template = await getTemplate(templatePath);
    return template({
      ...defaultVersions,
      ...data,
    });
  } catch (error) {
    console.error(`Error processing template ${templatePath}:`, error);
    throw new Error(`Failed to process template ${templatePath}`);
  }
}

export async function generateFilesFromTemplates(
  framework: TechStack['framework'],
  data: Partial<TemplateData> & Pick<TemplateData, 'name' | 'title' | 'description'>
): Promise<Array<{ path: string; content: string }>> {
  const files: Array<{ path: string; content: string }> = [];

  switch (framework) {
    case 'next': {
      // Process Next.js templates
      const templates = [
        { src: 'next/app/layout.hbs', dest: 'app/layout.tsx' },
        { src: 'next/app/page.hbs', dest: 'app/page.tsx' },
        { src: 'next/app/globals.hbs', dest: 'app/globals.css' },
        { src: 'next/lib/store.hbs', dest: 'lib/store.ts' },
        { src: 'next/lib/validations/form.hbs', dest: 'lib/validations/form.ts' },
        { src: 'next/package.hbs', dest: 'package.json' },
      ];

      for (const template of templates) {
        const content = await processTemplate(template.src, data);
        files.push({
          path: template.dest,
          content,
        });
      }
      break;
    }
    // Add cases for other frameworks here
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }

  return files;
}

export async function findSimilarTemplates(
  description: string,
  limit = 5
): Promise<Array<{ path: string; similarity: number }>> {
  console.log('Limit:', limit);
  // TODO: Implement vector similarity search using pgvector
  // This is a placeholder that will be replaced with actual vector search
  return [
    { path: 'next/app/layout.hbs', similarity: 0.95 },
    { path: 'next/app/page.hbs', similarity: 0.92 },
    { path: 'next/lib/store.hbs', similarity: 0.85 },
  ];
}

export async function getTemplateEmbedding(templatePath: string): Promise<TemplateEmbedding | null> {
  if (embeddingCache.has(templatePath)) {
    return embeddingCache.get(templatePath)!;
  }

  // TODO: Implement template embedding generation
  // This will be used to store embeddings in pgvector
  return null;
}

export async function validateTemplate(templatePath: string): Promise<boolean> {
  try {
    const template = await getTemplate(templatePath);
    // Test compile with default data
    template({
      ...defaultVersions,
      name: 'test',
      title: 'Test',
      description: 'Test description',
    });
    return true;
  } catch (error) {
    console.error(`Template validation failed for ${templatePath}:`, error);
    return false;
  }
}
