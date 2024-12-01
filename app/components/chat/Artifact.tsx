import { useEffect, useRef, useState } from 'react';
import type { ArtifactState } from '~/lib/stores/workbench';
import { ActionList } from '~/components/chat/ActionList';
import { cn } from '~/lib/utils';

interface ArtifactProps {
  artifact: ArtifactState;
  className?: string;
}

export function Artifact({ artifact, className }: ArtifactProps) {
  const [showActions, setShowActions] = useState(false);
  const userToggledActions = useRef(false);
  const actions = artifact.runner?.actions || [];

  useEffect(() => {
    if (actions.length && !showActions && !userToggledActions.current) {
      setShowActions(true);
    }
  }, [actions.length, showActions]);

  const handleToggleActions = () => {
    userToggledActions.current = true;
    setShowActions(!showActions);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-full text-bolt-elements-textPrimary font-medium leading-5 text-sm">
            {artifact?.title || artifact.type}
          </div>
        </div>
        {actions.length > 0 && (
          <button
            type="button"
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
            onClick={handleToggleActions}
          >
            {showActions ? 'Hide Actions' : 'Show Actions'}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {showActions && actions.length > 0 && (
          <ActionList actions={actions} />
        )}
      </div>
    </div>
  );
}
