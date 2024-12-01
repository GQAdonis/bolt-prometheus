import { useState, useEffect, type ChangeEvent } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { providers } from '~/utils/constants';

interface ModelSelectorProps {
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  selectedProvider: string;
  className?: string;
}

export function ModelSelector({ 
  onProviderChange, 
  onModelChange,
  selectedProvider,
  className = ''
}: ModelSelectorProps) {
  const [apiKey, setApiKey] = useState('');
  const selectedProviderInfo = providers.find(p => p.id === selectedProvider);

  useEffect(() => {
    // Load API key from cookies when provider changes
    document.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=');
      if (key === 'apiKeys') {
        try {
          const apiKeys = JSON.parse(decodeURIComponent(value));
          if (selectedProvider && apiKeys[selectedProvider]) {
            setApiKey(apiKeys[selectedProvider]);
          }
        } catch (e) {
          console.error('Error parsing API keys:', e);
        }
      }
    });
  }, [selectedProvider]);

  const handleProviderSelect = (value: string) => {
    onProviderChange(value);
    const provider = providers.find(p => p.id === value);
    if (provider && provider.staticModels.length > 0) {
      const defaultModel = provider.staticModels[0].name;
      onModelChange(defaultModel);
    }
  };

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);

    // Save API key to cookies
    try {
      const storedApiKeys = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key === 'apiKeys') {
          try {
            return JSON.parse(decodeURIComponent(value));
          } catch (e) {
            console.error('Error parsing API keys:', e);
            return acc;
          }
        }
        return acc;
      }, {});

      const apiKeys = { ...storedApiKeys, [selectedProvider]: newApiKey };
      document.cookie = `apiKeys=${encodeURIComponent(JSON.stringify(apiKeys))}; path=/`;
    } catch (e) {
      console.error('Error saving API key:', e);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="text-sm font-medium">Model Provider</label>
        <Select value={selectedProvider} onValueChange={handleProviderSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center gap-2">
                  <span>{provider.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProviderInfo && selectedProviderInfo.requiresApiKey && (
        <div>
          <label className="text-sm font-medium">API Key</label>
          <div className="mt-1">
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder={`Enter ${selectedProviderInfo.name} API Key`}
              className="w-full px-3 py-2 border rounded-md"
            />
            {selectedProviderInfo.getApiKeyLink && (
              <a
                href={selectedProviderInfo.getApiKeyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:text-blue-600 mt-1 inline-block"
              >
                {selectedProviderInfo.labelForGetApiKey || 'Get API Key'}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
