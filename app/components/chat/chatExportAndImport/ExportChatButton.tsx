import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { IconButton } from '~/components/ui/IconButton';
import React from 'react';

export const ExportChatButton = ({ exportChat }: { exportChat?: () => void }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton title="Export Chat" onClick={() => exportChat?.()}>
          <div className="i-ph:download-simple text-xl"></div>
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>Export Chat</TooltipContent>
    </Tooltip>
  );
};
