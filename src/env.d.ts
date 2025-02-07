/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRIVY_APP_ID: string
  readonly VITE_AWS_ACCESS_KEY_ID: string
  readonly VITE_AWS_SECRET_ACCESS_KEY: string
  readonly VITE_AWS_REGION: string
  readonly VITE_ENCRYPTION_KEY: string
  readonly VITE_TELEGRAM_BOT_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 