import { createApp } from 'vue'
import './style.scss'
import 'default-passive-events'
import { createPinia } from 'pinia'
import zcUIComponent from 'zc-ui-component'
import 'zc-ui-component/dist/zc-ui-component.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia()).use(router).use(zcUIComponent)
app.mount('#app')