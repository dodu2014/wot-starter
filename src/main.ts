import { createSSRApp } from 'vue'
import App from './App.vue'
import i18n from './locale'
import router from './router'
import 'uno.css'
import '@/style/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(i18n)
  app.config.globalProperties.$t = i18n.global.t
  app.use(router)
  setupStore(app)
  return {
    app,
  }
}
