import type { SearchResult } from '~/lib/search/types';
import type { LLMInterface } from '~/lib/llm/types';

export type NodeType = 'thought' | 'action' | 'observation' | 'reflection' | 'validation';

export interface WorkflowContext {
  framework: string;
  frameworkVersion: string;
  projectPath: string;
  requirements: string[];
  searchResults: SearchResult[];
  validationResults: ValidationResult[];
  llm: LLMInterface;
  currentStep: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  execute: (context: WorkflowContext) => Promise<void>;
  next?: string[];
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  fixes?: CodeFix[];
}

export interface ValidationIssue {
  type: 'typescript' | 'build' | 'lint';
  message: string;
  file?: string;
  line?: number;
  column?: number;
  code?: string;
}

export interface CodeFix {
  file: string;
  changes: Array<{
    start: number;
    end: number;
    replacement: string;
  }>;
  description: string;
}

export interface WorkflowResult {
  success: boolean;
  context: WorkflowContext;
  error?: Error;
}

export interface ReflectionPhase {
  validateTypeScript(): Promise<ValidationResult>;
  validateBuild(): Promise<ValidationResult>;
  applyFixes(fixes: CodeFix[]): Promise<void>;
}

export interface BuildValidationPhase {
  detectPackageManager(): Promise<string>;
  validateBuild(): Promise<ValidationResult>;
  fixBuildIssues(errors: string[]): Promise<void>;
}
