import { createRouter, createWebHashHistory } from "vue-router"
import Home from '../views/Tezmaps.vue'
import About from '../views/About.vue'
import ComingSoon from '../views/ComingSoon.vue'

const routes = [
  { path: '/', component: Home, meta: { title: 'Mint' } },
  { path: '/docs', component: About, meta: { title: 'Docs' } },
  { path: '/explore', component: ComingSoon, meta: { title: 'Explore' } },
  { path: '/trade', component: ComingSoon, meta: { title: 'Marketplace' } },
  { path: '/create', component: ComingSoon, meta: { title: 'Create inscription'}}
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
    if (to.meta?.title) {
        console.log(to.meta.title)
        document.title = to.meta.title
    }
})
export default router