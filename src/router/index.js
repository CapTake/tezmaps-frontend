import { createRouter, createWebHashHistory } from "vue-router"
import Home from '../views/Tezmaps.vue'
import ComingSoon from '../views/ComingSoon.vue'
import Balances from '../views/Balances2.vue'
import Mint from '../views/Mint.vue'
import Create from '../views/Create.vue'

const routes = [
  { path: '/', component: Home, meta: { title: 'Mint' } },
  { path: '/docs', component: ComingSoon, meta: { title: 'Docs' } },
  { path: '/balance', component: Balances, meta: { title: 'Balance', authenticated: true } },
  { path: '/trade', component: ComingSoon, meta: { title: 'Marketplace' } },
  { path: '/mints', component: Mint, meta: { title: 'Token Mints' } },
  { path: '/create', component: Create, meta: { title: 'Create Inscription'}}
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