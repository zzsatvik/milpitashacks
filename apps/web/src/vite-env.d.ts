/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_INSFORGE_BASE_URL?: string;
  readonly VITE_INSFORGE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
