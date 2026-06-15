import manifest from '@/manifest.json'

export const { VITE_APP_NAME, VITE_API_BASE_URL, VITE_UPLOAD_URL, VITE_ENV_NAME, VITE_WEIXIN_PAY_MERCHANT_ID, VITE_PLATFORMID, VITE_ICP } = import.meta.env

export const VITE_APPID = manifest['app-plus'].distribute.sdkConfigs.payment.weixin.appid

export const isDev = import.meta.env.MODE === 'development'
export const isPro = import.meta.env.MODE === 'production'
