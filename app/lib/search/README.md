# Search System Configuration

The search system supports two providers (Serper and Tantivy) with mxbai-rerank-base-v1 reranking via llama-index.

## Environment Variables

Configure search providers using API keys:

```env
# Serper Configuration
SERPER_API_KEY=your_serper_api_key_here

# Tantivy Configuration
TANTIVY_API_KEY=your_tantivy_api_key_here

# Models Configuration
MODELS_PATH=/app/models  # Path where ML models will be stored
```

## Features

### Search Providers
- Serper: Google search results via Serper API
- Tantivy: Local search index with REST API

### Reranking
The system uses mxbai-rerank-base-v1 via llama-index for context-aware reranking of search results. This provides:
- Cross-encoder reranking
- Context-aware result ordering
- Batch processing for efficiency

## Model Management

The reranking model is automatically downloaded during installation to the path specified by `MODELS_PATH`. 

### Docker Configuration
When running in Docker, you should:
1. Mount a volume to the models directory:
   ```bash
   docker run -v /path/to/models:/app/models ...
   ```
2. Set MODELS_PATH in your environment:
   ```env
   MODELS_PATH=/app/models
   ```

This ensures the model files persist between container restarts and can be shared between instances.

## Usage Example

```typescript
import { SearchManager } from '~/lib/search';
import type { LLMInterface } from '~/lib/llm/types';

// Initialize the search manager with an LLM instance
const searchManager = await SearchManager.create(llmInstance);

// Switch providers if needed
searchManager.setActiveProvider('tantivy'); // or 'serper'

// Set search context for better ranking
searchManager.updateContext('TypeScript development');

// Perform a search
const results = await searchManager.search('your query here');
```

## Error Handling

The system will throw an error if:
- No search providers are configured (neither SERPER_API_KEY nor TANTIVY_API_KEY is set)
- Attempting to switch to a provider that isn't configured
- API calls fail due to invalid API keys or network issues
- Model files are not found at the specified MODELS_PATH

## Development

To run locally:
1. Copy `.env.example` to `.env.local`
2. Set your API keys
3. Set MODELS_PATH to your preferred location
4. Install dependencies (this will download the model)
   ```bash
   npm install
   ```

## Default Endpoints

The system uses these default endpoints:
- Tantivy: http://localhost:3030
- Serper: https://google.serper.dev/search
