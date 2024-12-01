import { describe, expect, it, vi } from 'vitest';
import { parseMessage, type ParserCallbacks } from './message-parser';

describe('parseMessage', () => {
  it('should parse artifacts and actions correctly', () => {
    const callbacks: ParserCallbacks = {
      onArtifactOpen: vi.fn(),
      onArtifactClose: vi.fn(),
      onActionOpen: vi.fn(),
      onActionClose: vi.fn(),
    };

    const message = `
      Here's a test message with an artifact:
      <artifact type="file" name="test.txt">
      Test content
      </artifact>
      And here's an action:
      <action type="command">
      echo "Hello, world!"
      </action>
    `;

    const result = parseMessage(message, callbacks);

    expect(callbacks.onArtifactOpen).toHaveBeenCalledWith({
      type: 'file',
      content: 'Test content',
    });

    expect(callbacks.onActionOpen).toHaveBeenCalledWith({
      type: 'command',
      content: 'echo "Hello, world!"',
    });

    expect(result).toBe(message);
  });
});
