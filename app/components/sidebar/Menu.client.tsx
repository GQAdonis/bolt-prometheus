import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { db, deleteById, getAll, chatId, type ChatHistoryItem } from '~/lib/persistence';
import { useChatHistory } from '~/lib/persistence/useChatHistory';
import { binDates } from './date-binning';
import { HistoryItem } from './HistoryItem';

interface DialogContent {
  item: ChatHistoryItem;
  type: 'delete';
}

export function Menu() {
  const [items, setItems] = useState<ChatHistoryItem[]>([]);
  const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);
  const { getUrlId } = useChatHistory({
    db: {
      ...db,
      getUrlId: async (id: string) => id,
      saveArtifact: async () => {}
    }
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    getAll()
      .then((list) => {
        const validItems = list.filter((item) => item.urlId && item.description);
        setItems(validItems);
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const handleDelete = (item: ChatHistoryItem) => {
    deleteById(item.id)
      .then(() => {
        if (chatId.current === item.id) {
          chatId.current = null;
        }
        loadHistory();
        toast.success('Chat deleted');
      })
      .catch((error: Error) => {
        console.error('Failed to delete chat:', error);
        toast.error('Failed to delete chat');
      });
  };

  const handleConfirmDelete = () => {
    if (dialogContent?.type === 'delete' && dialogContent.item) {
      handleDelete(dialogContent.item);
      setDialogContent(null);
    }
  };

  const handleCancelDelete = () => {
    setDialogContent(null);
  };

  const handleDeleteClick = (item: ChatHistoryItem) => {
    setDialogContent({ item, type: 'delete' });
  };

  const handleExportChat = async () => {
    try {
      const urlId = await getUrlId();
      if (urlId) {
        window.open(`/chat/${urlId}`, '_blank');
      }
    } catch (error) {
      console.error('Failed to export chat:', error);
      toast.error('Failed to export chat');
    }
  };

  const bins = binDates(items);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {bins.map(([date, items]) => (
          <div key={date} className="mb-4">
            <div className="px-3 py-2 text-xs font-medium text-bolt-elements-textSecondary">
              {date}
            </div>
            <div className="space-y-1">
              {items.map((item) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  onDelete={() => handleDeleteClick(item)}
                  onExport={handleExportChat}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {dialogContent?.type === 'delete' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-bolt-elements-background rounded-lg">
            <p className="mb-4">
              You are about to delete <strong>{dialogContent.item.description}</strong>.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-md bg-bolt-elements-background-depth-2"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-white rounded-md bg-bolt-elements-danger"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
