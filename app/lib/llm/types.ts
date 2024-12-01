export type Role = 'system' | 'user' | 'assistant';

export interface Message {
    role: Role;
    content: string;
}

export interface LLMOptions {
    model?: string;
    batchSize?: number;
    temperature?: number;
    maxTokens?: number;
    context?: string;
}

export interface LLMResponse {
    content: string;
    metadata?: Record<string, unknown>;
}

export interface LLMPromptObject {
    messages: Message[];
}

export interface LLMInterface {
    generate(prompt: string | LLMPromptObject, options?: LLMOptions): Promise<LLMResponse>;
    stream(prompt: string | LLMPromptObject, options?: LLMOptions): AsyncGenerator<string>;
}

export interface LLMConfig {
    model: string;
    temperature?: number;
    maxTokens?: number;
    apiKey: string;
}

export type LLMProvider = 'openai' | 'anthropic' | 'local';
