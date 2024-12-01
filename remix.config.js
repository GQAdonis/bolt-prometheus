/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverPlatform: "node",
  tailwind: true,
  postcss: true,
  watchPaths: ["./tailwind.config.ts"],
  serverDependenciesToBundle: [
    /^marked.*/,
    "nanoid",
    "@ai-sdk/*",
    "ai",
    "ollama-ai-provider",
    "@openrouter/ai-sdk-provider"
  ],
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
  dev: {
    port: 5173,
  }
};
