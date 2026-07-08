/// <reference types="vite/client" />

// types/weex.d.ts
declare const weex: {
  requireModule: (name: 'animation') => {
    transition: (ref: any, options: any, callback: () => void) => void
  }
}

interface ImportMetaEnv {
  readonly VITE_ENV_NAME: string
  readonly VITE_APP_TITLE: string
  readonly VITE_WEIXIN_PAY_MERCHANT_ID: string
  readonly VITE_ICP: string

  readonly VITE_API_BASE_URL: string
  readonly VITE_UPLOAD_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
