/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPEN_AI_API_KEY: string;
  readonly VITE_VOICEVOX_API_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
