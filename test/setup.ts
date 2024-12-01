import { vi, afterEach } from 'vitest';

// Mock fetch for template loading
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock template responses
const mockTemplates = {
  'next/package.hbs': `{
    "name": "{{name}}",
    "version": "{{version}}",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "test": "{{#if testing}}{{testing}}{{/if}}"
    },
    {{#if testing}}
    "devDependencies": {
      "{{testing}}": "^1.0.0"
    }
    {{/if}}
  }`,
  'next/app/layout.hbs': `
    export const metadata = {
      title: "{{title}}",
      description: "{{description}}",
    };
  `,
  'next/app/page.hbs': `
    export default function Home() {
      return <h1>{{title}}</h1>;
    }
  `,
  'next/app/globals.hbs': `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `,
  'next/lib/store.hbs': `
    import { create } from 'zustand';
    export const useStore = create((set) => ({}));
  `,
  'next/lib/validations/form.hbs': `
    import * as z from 'zod';
    export const formSchema = z.object({});
  `,
};

// Setup fetch mock
mockFetch.mockImplementation(async (url: string) => {
  const templatePath = url.replace('/templates/', '');
  const content = mockTemplates[templatePath as keyof typeof mockTemplates];

  if (!content) {
    return new Response(null, { status: 404 });
  }

  return new Response(content, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
});

// Cleanup mocks after each test
afterEach(() => {
  mockFetch.mockClear();
});
