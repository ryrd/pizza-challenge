import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
// import Vue3TouchEvents from "vue3-touch-events";

const pinia = createPinia()

createApp(App).use(pinia).mount('#app')