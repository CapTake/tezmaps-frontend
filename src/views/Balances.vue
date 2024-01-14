<template>
    <div class="w-full min-h-screen reative px-5">
        <h1 class="mt-10 mb-6 tezt text-xl">Your holdings</h1>
        <div v-if="loading" class="inset-0 flex justify-center items-center pointer-events-none">
            <div class="flex justify-center items-center max-w-[300px] rounded-lg py-20 px-16 shadow-lg">
                <svg aria-hidden="true" class="w-12 h-12 text-slate-400 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        </div>
        <!-- <div v-else-if="items.length === 0">
            Nothing to display
        </div> -->
        <table v-else class="w-full my-6 table-fixed border-collapse">
            <thead class="border-b">
                <tr>
                <th class="text-left font-medium text-sm p-2">Protocol</th>
                <th class="text-left font-medium text-sm p-2">Content</th>
                <th class="text-left font-medium text-sm p-2">Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item.id" class="border-b hover:bg-slate-100">
                    <td class="relative p-2 pt-6">
                        <div v-if="!item.tick" class="absolute top-2 text-xs text-slate-500">{{ item.protocol }}</div>
                        <div>{{ item.tick || item.protocol }} </div>
                    </td>
                    <td class="p-2 pt-6">
                        {{ item.content }}
                    </td>
                    <td class="p-2 pt-6">
                        {{ item.balance }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="totalPages > 1" class="flex justify-center gap-2 w-full items-center max-w-[300px] mx-auto overflow-clip">
            <button @click="goToPage(p)" v-for="p in paging" :key="p" class="px-3 py-1.5 hover:bg-slate-200 rounded" :class="{'bg-slate-200': p === page}">
                {{ p }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, watchEffect, computed } from 'vue'
import api from '../util/api'
import BigNumber from 'bignumber.js'

const account = inject('walletConnection')
const BALANCE_VIEW = 'balance_view'

const loading = ref(false)
const items = ref([])
const page = ref(1)
const perPage = ref(5)
const totalPages = ref(1)
const filter = computed(() => `holder = "${account.address || ''}"`)
const paging = computed(() => {
    const current = page.value
    const last = totalPages.value
    const res = [1]
    for (let p = current - 3; p <= current + 3; p++) {
        if (p > 0 && p < last && !res.includes(p)) res.push(p)
    }

    res.push(last)
    return res
})

const goToPage = (n) => {
    page.value = n

    loadData()
}

const loadData = async () => {
    try {
        loading.value = true
        const { page: p, perPage: pp, totalPages: tp, items: res } = await api.collection(BALANCE_VIEW)
            .getList(page.value, perPage.value, { filter: filter.value })
        page.value = p
        perPage.value = pp
        totalPages.value = tp
        items.value = (res || []).map(({id, p, total_supply, balance, c, holder}) => {
            const [protocol, ticker] = p.split(':')
            let b = new BigNumber(balance)
            let decimals = 0
            let content = c
            if(protocol === 'tzrc-20') {
                decimals = parseInt(c, 16)
                b = b.multipliedBy(new BigNumber(10).pow(dec))
                content = ''
            }

            return {
                id,
                protocol,
                ticker,
                content,
                balance: b.toString(),
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
