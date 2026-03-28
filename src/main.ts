import { createApp } from 'vue'
import App from './App.vue'
import i18n from './presentation/i18n'
import router from './presentation/router'
import './assets/main.css'

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
