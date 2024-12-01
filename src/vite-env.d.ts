/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISABLE_PERSISTENCE: string
  readonly VITE_LOG_LEVEL: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly OLLAMA_API_BASE_URL: string
  readonly OPENAI_LIKE_API_BASE_URL: string
  readonly OPENAI_LIKE_API_KEY: string
  readonly LMSTUDIO_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot?: {
    data: {
      shellHighlighter?: unknown
      selectedFile?: string
      documents?: Record<string, unknown>
      modifiedFiles?: Map<string, string>
      files?: Record<string, unknown>
      showTerminal?: boolean
      artifacts?: Record<string, unknown>
      showWorkbench?: boolean
      currentView?: string
      unsavedFiles?: Set<string>
      webcontainerContext?: unknown
      webcontainer?: unknown
    }
  }
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.css?url' {
  const content: string
  export default content
}

declare module '*.scss?url' {
  const content: string
  export default content
}
