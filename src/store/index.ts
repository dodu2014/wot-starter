import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化

/** Setup Vue store plugin pinia */
export function setupStore(app: App) {
  const store = createPinia()

  store.use(
    createPersistedState({
      storage: {
        getItem: uni.getStorageSync,
        setItem: uni.setStorageSync,
      },
    }),
  )

  app.use(store)
}
