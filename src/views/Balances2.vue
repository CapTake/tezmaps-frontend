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
        <div v-else-if="items.length === 0" class="text center py-24">
            There is nothing here yet :(
        </div>
        <div v-else class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-8">
            <article v-for="item in items" :key="item.id" class="border border-slate-50 rounded-lg shadow hover:shadow-lg px-3 md:px-5 bg-white relative font-mono tracking-tight">
                <div class="py-2 text-xs text-slate-500 flex justify-between items-center uppercase">
                    {{ item.protocol }}
                    <svg v-if="item.trusted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-slate-300">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div v-if="item.protocol === 'tezmaps'" class="w-full flex justify-center items-end gap-1 mb-6 mt-4">
                    <div>
                        {{ item.content }}
                    </div>
                </div>
                <div v-else-if="item.protocol === 'tzrc-20'" class="w-full flex justify-center items-center gap-1 mb-6 mt-4">
                    <div>
                        {{ item.balance }}
                    </div>
                    <div class="text-sm text-slate-700">
                        {{ item.ticker }}
                    </div>
                </div>
                <div v-else class="w-full flex justify-center items-end gap-1 mb-6 mt-4 flex-wrap">
                    <div v-if="item.content" :title="item.content" class="bg-slate-100 rounded p-1 text-sm">
                        {{ item.content.slice(0,8) }}{{ item.content.length > 8 ? '&hellip;' : '' }}
                    </div>
                    <div>
                        &times;
                    </div>
                    <div>
                        {{ item.balance }} {{ item.ticker }}
                    </div>
                </div>
            </article>
        </div>
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
const TRUSTED = ['tezmaps', 'tzrc-20:tezi']

const mock = {
    "page": 1,
    "perPage": 5,
    "totalItems": 18,
    "totalPages": 4,
    "items": [
        {
            "balance": 1,
            "c": "2306.tezmap",
            "collectionId": "balance_view",
            "collectionName": "balance_view",
            "holder": "tz1SaxU1fWespNC8xLR82H1C1YqRMrRLCyCV",
            "id": "2eqokuboqp",
            "p": "tezmaps",
            "total_supply": "1"
        },
        {
            "balance": 1,
            "c": "2285.tezmap",
            "collectionId": "balance_view",
            "collectionName": "balance_view",
            "holder": "tz1SaxU1fWespNC8xLR82H1C1YqRMrRLCyCV",
            "id": "2eqp96u22p",
            "p": "bezmaps",
            "total_supply": "1"
        },
        {
            "balance": 1,
            "c": "99992175.tezmap",
            "collectionId": "balance_view",
            "collectionName": "balance_view",
            "holder": "tz1SaxU1fWespNC8xLR82H1C1YqRMrRLCyCV",
            "id": "2eqpcg7abl",
            "p": "tezmaps",
            "total_supply": "1"
        },
        {
            "balance": 1,
            "c": "2266.tezmap",
            "collectionId": "balance_view",
            "collectionName": "balance_view",
            "holder": "tz1SaxU1fWespNC8xLR82H1C1YqRMrRLCyCV",
            "id": "2es5tyrpj5",
            "p": "gezmaps",
            "total_supply": "1"
        },
        {
            "balance": 100000000,
            "c": "02",
            "collectionId": "balance_view",
            "collectionName": "balance_view",
            "holder": "tz1SaxU1fWespNC8xLR82H1C1YqRMrRLCyCV",
            "id": "2es7213q4h",
            "p": "tzrc-20:tezius",
            "total_supply": "1000000000000"
        }
    ]
}

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
                b = b.dividedBy(new BigNumber(10).pow(decimals))
                content = ''
            }

            return {
                id,
                protocol,
                trusted: TRUSTED.includes(p),
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
