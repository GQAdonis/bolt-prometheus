import { atom, computed, map } from 'nanostores';
import type { ActionCallbackData, ArtifactCallbackData } from '~/lib/runtime/message-parser';
import type { Terminal } from '@xterm/xterm';

export type WorkbenchViewType = 'code' | 'preview';

export interface ActionState extends ActionCallbackData {
  actionId: string;
  executed?: boolean;
  action?: {
    [key: string]: unknown;
  };
}

export interface ArtifactState extends ArtifactCallbackData {
  title?: string;
  runner?: {
    actions: ActionState[];
  };
}

export interface WorkbenchStore {
  artifacts: Record<string, ArtifactState>;
  actions: Record<string, ActionState>;
  showWorkbench: boolean;
  currentView: WorkbenchViewType;
  unsavedFiles: Set<string>;
  files: Record<string, unknown>;
  previews: { port: number; url: string }[];
  selectedFile?: string;
  currentDocument?: { content: string; scrollPosition?: number };
  showTerminal: boolean;
}

class WorkbenchStoreImpl {
  artifacts = map<Record<string, ArtifactState>>({});
  actions = map<Record<string, ActionState>>({});
  showWorkbench = atom<boolean>(false);
  currentView = atom<WorkbenchViewType>('code');
  unsavedFiles = atom<Set<string>>(new Set());
  files = map<Record<string, unknown>>({});
  previews = atom<{ port: number; url: string }[]>([]);
  selectedFile = atom<string | undefined>(undefined);
  currentDocument = computed([this.selectedFile, this.files], (selectedFile, files) => {
    if (!selectedFile) return undefined;
    return files[selectedFile] as { content: string; scrollPosition?: number } | undefined;
  });
  showTerminal = atom<boolean>(false);
  private terminal?: Terminal;
  private boltTerminal?: Terminal;

  addArtifact(data: ArtifactState) {
    const id = `${data.type}-${Date.now()}`;
    this.artifacts.setKey(id, data);
  }

  removeArtifact(data: ArtifactState) {
    const id = Object.keys(this.artifacts.get()).find(
      key => this.artifacts.get()[key].content === data.content
    );
    if (id) {
      const artifacts = { ...this.artifacts.get() };
      delete artifacts[id];
      this.artifacts.set(artifacts);
    }
  }

  addAction(data: ActionState) {
    const id = `${data.type}-${Date.now()}`;
    this.actions.setKey(id, { ...data, actionId: id });
  }

  removeAction(data: ActionState) {
    const id = Object.keys(this.actions.get()).find(
      key => this.actions.get()[key].content === data.content
    );
    if (id) {
      const actions = { ...this.actions.get() };
      delete actions[id];
      this.actions.set(actions);
    }
  }

  updateLastAction(content: string) {
    const actionIds = Object.keys(this.actions.get());
    if (actionIds.length > 0) {
      const lastId = actionIds[actionIds.length - 1];
      const lastAction = this.actions.get()[lastId];
      this.actions.setKey(lastId, { ...lastAction, content });
    }
  }

  setShowWorkbench(show: boolean) {
    this.showWorkbench.set(show);
  }

  setCurrentView(view: WorkbenchViewType) {
    this.currentView.set(view);
  }

  addUnsavedFile(path: string) {
    const files = new Set(this.unsavedFiles.get());
    files.add(path);
    this.unsavedFiles.set(files);
  }

  removeUnsavedFile(path: string) {
    const files = new Set(this.unsavedFiles.get());
    files.delete(path);
    this.unsavedFiles.set(files);
  }

  setSelectedFile(path: string | undefined) {
    this.selectedFile.set(path);
  }

  setDocuments(files: Record<string, unknown>) {
    this.files.set(files);
  }

  setCurrentDocumentContent(content: string) {
    const selectedFile = this.selectedFile.get();
    if (selectedFile) {
      const currentDoc = this.files.get()[selectedFile] as { content: string; scrollPosition?: number } | undefined;
      this.files.setKey(selectedFile, { ...currentDoc, content });
    }
  }

  setCurrentDocumentScrollPosition(position: number) {
    const selectedFile = this.selectedFile.get();
    if (selectedFile) {
      const currentDoc = this.files.get()[selectedFile] as { content: string; scrollPosition?: number } | undefined;
      this.files.setKey(selectedFile, { ...currentDoc, scrollPosition: position });
    }
  }

  async saveCurrentDocument() {
    // Implementation would go here
    return Promise.resolve();
  }

  resetCurrentDocument() {
    const selectedFile = this.selectedFile.get();
    if (selectedFile) {
      const files = { ...this.files.get() };
      delete files[selectedFile];
      this.files.set(files);
    }
  }

  async syncFiles() {
    // Implementation would go here
    return Promise.resolve();
  }

  downloadZip() {
    // Implementation would go here
  }

  async pushToGitHub() {
    // Implementation would go here
    return Promise.resolve();
  }

  toggleTerminal(show?: boolean) {
    this.showTerminal.set(show ?? !this.showTerminal.get());
  }

  attachTerminal(terminal: Terminal) {
    this.terminal = terminal;
  }

  attachBoltTerminal(terminal: Terminal) {
    this.boltTerminal = terminal;
  }

  onTerminalResize() {
    // Implementation would go here
    if (this.terminal) {
      // Handle terminal resize
    }
  }

  get firstArtifact() {
    const artifacts = this.artifacts.get();
    const keys = Object.keys(artifacts);
    return keys.length > 0 ? artifacts[keys[0]] : undefined;
  }
}

export const workbenchStore = new WorkbenchStoreImpl();
