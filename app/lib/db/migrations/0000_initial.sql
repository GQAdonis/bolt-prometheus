-- Enable pgvector extension (will be used when pglite supports it)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Create template_embeddings table
CREATE TABLE IF NOT EXISTS template_embeddings (
  id TEXT PRIMARY KEY,
  embedding REAL[] NOT NULL,
  framework TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  capabilities TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create template_usage table
CREATE TABLE IF NOT EXISTS template_usage (
  id SERIAL PRIMARY KEY,
  template_id TEXT REFERENCES template_embeddings(id),
  prompt TEXT NOT NULL,
  similarity REAL NOT NULL,
  successful INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create template_feedback table
CREATE TABLE IF NOT EXISTS template_feedback (
  id SERIAL PRIMARY KEY,
  template_id TEXT REFERENCES template_embeddings(id),
  prompt TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_template_embeddings_framework ON template_embeddings(framework);
CREATE INDEX IF NOT EXISTS idx_template_embeddings_type ON template_embeddings(type);
CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_template_feedback_template_id ON template_feedback(template_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_template_embeddings_updated_at
    BEFORE UPDATE ON template_embeddings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
