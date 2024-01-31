<template>
    <div class="w-full min-h-screen reative px-5">
        <h1 class="mt-10 mb-6 tezt text-xl">All tokens</h1>
        <div v-if="loading" class="inset-0 flex justify-center items-center pointer-events-none">
            <div class="flex justify-center items-center max-w-[300px] rounded-lg py-20 px-16 shadow-lg">
                <svg aria-hidden="true" class="w-12 h-12 text-slate-400 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        </div>
        <div v-else-if="items.length === 0" class="flex flex-col items-center h-[50vh] justify-center py-40 w-full text-slate-400">
            <div class="text-center mb-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                </svg>
            </div>
            There is nothing here yet.
        </div>
        <div v-else class="w-full grid grid-cols-1 gap-2 xl:gap-3 mb-8">
            <article v-for="item in items" :key="item.id" class="border border-slate-300 rounded-lg shadow hover:shadow-lg px-3 md:px-5 bg-white dark:bg-darkgrey dark:border-lightgrey relative font-mono tracking-tight">
                Test <button :class="BTN" class="mt-2 float-right">View Token</button>
            </article>
        </div>
        <div v-if="totalPages > 1" class="flex justify-center gap-2 w-full items-center max-w-[300px] mx-auto overflow-clip mt-8">
            <button @click="goToPage(p)" v-for="p in paging" :key="p" class="px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-darkblue rounded" :class="{'bg-slate-200': p === page}, {'dark:bg-darkblue': p === page}">
                {{ p }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, watchEffect, computed } from 'vue'
import api from '../util/api'
import { ticketParams } from '../util/ticket'
import BigNumber from 'bignumber.js'
import { toast } from 'vue3-toastify'
import { validateAddress, char2Bytes, bytes2Char } from '@taquito/utils'
// import { TicketTokenParams } from '@taquito/rpc'

const TRUSTED = ['tezmap', 'tzrc-20:tezi']
const DEPRECATED = ['tezmaps']

const BTN = import.meta.env.VITE_BTN_CLASS
const TICKETER = import.meta.env.VITE_TICKETER
const PROXY = import.meta.env.VITE_PROXY_CONTRACT

const account = inject('walletConnection')
const BALANCE_VIEW = 'balance_view'

const loading = ref(false)

const items = ref([])
const page = ref(1)
const perPage = ref(24)
const totalPages = ref(1)
const filter = computed(() => `holder = "${account.address || ''}"`)
const paging = computed(() => {
    const current = page.value
    const last = totalPages.value
    let res  = current > 1 && current < last ? [current] : []
    const len = 3
    for (let i = 1; i <= len; i++) {
        let p = current - i
        if (p > 1 && p < last && res.length < len) {
            res = [p, ...res]
        }
        p = current + i
        if (p > 1 && p < last && res.length < len) {
            res = [...res, p]
        }
    }
    if (last > 1) {
        res.push(last)
    }
    return [1, ...res]
})

const goToPage = (n) => {
    page.value = n
    lastBlock()
    loadData()
}

const contractAt = inject('contract')
const transferTicket = inject('transferTicket')

const loadData = async () => {
    try {
        loading.value = true
        const { page: p, perPage: pp, totalPages: tp, items: res } = await api.collection(BALANCE_VIEW)
            .getList(page.value, perPage.value, { filter: filter.value, sort: '-updated' })
        page.value = p
        perPage.value = pp
        totalPages.value = tp
        items.value = (res || []).map(({id, p, total_supply, balance, c, holder}) => {
            const [protocol, ticker] = p.split(':')
            let b = new BigNumber(balance)
            let decimals = 0
            let content = c
            if(protocol === 'tzrc-20' || protocol === 'tzrc-20b') {
                decimals = parseInt(c, 16)
                b = b.dividedBy(new BigNumber(10).pow(decimals))
                content = ''
            } else if(protocol === 'tezmap') {
                content = bytes2Char(content)
            }

            return {
                id,
                protocol,
                trusted: TRUSTED.includes(p),
                deprecated: DEPRECATED.includes(p),
                ticker,
                content,
                balance: b.toFormat(),
                total: total_supply,
                decimals,
                holder
            }
        })
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }
}

watchEffect(async () => {
   await loadData(filter.value)
})
</script>
