// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7
const PREFIX = 'UNI_APP_VUE3'
export const DEFAULT_PREFIX_KEY = `${PREFIX}${packVersion}`

// aes encryption key
export const cacheCipher = {
  key: 'aQ0{gD1@c_0@oH5:',
  iv: 'aF0#gC_$hE1$eA1!',
}

// Whether the system cache is encrypted using aes
export const enableStorageEncryption = !isDev
