import type { GeneratedApp, TechStack } from './types';

interface GenerateAppRequest {
  message: string;
  provider: string;
  model: string;
}

interface ApiError {
  message: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data?: GeneratedApp;
  error?: string;
}

export async function generateApplication(request: GenerateAppRequest): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiError;
      throw new Error(errorData.message || 'Failed to generate application');
    }

    const data = await response.json() as GeneratedApp;
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export function parseTechStack(message: string): Partial<TechStack> {
  const techStack: Partial<TechStack> = {};

  // Framework detection
  if (message.toLowerCase().includes('next.js')) {
    techStack.framework = 'next';
    techStack.version = '15';
  } else if (message.toLowerCase().includes('svelte')) {
    techStack.framework = 'svelte';
    techStack.version = '5';
  } else if (message.toLowerCase().includes('remix')) {
    techStack.framework = 'remix';
    techStack.version = 'latest';
  } else if (message.toLowerCase().includes('react')) {
    techStack.framework = 'react';
    techStack.version = '18';
  }

  // UI library detection
  if (message.toLowerCase().includes('shadcn')) {
    techStack.ui = 'shadcn-ui';
  }

  // State management detection
  if (message.toLowerCase().includes('zustand')) {
    techStack.stateManagement = 'zustand';
  }

  // Validation detection
  if (message.toLowerCase().includes('zod')) {
    techStack.validation = 'zod';
  }

  // Styling detection
  if (message.toLowerCase().includes('tailwind')) {
    techStack.styling = 'tailwind';
  } else {
    // Default to Tailwind since Shadcn UI requires it
    techStack.styling = 'tailwind';
  }

  // Testing framework detection
  if (message.toLowerCase().includes('vitest')) {
    techStack.testing = 'vitest';
  } else if (message.toLowerCase().includes('jest')) {
    techStack.testing = 'jest';
  }

  // API layer detection
  if (message.toLowerCase().includes('trpc')) {
    techStack.api = 'trpc';
  } else if (message.toLowerCase().includes('graphql')) {
    techStack.api = 'graphql';
  } else if (message.toLowerCase().includes('rest')) {
    techStack.api = 'rest';
  }

  return techStack;
}
