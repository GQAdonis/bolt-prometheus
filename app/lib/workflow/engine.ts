import type { WorkflowContext, WorkflowNode, WorkflowResult } from './types';

export class WorkflowEngine {
  private readonly _nodes: Map<string, WorkflowNode>;
  private readonly _startNodes: string[];
  private _visited: Set<string>;

  constructor() {
    this._nodes = new Map();
    this._startNodes = [];
    this._visited = new Set();
  }

  addNode(node: WorkflowNode): void {
    this._nodes.set(node.id, node);

    if (node.type === 'thought') {
      this._startNodes.push(node.id);
    }
  }

  async execute(initialContext: WorkflowContext): Promise<WorkflowResult> {
    try {
      this._visited.clear();

      const context = { ...initialContext, currentStep: 0 };

      for (const startNode of this._startNodes) {
        await this._executeNode(startNode, context);
      }

      return {
        success: true,
        context,
      };
    } catch (error) {
      console.error('Workflow execution failed:', error);

      return {
        success: false,
        context: initialContext,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  private async _executeNode(nodeId: string, context: WorkflowContext): Promise<void> {
    if (this._visited.has(nodeId)) {
      return;
    }

    const node = this._nodes.get(nodeId);

    if (!node) {
      throw new Error(`Node ${nodeId} not found in workflow`);
    }

    this._visited.add(nodeId);
    context.currentStep++;

    await node.execute(context);

    if (node.next) {
      for (const nextNodeId of node.next) {
        await this._executeNode(nextNodeId, context);
      }
    }
  }

  reset(): void {
    this._visited.clear();
    this._nodes.clear();
    this._startNodes.length = 0;
  }

  getNode(id: string): WorkflowNode | undefined {
    return this._nodes.get(id);
  }

  setNodeSequence(nodeIds: string[]): void {
    for (let i = 0; i < nodeIds.length - 1; i++) {
      const currentNode = this._nodes.get(nodeIds[i]);

      if (currentNode) {
        currentNode.next = [nodeIds[i + 1]];
      }
    }
  }

  addParallelNodes(parentId: string, childIds: string[]): void {
    const parentNode = this._nodes.get(parentId);

    if (parentNode) {
      parentNode.next = childIds;
    }
  }

  createDefaultReACTPipeline(): void {
    this.reset();

    // Create standard ReACT nodes
    const thoughtNode: WorkflowNode = {
      id: 'initial-thought',
      type: 'thought',
      execute: async (context) => {
        // Initial planning phase
        console.log('Executing thought phase for:', context.framework);
      },
    };

    const actionNode: WorkflowNode = {
      id: 'framework-action',
      type: 'action',
      execute: async (context) => {
        // Execute framework-specific actions
        console.log('Executing action for:', context.framework);
      },
    };

    const observationNode: WorkflowNode = {
      id: 'result-observation',
      type: 'observation',
      execute: async (context) => {
        // Observe results
        console.log('Observing results for step:', context.currentStep);
      },
    };

    const reflectionNode: WorkflowNode = {
      id: 'code-reflection',
      type: 'reflection',
      execute: async (context) => {
        // Reflect on code quality
        console.log('Reflecting on code for:', context.framework);
      },
    };

    const validationNode: WorkflowNode = {
      id: 'build-validation',
      type: 'validation',
      execute: async (context) => {
        // Validate build
        console.log('Validating build for:', context.framework);
      },
    };

    // Add nodes to workflow
    this.addNode(thoughtNode);
    this.addNode(actionNode);
    this.addNode(observationNode);
    this.addNode(reflectionNode);
    this.addNode(validationNode);

    // Set up the sequence
    this.setNodeSequence([
      'initial-thought',
      'framework-action',
      'result-observation',
      'code-reflection',
      'build-validation',
    ]);
  }
}
