import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'uno.css'
import '@/style/index.scss'

import './service/apis'

export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  app.use(store)
  return {
    app,
  }
}
