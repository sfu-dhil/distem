import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'

createApp(App).mount('#app')

// bootstrap color mode theme hack
const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
document.documentElement.setAttribute('data-bs-theme', theme)