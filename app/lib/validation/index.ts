import type { ValidationResult, ValidationIssue, CodeFix } from '~/lib/workflow/types';
import { BuildValidator } from './build';
import { TypeScriptValidator } from './typescript';
import { ValidationReflector } from './reflection';

export type { ValidationResult, ValidationIssue, CodeFix };

export { BuildValidator, TypeScriptValidator, ValidationReflector };

export interface ValidationSystem {
  reflector: ValidationReflector;
  validateProject(): Promise<ValidationResult[]>;
  validateFramework(framework: string, version: string): Promise<ValidationResult>;
  applyFixes(fixes: CodeFix[]): Promise<void>;
}

export class ValidationManager implements ValidationSystem {
  constructor(public reflector: ValidationReflector) {}

  async validateProject(): Promise<ValidationResult[]> {
    return this.reflector.performFullValidation();
  }

  async validateFramework(framework: string, version: string): Promise<ValidationResult> {
    return this.reflector.validateFrameworkRequirements(framework, version);
  }

  async applyFixes(fixes: CodeFix[]): Promise<void> {
    await this.reflector.applyFixes(fixes);
  }

  static async create(
    llm: any,
    executeCommand: (command: string) => Promise<{ exitCode: number; output: string }>,
  ): Promise<ValidationManager> {
    const reflector = new ValidationReflector(llm, executeCommand);

    return new ValidationManager(reflector);
  }
}
