import { pgTable, text, integer, jsonb, real, timestamp } from 'drizzle-orm/pg-core';

// Template embeddings table for vector similarity search
export const templateEmbeddings = pgTable('template_embeddings', {
  id: text('id').primaryKey(), // template path as id
  embedding: real('embedding').array(), // vector embedding
  framework: text('framework').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  capabilities: text('capabilities').array(),
  metadata: jsonb('metadata'), // additional metadata
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Template usage statistics for improving recommendations
export const templateUsage = pgTable('template_usage', {
  id: integer('id').primaryKey(),
  templateId: text('template_id').references(() => templateEmbeddings.id),
  prompt: text('prompt').notNull(),
  similarity: real('similarity').notNull(),
  successful: integer('successful').default(0),
  failed: integer('failed').default(0),
  lastUsed: timestamp('last_used').defaultNow(),
});

// Template feedback for improving quality
export const templateFeedback = pgTable('template_feedback', {
  id: integer('id').primaryKey(),
  templateId: text('template_id').references(() => templateEmbeddings.id),
  prompt: text('prompt').notNull(),
  rating: integer('rating').notNull(), // 1-5 rating
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Types for type safety
export type TemplateEmbedding = typeof templateEmbeddings.$inferSelect;
export type TemplateUsage = typeof templateUsage.$inferSelect;
export type TemplateFeedback = typeof templateFeedback.$inferSelect;
