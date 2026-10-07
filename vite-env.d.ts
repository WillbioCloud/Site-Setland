/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional same-origin server endpoint. Never put an AI API key in a VITE_ variable. */
  readonly VITE_ASSISTANT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
