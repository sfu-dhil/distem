import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { createWebHashHistory, createRouter } from 'vue-router'

import './assets/main.scss'

import Welcome from './components/views/Welcome.vue'
import DesignAndNavigation from './components/views/DesignAndNavigation.vue'
import ProjectHistory from './components/views/ProjectHistory.vue'
import Prototype from './components/views/Prototype.vue'
import Team from './components/views/Team.vue'
import Acknowledgments from './components/views/Acknowledgments.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/design_and_navigation', component: DesignAndNavigation },
  { path: '/project_history', component: ProjectHistory },
  { path: '/prototype', component: Prototype },
  { path: '/team', component: Team },
  { path: '/acknowledgments', component: Acknowledgments },
]
const router = createRouter({
  linkActiveClass: 'active',
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')