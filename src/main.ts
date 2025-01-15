import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
app.component('font-awesome-icon', FontAwesomeIcon)
