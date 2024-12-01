import React from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);

  return (
    <header
      className={`flex items-center justify-between px-4 py-2 border-b border-bolt-elements-border ${
        showWorkbench ? 'bg-bolt-elements-background-depth-1' : ''
      } ${className || ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-bolt-elements-background-depth-2" />
          <div className="text-sm font-medium">Bolt</div>
        </div>
        <ClientOnly>
          {() => (
            <ChatDescription
              chat={{
                id: 'default',
                urlId: 'default',
                title: 'New Chat',
                description: 'New Chat',
                timestamp: new Date().toISOString(),
                createdAt: new Date(),
                messages: []
              }}
            />
          )}
        </ClientOnly>
      </div>
      <ClientOnly>{() => <HeaderActionButtons />}</ClientOnly>
    </header>
  );
}
