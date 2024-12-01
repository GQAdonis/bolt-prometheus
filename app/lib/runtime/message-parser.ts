export interface ArtifactCallbackData {
  type: string;
  content: string;
}

export interface ActionCallbackData {
  type: string;
  content: string;
}

export type ArtifactCallback = (data: ArtifactCallbackData) => void;
export type ActionCallback = (data: ActionCallbackData) => void;

export interface ParserCallbacks {
  onArtifactOpen: ArtifactCallback;
  onArtifactClose: ArtifactCallback;
  onActionOpen: ActionCallback;
  onActionClose: ActionCallback;
  onActionStream?: (data: { content: string }) => void;
}

export function parseMessage(message: string, callbacks: ParserCallbacks): string {
  const artifactRegex = /<artifact type="([^"]+)"[^>]*>([\s\S]*?)<\/artifact>/g;
  const actionRegex = /<action type="([^"]+)"[^>]*>([\s\S]*?)<\/action>/g;

  let match;

  // Process artifacts
  while ((match = artifactRegex.exec(message)) !== null) {
    const [, type, content] = match;
    callbacks.onArtifactOpen({ type, content: content.trim() });
  }

  // Process actions
  while ((match = actionRegex.exec(message)) !== null) {
    const [, type, content] = match;
    callbacks.onActionOpen({ type, content: content.trim() });
  }

  return message;
}

export class StreamingMessageParser {
  private buffer = '';
  private readonly callbacks: ParserCallbacks;

  constructor(callbacks: ParserCallbacks) {
    this.callbacks = callbacks;
  }

  feed(chunk: string): void {
    this.buffer += chunk;
    this.processBuffer();
  }

  private processBuffer(): void {
    const artifactRegex = /<artifact type="([^"]+)"[^>]*>([\s\S]*?)<\/artifact>/g;
    const actionRegex = /<action type="([^"]+)"[^>]*>([\s\S]*?)<\/action>/g;

    let match;

    // Process artifacts
    while ((match = artifactRegex.exec(this.buffer)) !== null) {
      const [, type, content] = match;
      this.callbacks.onArtifactOpen({ type, content: content.trim() });
    }

    // Process actions
    while ((match = actionRegex.exec(this.buffer)) !== null) {
      const [, type, content] = match;
      this.callbacks.onActionOpen({ type, content: content.trim() });
    }

    // Process streaming content
    if (this.callbacks.onActionStream) {
      const streamContent = this.buffer.replace(artifactRegex, '').replace(actionRegex, '');
      if (streamContent.trim()) {
        this.callbacks.onActionStream({ content: streamContent.trim() });
      }
    }
  }

  end(): void {
    this.processBuffer();
    this.buffer = '';
  }
}
