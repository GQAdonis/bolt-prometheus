import type { ValidationResult, ValidationIssue, CodeFix } from '~/lib/workflow/types';
import type { LLMInterface } from '~/lib/llm/types';

interface TypeScriptRule {
  id: string;
  description: string;
  validate: (code: string) => ValidationIssue[];
}

export class TypeScriptValidator {
  private readonly _rules: TypeScriptRule[];

  constructor(
    private readonly _llm: LLMInterface,
    private readonly _executeCommand: (command: string) => Promise<{ exitCode: number; output: string }>,
  ) {
    this._rules = [
      {
        id: 'no-any',
        description: 'Prevents usage of the any type',
        validate: (code: string): ValidationIssue[] => {
          const issues: ValidationIssue[] = [];
          const anyPattern = /: any(?![a-zA-Z])|as any(?![a-zA-Z])/g;
          let match;

          while ((match = anyPattern.exec(code)) !== null) {
            issues.push({
              type: 'typescript',
              message: 'Usage of any type is not allowed',
              code: match[0],
              column: match.index,
            });
          }

          return issues;
        },
      },
      {
        id: 'explicit-types',
        description: 'Requires explicit type annotations',
        validate: (code: string): ValidationIssue[] => {
          const issues: ValidationIssue[] = [];
          const implicitPattern = /(?:let|const|var)\s+(\w+)\s*(?:=|:)/g;
          let match;

          while ((match = implicitPattern.exec(code)) !== null) {
            if (!code.slice(match.index, match.index + match[0].length).includes(':')) {
              issues.push({
                type: 'typescript',
                message: 'Missing explicit type annotation',
                code: match[0],
                column: match.index,
              });
            }
          }

          return issues;
        },
      },
    ];
  }

  async validate(filePath: string): Promise<ValidationResult> {
    try {
      // Run tsc to check for TypeScript errors
      const tscResult = await this._executeCommand(`tsc --noEmit ${filePath}`);

      if (tscResult.exitCode !== 0) {
        return {
          valid: false,
          issues: this._parseTscOutput(tscResult.output),
        };
      }

      // Read file content
      const fileContentResult = await this._executeCommand(`cat ${filePath}`);

      if (fileContentResult.exitCode !== 0) {
        throw new Error(`Failed to read file: ${filePath}`);
      }

      const code = fileContentResult.output;
      const issues: ValidationIssue[] = [];

      // Apply custom rules
      for (const rule of this._rules) {
        issues.push(...rule.validate(code));
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    } catch (error) {
      return {
        valid: false,
        issues: [
          {
            type: 'typescript',
            message: error instanceof Error ? error.message : String(error),
          },
        ],
      };
    }
  }

  async fix(issues: ValidationIssue[]): Promise<CodeFix[]> {
    const prompt = `Fix the following TypeScript issues:
${issues.map((issue) => `- ${issue.message} at ${issue.file}:${issue.line}`).join('\n')}

Provide fixes in the following JSON format:
{
  "fixes": [
    {
      "file": "path/to/file",
      "changes": [
        {
          "start": lineNumber,
          "end": lineNumber,
          "replacement": "fixed code here"
        }
      ],
      "description": "Description of the fix"
    }
  ]
}`;

    const response = await this._llm.generate(prompt);

    try {
      const result = JSON.parse(response.content);

      return result.fixes;
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      throw new Error('Failed to generate TypeScript fixes');
    }
  }

  private _parseTscOutput(output: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const errorPattern = /(.+)\((\d+),(\d+)\):\s+error\s+TS\d+:\s+(.+)/g;
    let match;

    while ((match = errorPattern.exec(output)) !== null) {
      const [, file, line, column, message] = match;

      issues.push({
        type: 'typescript',
        message,
        file,
        line: parseInt(line, 10),
        column: parseInt(column, 10),
      });
    }

    return issues;
  }
}
