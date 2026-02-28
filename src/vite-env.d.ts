/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_AUTH_BACKEND?: 'nitro' | 'json-server' | 'msw' | 'vite';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
