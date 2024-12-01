import { useCallback, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { StreamingMessageParser, type ActionCallbackData, type ArtifactCallbackData } from '~/lib/runtime/message-parser';
import { workbenchStore } from '~/lib/stores/workbench';

export function useMessageParser(isLoading: boolean) {
  const parser = useRef<StreamingMessageParser>();
  const showWorkbench = useStore(workbenchStore.showWorkbench);

  const callbacks = {
    onArtifactOpen: (data: ArtifactCallbackData) => {
      if (!showWorkbench) {
        workbenchStore.setShowWorkbench(true);
      }
      workbenchStore.addArtifact({
        ...data,
        title: data.type,
        runner: { actions: [] }
      });
    },

    onArtifactClose: (data: ArtifactCallbackData) => {
      workbenchStore.removeArtifact({
        ...data,
        title: data.type,
        runner: { actions: [] }
      });
    },

    onActionOpen: (data: ActionCallbackData) => {
      if (!showWorkbench) {
        workbenchStore.setShowWorkbench(true);
      }
      workbenchStore.addAction({
        ...data,
        actionId: `${data.type}-${Date.now()}`,
        executed: false
      });
    },

    onActionClose: (data: ActionCallbackData) => {
      workbenchStore.removeAction({
        ...data,
        actionId: `${data.type}-${Date.now()}`,
        executed: false
      });
    },

    onActionStream: (data: { content: string }) => {
      workbenchStore.updateLastAction(data.content);
    },
  };

  const parse = useCallback((text: string) => {
    if (!parser.current) {
      parser.current = new StreamingMessageParser(callbacks);
    }

    if (import.meta.env.DEV && !isLoading) {
      console.log('Parsing message:', text);
    }

    parser.current.feed(text);
  }, [isLoading, showWorkbench]);

  const end = useCallback(() => {
    if (parser.current) {
      parser.current.end();
      parser.current = undefined;
    }
  }, []);

  return { parse, end };
}
