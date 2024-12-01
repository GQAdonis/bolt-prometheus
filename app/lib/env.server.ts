function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const env = {
  OPENAI_LIKE_API_BASE_URL: getEnvVar('OPENAI_LIKE_API_BASE_URL', 'http://localhost:3000'),
  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY', ''),
  ANTHROPIC_API_KEY: getEnvVar('ANTHROPIC_API_KEY', ''),
  GROQ_API_KEY: getEnvVar('GROQ_API_KEY', ''),
  MISTRAL_API_KEY: getEnvVar('MISTRAL_API_KEY', ''),
  COHERE_API_KEY: getEnvVar('COHERE_API_KEY', ''),
  OPENROUTER_API_KEY: getEnvVar('OPENROUTER_API_KEY', ''),
} as const;
