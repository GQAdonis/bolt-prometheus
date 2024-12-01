import { useState } from 'react';
import { Link } from '@remix-run/react';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <span className="font-bold text-xl">bolt</span>
        </div>
        
        <button className="w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors mb-4">
          + Start new chat
        </button>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium mb-2">Your Chats</h2>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Today</div>
              <Link 
                to="/"
                className="block px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors"
              >
                Next.js 15 Application with App Router
              </Link>
              {/* Add more chat history items here */}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors">
          <span>☀️</span>
          <span>Toggle theme</span>
        </button>
      </div>
    </div>
  );
}
