import type { ReflectionPhase, ValidationResult, CodeFix } from '~/lib/workflow/types';
import type { LLMInterface } from '~/lib/llm/types';
import { TypeScriptValidator } from './typescript';
import { BuildValidator } from './build';

export class ValidationReflector implements ReflectionPhase {
  private readonly _tsValidator: TypeScriptValidator;
  private readonly _buildValidator: BuildValidator;
  private readonly _maxFixAttempts = 3;
  private readonly _llm: LLMInterface;

  constructor(llm: LLMInterface, executeCommand: (command: string) => Promise<{ exitCode: number; output: string }>) {
    this._llm = llm;
    this._tsValidator = new TypeScriptValidator(llm, executeCommand);
    this._buildValidator = new BuildValidator(llm, executeCommand);
  }

  async validateTypeScript(): Promise<ValidationResult> {
    let result = await this._tsValidator.validate('.');
    let attempts = 0;

    while (!result.valid && attempts < this._maxFixAttempts) {
      const fixes = await this._tsValidator.fix(result.issues);
      await this._applyFixes(fixes);

      result = await this._tsValidator.validate('.');
      attempts++;
    }

    return result;
  }

  async validateBuild(): Promise<ValidationResult> {
    let result = await this._buildValidator.validateBuild();
    let attempts = 0;

    while (!result.valid && attempts < this._maxFixAttempts) {
      const errors = result.issues.map((issue) => issue.message);
      await this._buildValidator.fixBuildIssues(errors);

      result = await this._buildValidator.validateBuild();
      attempts++;
    }

    return result;
  }

  async applyFixes(fixes: CodeFix[]): Promise<void> {
    for (const fix of fixes) {
      for (const change of fix.changes) {
        // Here we would integrate with the file system to apply the changes
        console.log(`Applying fix to ${fix.file}:`, change.replacement);
      }
    }
  }

  private async _applyFixes(fixes: CodeFix[]): Promise<void> {
    await this.applyFixes(fixes);
  }

  async validateFrameworkRequirements(framework: string, version: string): Promise<ValidationResult> {
    const prompt = `Validate the following framework requirements:
Framework: ${framework}
Version: ${version}

Check for:
1. TypeScript configuration
2. Framework-specific patterns
3. Best practices

Provide validation in JSON format:
{
  "valid": boolean,
  "issues": [
    {
      "type": "typescript" | "framework",
      "message": string,
      "file": string,
      "line": number,
      "column": number
    }
  ]
}`;

    try {
      const response = await this._llm.generate(prompt);
      const validation = JSON.parse(response.content);

      return {
        valid: validation.valid,
        issues: validation.issues.map((issue: any) => ({
          type: issue.type,
          message: issue.message,
          file: issue.file,
          line: issue.line,
          column: issue.column,
        })),
      };
    } catch (error) {
      console.error('Framework validation failed:', error);

      return {
        valid: false,
        issues: [
          {
            type: 'typescript',
            message: error instanceof Error ? error.message : 'Failed to validate framework requirements',
          },
        ],
      };
    }
  }

  async performFullValidation(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // TypeScript validation
    const tsResult = await this.validateTypeScript();
    results.push(tsResult);

    if (!tsResult.valid) {
      return results;
    }

    // Build validation
    const buildResult = await this.validateBuild();
    results.push(buildResult);

    return results;
  }
}
