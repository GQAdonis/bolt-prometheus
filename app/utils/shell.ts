import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import type { ITerminal } from '~/types/terminal';
import { withResolvers } from './promises';
import { atom } from 'nanostores';

export async function newShellProcess(webcontainer: WebContainer, terminal: ITerminal) {
  const args: string[] = [];

  // we spawn a JSH process with a fallback cols and rows in case the process is not attached yet to a visible terminal
  const process = await webcontainer.spawn('/bin/jsh', ['--osc', ...args], {
    terminal: {
      cols: terminal.cols ?? 80,
      rows: terminal.rows ?? 15,
    },
  });

  const input = process.input.getWriter();
  const output = process.output;

  const jshReady = withResolvers<void>();

  let isInteractive = false;
  output.pipeTo(
    new WritableStream({
      write(data) {
        if (!isInteractive) {
          // Use a more robust method to extract OSC
          const dataStr = data.toString();
          const oscMatch = dataStr.includes('\u001b]654;interactive\u0007');
          
          if (oscMatch) {
            // wait until we see the interactive OSC
            isInteractive = true;
            jshReady.resolve();
          }
        }

        terminal.write(data);
      },
    }),
  );

  terminal.onData((data) => {
    // console.log('terminal onData', { data, isInteractive });

    if (isInteractive) {
      input.write(data);
    }
  });

  await jshReady.promise;

  return process;
}

export type ExecutionResult = { output: string; exitCode: number };

export type ExecutionState = {
  sessionId: string;
  active: boolean;
  executionPrms?: Promise<ExecutionResult>;
};

export class BoltShell {
  #initialized: (() => void) | undefined;
  #readyPromise: Promise<void>;
  #webcontainer: WebContainer | undefined;
  #terminal: ITerminal | undefined;
  #process: WebContainerProcess | undefined;
  executionState = atom<ExecutionState | undefined>();
  #outputStream: ReadableStreamDefaultReader<string> | undefined;
  #shellInputStream: WritableStreamDefaultWriter<string> | undefined;

  constructor() {
    this.#readyPromise = new Promise((resolve) => {
      this.#initialized = resolve;
    });
  }

  ready() {
    return this.#readyPromise;
  }

  async init(webcontainer: WebContainer, terminal: ITerminal) {
    this.#webcontainer = webcontainer;
    this.#terminal = terminal;

    const { process, output } = await this.newBoltShellProcess(webcontainer, terminal);
    this.#process = process;
    this.#outputStream = output.getReader();
    await this.waitTillOscCode('interactive');
    this.#initialized?.();
  }

  get terminal() {
    return this.#terminal;
  }

  get process() {
    return this.#process;
  }

  async executeCommand(sessionId: string, command: string): Promise<ExecutionResult> {
    if (!this.process || !this.terminal) {
      return { output: '', exitCode: 0 };
    }

    const state = this.executionState.get();

    /*
     * interrupt the current execution
     *  this.#shellInputStream?.write('\x03');
     */
    this.terminal.input('\u0003');

    if (state && state.executionPrms) {
      await state.executionPrms;
    }

    //start a new execution
    this.terminal.input(command.trim() + '\n');

    //wait for the execution to finish
    const executionPromise = this.getCurrentExecutionResult();
    this.executionState.set({ sessionId, active: true, executionPrms: executionPromise });

    const resp = await executionPromise;
    this.executionState.set({ sessionId, active: false, executionPrms: undefined });

    return resp;
  }

  async newBoltShellProcess(webcontainer: WebContainer, terminal: ITerminal) {
    const args: string[] = [];

    // we spawn a JSH process with a fallback cols and rows in case the process is not attached yet to a visible terminal
    const process = await webcontainer.spawn('/bin/jsh', ['--osc', ...args], {
      terminal: {
        cols: terminal.cols ?? 80,
        rows: terminal.rows ?? 15,
      },
    });

    const input = process.input.getWriter();
    this.#shellInputStream = input;

    const [internalOutput, terminalOutput] = process.output.tee();

    const jshReady = withResolvers<void>();

    let isInteractive = false;
    terminalOutput.pipeTo(
      new WritableStream({
        write(data) {
          if (!isInteractive) {
            // Use a more robust method to extract OSC
            const dataStr = data.toString();
            const oscMatch = dataStr.includes('\u001b]654;interactive\u0007');
            
            if (oscMatch) {
              // wait until we see the interactive OSC
              isInteractive = true;
              jshReady.resolve();
            }
          }

          terminal.write(data);
        },
      }),
    );

    terminal.onData((data) => {
      // console.log('terminal onData', { data, isInteractive });

      if (isInteractive) {
        input.write(data);
      }
    });

    await jshReady.promise;

    return { process, output: internalOutput };
  }

  async getCurrentExecutionResult(): Promise<ExecutionResult> {
    const { output, exitCode } = await this.waitTillOscCode('exit');
    return { output, exitCode };
  }

  async waitTillOscCode(waitCode: string, timeout = 30000): Promise<ExecutionResult> {
    let fullOutput = '';
    let exitCode: number = 0;

    if (!this.#outputStream) {
      return { output: fullOutput, exitCode: 0 };
    }

    const tappedStream = this.#outputStream;
    const startTime = Date.now();
    let running = true;

    try {
      while (running) {
        if (Date.now() - startTime > timeout) {
          console.warn(`Timeout waiting for OSC code: ${waitCode}`);
          running = false;
          break;
        }

        const { value, done } = await tappedStream.read();

        if (done) {
          running = false;
          break;
        }

        const text = value || '';
        fullOutput += text;

        // Create RegExp from string to avoid control character warnings
        const pattern = String.raw`\u001b]654;([^=\u0007]+)(?:=(-?\d+):(\d+))?\u0007`;
        const oscPattern = new RegExp(pattern, 'g');
        const matches = Array.from(text.matchAll(oscPattern));

        for (const match of matches) {
          const [, osc, , code] = match;
          if (osc === 'exit' && code !== undefined) {
            exitCode = parseInt(code, 10);
          }
          if (osc === waitCode) {
            return { output: fullOutput, exitCode };
          }
        }
      }
    } catch (error) {
      console.error('Error in waitTillOscCode:', error);
    }

    return { output: fullOutput, exitCode };
  }
}

export function newBoltShellProcess() {
  return new BoltShell();
}
