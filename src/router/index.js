import { createRouter, createWebHashHistory } from "vue-router"
import Home from '../views/Tezmaps.vue'
import ComingSoon from '../views/ComingSoon.vue'
import Balances from '../views/Balances2.vue'
import Mint from '../views/Mint.vue'
import Create from '../views/Create.vue'
import Tokens from '../views/Tokens.vue'
import Users from '../views/Users.vue'

const routes = [
  { path: '/', component: Home, meta: { title: 'Mint' } },
  { path: '/docs', component: ComingSoon, meta: { title: 'Docs' } },
  { path: '/balance', component: Balances, meta: { title: 'Balance', authenticated: true } },
  { path: '/users/:wallet', name: 'user', component: Users, meta: { title: 'User Profile' }, props: true },
  { path: '/trade', component: ComingSoon, meta: { title: 'Marketplace' } },
  { path: '/mint/:protocol/:tick', name: 'mint', component: Mint, meta: { title: 'Mint Token' }, props: true },
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