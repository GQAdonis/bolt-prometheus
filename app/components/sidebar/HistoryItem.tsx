import React from 'react';
import { type ChatHistoryItem } from '~/lib/persistence';

export interface HistoryItemProps {
  item: ChatHistoryItem;
  onDelete: () => void;
  onExport: () => void;
}

export function HistoryItem({ item, onDelete, onExport }: HistoryItemProps) {
  return (
    <div className="flex items-center px-3 py-2 group hover:bg-bolt-elements-background-depth-1">
      <a href={`/chat/${item.urlId}`} className="flex w-full relative truncate block">
        {item.description}
      </a>
      <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100">
        <button
          type="button"
          className="p-1 text-sm rounded hover:bg-bolt-elements-background-depth-2"
          onClick={onExport}
        >
          Export
        </button>
        <button
          type="button"
          className="p-1 text-sm rounded hover:bg-bolt-elements-background-depth-2"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
