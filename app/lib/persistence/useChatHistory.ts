import { useCallback, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import type { ArtifactState } from '~/lib/stores/workbench';

interface ChatHistoryDB {
  getUrlId: (id: string) => Promise<string>;
  saveArtifact: (artifact: ArtifactState) => Promise<void>;
}

interface ChatHistoryProps {
  db: ChatHistoryDB;
}

export function useChatHistory({ db }: ChatHistoryProps) {
  const artifacts = useStore(workbenchStore.artifacts);
  const firstArtifact = Object.values(artifacts)[0];

  useEffect(() => {
    const saveFirstArtifact = async () => {
      if (!firstArtifact) return;

      try {
        await db.saveArtifact(firstArtifact);
      } catch (error) {
        console.error('Failed to save artifact:', error);
      }
    };

    saveFirstArtifact();
  }, [db, firstArtifact]);

  const getUrlId = useCallback(async () => {
    if (!firstArtifact) return null;

    try {
      const artifactId = `${firstArtifact.type}-${Date.now()}`;
      return await db.getUrlId(artifactId);
    } catch (error) {
      console.error('Failed to get URL ID:', error);
      return null;
    }
  }, [db, firstArtifact]);

  return {
    getUrlId,
  };
}
