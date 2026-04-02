import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'uno.css'
import '@/style/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  setupStore(app)
  return {
    app,
  }
}
