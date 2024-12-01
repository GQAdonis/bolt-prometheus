import { useState } from 'react';
import { cn } from '~/lib/utils';

export interface PreviewInfo {
  port: number;
  url: string;
  baseUrl: string;
  ready?: boolean;
}

interface PortDropdownProps {
  previews: PreviewInfo[];
  activePreviewIndex: number;
  onPreviewSelect: (index: number) => void;
  className?: string;
}

export function PortDropdown({ 
  previews, 
  activePreviewIndex,
  onPreviewSelect,
  className 
}: PortDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePreviewSelect = (index: number) => {
    onPreviewSelect(index);
    setIsDropdownOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-bolt-elements-background-depth-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Port {previews[activePreviewIndex]?.port}
        <span className="text-bolt-elements-textSecondary">▼</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-md shadow-lg bg-bolt-elements-background-depth-1 border border-bolt-elements-border">
          {previews.map((preview, index) => (
            <button
              key={preview.port}
              type="button"
              className={cn(
                'w-full px-4 py-2 text-left text-sm hover:bg-bolt-elements-background-depth-2',
                index === activePreviewIndex && 'bg-bolt-elements-background-depth-2'
              )}
              onClick={() => handlePreviewSelect(index)}
            >
              Port {preview.port}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
