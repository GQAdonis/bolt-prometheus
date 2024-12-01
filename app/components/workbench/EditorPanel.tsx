import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { Terminal } from './terminal/Terminal';
import { cn } from '~/lib/utils';

interface EditorDocument {
  value: string;
  isBinary: boolean;
  filePath: string;
  scrollPosition?: number;
}

interface EditorPanelProps {
  editorDocument?: EditorDocument;
  className?: string;
}

export function EditorPanel({ editorDocument, className }: EditorPanelProps) {
  const showTerminal = useStore(workbenchStore.showTerminal);

  const renderEditor = () => {
    if (!editorDocument) {
      return (
        <div className="flex items-center justify-center h-full text-bolt-elements-textSecondary">
          No file selected
        </div>
      );
    }

    if (editorDocument.isBinary) {
      return (
        <div className="flex items-center justify-center h-full text-bolt-elements-textSecondary">
          Binary file cannot be displayed
        </div>
      );
    }

    return (
      <div className="p-4">
        <pre className="font-mono text-sm whitespace-pre-wrap">
          {editorDocument.value}
        </pre>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex-1 overflow-auto">
        {renderEditor()}
      </div>
      {showTerminal && (
        <div className="h-64 border-t border-bolt-elements-border">
          <Terminal 
            theme="dark"
            onTerminalResize={() => {
              workbenchStore.onTerminalResize();
            }} 
          />
        </div>
      )}
    </div>
  );
}
