import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { PortDropdown } from './PortDropdown';

interface PreviewProps {
  className?: string;
}

export function Preview({ className }: PreviewProps) {
  const previews = useStore(workbenchStore.previews);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const activePreview = previews[activePreviewIndex];

  if (!activePreview) {
    return null;
  }

  const url = activePreview.url;

  return (
    <div className={className}>
      <div className="flex items-center justify-between p-2 border-b border-bolt-elements-border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-bolt-elements-textSecondary">
            Preview
          </span>
          {previews.length > 1 && (
            <PortDropdown
              previews={previews.map(p => ({
                ...p,
                baseUrl: p.url,
                ready: true
              }))}
              activePreviewIndex={activePreviewIndex}
              onPreviewSelect={setActivePreviewIndex}
            />
          )}
        </div>
      </div>
      <iframe
        src={url}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
