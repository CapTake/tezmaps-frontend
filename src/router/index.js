import { createRouter, createWebHashHistory } from "vue-router"
import Home from '../views/Tezmaps.vue'
import ComingSoon from '../views/ComingSoon.vue'
import Balances from '../views/Balances2.vue'
import Mint from '../views/Mint.vue'
import Create from '../views/Create.vue'
import Tokens from '../views/Tokens.vue'
import Inscriptions from '../views/Inscriptions.vue'

const routes = [
  { path: '/', component: Home, meta: { title: 'Mint' } },
  { path: '/docs', component: ComingSoon, meta: { title: 'Docs' } },
  { path: '/users/:wallet', name: 'users', component: Balances, meta: { title: 'User Holdings' }, props: true },
  { path: '/trade', component: ComingSoon, meta: { title: 'Marketplace' } },
  { path: '/mint/:protocol/:tick', name: 'mint', component: Mint, meta: { title: 'Mint Token' }, props: true },
  { path: '/inscriptions/:protocol/:tick', name: 'inscriptions', component: Inscriptions, meta: { title: 'Inscription Details' }, props: true },
  { path: '/create', component: Create, meta: { title: 'Create Inscription'}},
  { path: '/tokens', component: Tokens, meta: { title: 'Inscriptions'}}
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