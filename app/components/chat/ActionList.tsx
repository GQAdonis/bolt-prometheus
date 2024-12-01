import { cn } from '~/lib/utils';
import type { ActionState } from '~/lib/stores/workbench';

interface ActionListProps {
  actions: ActionState[];
  className?: string;
}

export function ActionList({ actions, className }: ActionListProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {actions.map((action) => (
        <div
          key={action.actionId}
          className="flex flex-col gap-1 p-2 rounded-md bg-bolt-elements-background-depth-2"
        >
          <div className="text-sm text-bolt-elements-textPrimary">
            {action.type}
          </div>
          <div className="text-sm font-mono whitespace-pre-wrap text-bolt-elements-textSecondary">
            {action.content}
          </div>
        </div>
      ))}
    </div>
  );
}
