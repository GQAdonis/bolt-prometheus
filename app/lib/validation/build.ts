import type { BuildValidationPhase, ValidationResult } from '~/lib/workflow/types';
import type { LLMInterface } from '~/lib/llm/types';

interface PackageManager {
  name: 'npm' | 'yarn' | 'pnpm' | 'bun';
  detectCommand: string;
  installCommand: string;
  buildCommand: string;
}

const PACKAGE_MANAGERS: PackageManager[] = [
  {
    name: 'pnpm',
    detectCommand: 'pnpm -v',
    installCommand: 'pnpm install',
    buildCommand: 'pnpm run build',
  },
  {
    name: 'yarn',
    detectCommand: 'yarn -v',
    installCommand: 'yarn install',
    buildCommand: 'yarn build',
  },
  {
    name: 'npm',
    detectCommand: 'npm -v',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
  },
  {
    name: 'bun',
    detectCommand: 'bun -v',
    installCommand: 'bun install',
    buildCommand: 'bun run build',
  },
];

export class BuildValidator implements BuildValidationPhase {
  private _currentManager?: PackageManager;

  constructor(
    private readonly _llm: LLMInterface,
    private readonly _executeCommand: (command: string) => Promise<{ exitCode: number; output: string }>,
  ) {}

  async detectPackageManager(): Promise<string> {
    for (const manager of PACKAGE_MANAGERS) {
      try {
        const result = await this._executeCommand(manager.detectCommand);

        if (result.exitCode === 0) {
          this._currentManager = manager;

          return manager.name;
        }
      } catch {
        continue;
      }
    }

    // Default to npm if no other manager is detected
    this._currentManager = PACKAGE_MANAGERS.find((m) => m.name === 'npm');

    return 'npm';
  }

  async validateBuild(): Promise<ValidationResult> {
    if (!this._currentManager) {
      await this.detectPackageManager();
    }

    if (!this._currentManager) {
      throw new Error('No package manager detected');
    }

    try {
      // First run install
      const installResult = await this._executeCommand(this._currentManager.installCommand);

      if (installResult.exitCode !== 0) {
        return {
          valid: false,
          issues: [
            {
              type: 'build',
              message: `Installation failed: ${installResult.output}`,
            },
          ],
        };
      }

      // Then run build
      const buildResult = await this._executeCommand(this._currentManager.buildCommand);

      if (buildResult.exitCode !== 0) {
        return {
          valid: false,
          issues: [
            {
              type: 'build',
              message: `Build failed: ${buildResult.output}`,
            },
          ],
        };
      }

      return {
        valid: true,
        issues: [],
      };
    } catch (error) {
      return {
        valid: false,
        issues: [
          {
            type: 'build',
            message: error instanceof Error ? error.message : String(error),
          },
        ],
      };
    }
  }

  async fixBuildIssues(errors: string[]): Promise<void> {
    const prompt = `Fix the following build errors for a TypeScript project:
${errors.join('\n')}

Provide fixes in the following JSON format:
{
  "fixes": [
    {
      "file": "path/to/file",
      "changes": [
        {
          "start": lineNumber,
          "end": lineNumber,
          "replacement": "new code"
        }
      ]
    }
  ]
}`;

    const response = await this._llm.generate(prompt);

    try {
      const fixes = JSON.parse(response.content);

      for (const fix of fixes.fixes) {
        /*
         * Apply fixes would be implemented here
         * This would involve reading the file, applying the changes,
         * and writing it back using the file system
         */
        console.log(`Applying fix to ${fix.file}`);
      }
    } catch (error) {
      console.error('Failed to parse or apply fixes:', error);
      throw new Error('Failed to apply build fixes');
    }
  }
}
