import type { GeneratedApp } from '~/lib/types';
import { generateFilesFromTemplates } from '~/lib/template-processor';

interface RequestBody {
  message: string;
  provider: string;
  model: string;
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = GeneratedApp | ErrorResponse;

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as RequestBody;
    const { message, provider, model } = body;

    if (!message || !provider || !model) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' } satisfies ErrorResponse),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate files using templates
    const files = await generateFilesFromTemplates('next', {
      name: 'my-next-app',
      title: 'Next.js App',
      description: 'Generated with Bolt',
    });

    const mockResponse: GeneratedApp = {
      techStack: {
        framework: 'next',
        version: '15',
        ui: 'shadcn-ui',
        stateManagement: 'zustand',
        validation: 'zod',
        styling: 'tailwind',
        testing: 'vitest',
      },
      files,
      dependencies: {
        'next': '^15.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'zustand': '^4.5.0',
        'zod': '^3.22.0',
        '@hookform/resolvers': '^3.3.4',
        'react-hook-form': '^7.50.0',
        'class-variance-authority': '^0.7.0',
        'clsx': '^2.1.0',
        'tailwind-merge': '^2.2.1',
      },
      devDependencies: {
        'typescript': '^5.0.0',
        'tailwindcss': '^3.3.0',
        'postcss': '^8.4.0',
        'autoprefixer': '^10.4.0',
        'vitest': '^1.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@types/node': '^20.0.0',
      },
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'test': 'vitest',
      },
      instructions: [
        '1. Install dependencies:',
        '   pnpm install',
        '',
        '2. Start development server:',
        '   pnpm dev',
        '',
        '3. Open http://localhost:3000 in your browser',
        '',
        'Your Next.js 15 application is set up with:',
        '- App Router for modern Next.js features',
        '- Shadcn UI for components',
        '- Zustand for state management',
        '- Zod for form validation',
        '- Tailwind CSS for styling',
        '- Vitest for testing',
        '',
        'Project Structure:',
        '/app - Next.js App Router pages and layouts',
        '/components - Reusable UI components',
        '/lib - Utilities, stores, and validations',
      ].join('\n'),
    };

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(JSON.stringify(mockResponse satisfies ApiResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating application:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate application' } satisfies ErrorResponse),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
