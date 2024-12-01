import React from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { EditorPanel } from './EditorPanel';
import { Preview } from './Preview';
import { cn } from '~/lib/utils';

interface WorkbenchProps {
  className?: string;
}

export function Workbench({ className }: WorkbenchProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const currentView = useStore(workbenchStore.currentView);
  const previews = useStore(workbenchStore.previews);
  const hasPreview = previews.length > 0;
  const selectedFile = useStore(workbenchStore.selectedFile);
  const currentDocument = useStore(workbenchStore.currentDocument);

  if (!showWorkbench) {
    return null;
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between p-2 border-b border-bolt-elements-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 text-sm rounded hover:bg-bolt-elements-background-depth-2"
            onClick={() => workbenchStore.setCurrentView('code')}
          >
            Code
          </button>
          {hasPreview && (
            <button
              type="button"
              className="px-2 py-1 text-sm rounded hover:bg-bolt-elements-background-depth-2"
              onClick={() => workbenchStore.setCurrentView('preview')}
            >
              Preview
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-1">
        {currentView === 'code' && (
          <EditorPanel
            className="flex-1"
            editorDocument={currentDocument && {
              value: currentDocument.content,
              isBinary: false,
              filePath: selectedFile || '',
              scrollPosition: currentDocument.scrollPosition
            }}
          />
        )}
        {currentView === 'preview' && hasPreview && (
          <Preview className="flex-1" />
        )}
      </div>
    </div>
  );
}
