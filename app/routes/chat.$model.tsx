import type { MetaFunction } from '@remix-run/react';
import { useLocation, useParams } from 'react-router-dom';
import { ChatInterface } from '~/components/chat/ChatInterface';
import { useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt - Chat' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export default function ChatRoute() {
  const { model } = useParams();
  const location = useLocation();
  const state = location.state as {
    projectType: string;
    isNewProject: boolean;
  } | null;

  useEffect(() => {
    if (state?.isNewProject) {
      // Initialize project context with the selected type
      // This will be handled by the ChatInterface component
      console.log('Initializing new project:', state.projectType);
    }
  }, [state]);

  if (!model || !state) {
    return <div>Invalid project configuration</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ChatInterface 
        projectType={state.projectType}
        isNewProject={state.isNewProject}
      />
    </div>
  );
}
