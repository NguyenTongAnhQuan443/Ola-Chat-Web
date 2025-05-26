/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_VAPID_KEY: string
  [key: string]: any;
  // thêm các biến môi trường khác nếu có
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
