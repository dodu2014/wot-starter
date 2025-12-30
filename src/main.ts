import type { Router } from '@wot-ui/router'
import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'uno.css'
import '@/style/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(router as Router)
  setupStore(app)
  return {
    app,
  }
}
