import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Artifact } from './Artifact';
import { cn } from '~/lib/utils';
import type { Components } from 'react-markdown';

interface MarkdownProps {
  content?: string;
  children?: string;
  className?: string;
  html?: boolean;
  limitedMarkdown?: boolean;
}

export const Markdown = memo(function Markdown({ 
  content,
  children,
  className,
  html = false,
  limitedMarkdown = false 
}: MarkdownProps) {
  const components: Partial<Components> = {
    pre({ className, children, ...props }) {
      if (limitedMarkdown) return null;
      return (
        <pre className={cn('relative', className)} {...props}>
          {children}
        </pre>
      );
    },
    code(props) {
      const { className, children } = props;
      const isInline = !className?.includes('language-');

      if (isInline || limitedMarkdown) {
        return <code className={className}>{children}</code>;
      }

      const textContent = String(children || '').replace(/\n$/, '');
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : undefined;

      if (lang === 'artifact') {
        return <Artifact artifact={{ type: 'file', content: textContent }} />;
      }

      return (
        <code className={cn('block p-4 bg-bolt-elements-background-depth-2 rounded-md', className)}>
          {children}
        </code>
      );
    }
  };

  const markdownContent = content || children;

  if (!markdownContent) {
    return null;
  }

  return (
    <ReactMarkdown
      className={cn('prose dark:prose-invert max-w-none', className)}
      components={components}
      skipHtml={!html}
    >
      {markdownContent}
    </ReactMarkdown>
  );
});
