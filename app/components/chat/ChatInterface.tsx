import { Chat } from './Chat.client';
import { BaseChat } from './BaseChat';
import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

interface ChatInterfaceProps {
  projectName?: string;
  initialState?: {
    provider: string;
    model: string;
    apiKey: string;
    prompt: string;
  } | null;
  projectType?: string;
  isNewProject?: boolean;
}

export function ChatInterface({ projectName, initialState, projectType, isNewProject }: ChatInterfaceProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // If we're on the chat route but don't have initial state, redirect back to home
    if (projectName && !initialState) {
      navigate('/');
    }

    // New logic for handling project type and new project
    if (isNewProject && projectType) {
      console.log(`Initializing new ${projectType} project`);
      // Add any additional initialization logic here
    }
  }, [projectName, initialState, navigate, isNewProject, projectType]);

  if (projectName && initialState) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1">
          <BaseChat
            projectName={projectName}
            provider={initialState.provider}
            model={initialState.model}
            apiKey={initialState.apiKey}
            initialPrompt={initialState.prompt}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1">
        <Chat />
      </div>
    </div>
  );
}
