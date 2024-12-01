import type { ActionState } from '~/lib/stores/workbench';

interface ActionRunnerCallbacks {
  onStart?: (data: ActionState) => void;
  onData?: (data: string) => void;
  onEnd?: (data: ActionState) => void;
}

interface ActionProcess {
  kill?: () => void;
  terminate?: () => void;
}

export class ActionRunner {
  #callbacks: ActionRunnerCallbacks;
  #activeActions: Map<string, { process: ActionProcess | null; isStreaming: boolean }>;

  constructor(callbacks: ActionRunnerCallbacks = {}) {
    this.#callbacks = callbacks;
    this.#activeActions = new Map();
  }

  async start(data: ActionState) {
    const { actionId } = data;
    if (!actionId) return;

    if (this.#activeActions.has(actionId)) {
      console.warn(`Action ${actionId} is already running`);
      return;
    }

    const isStreaming = data.action?.stream === true;
    this.#activeActions.set(actionId, {
      process: null,
      isStreaming
    });

    if (this.#callbacks.onStart) {
      this.#callbacks.onStart({
        ...data,
        executed: true
      });
    }
  }

  async stop(data: ActionState) {
    const { actionId } = data;
    if (!actionId) return;

    const activeAction = this.#activeActions.get(actionId);
    if (!activeAction) {
      console.warn(`Action ${actionId} is not running`);
      return;
    }

    const { process, isStreaming } = activeAction;
    if (process) {
      if (process.kill) {
        process.kill();
      } else if (process.terminate) {
        process.terminate();
      }
    }

    this.#activeActions.delete(actionId);

    if (this.#callbacks.onEnd) {
      this.#callbacks.onEnd({
        ...data,
        executed: !isStreaming
      });
    }
  }

  isRunning(actionId: string): boolean {
    return this.#activeActions.has(actionId);
  }
}
