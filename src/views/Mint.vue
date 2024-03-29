<template>
    <div class="mx-auto w-full max-w-6xl py-12 text-center px-4">
        <span class="lowercase tracking-wider inline-block whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.60em] font-bold leading-none text-neutral-50" :class="props.protocol === 'tzrc-20' ? 'bg-slate-700' :  'bg-lightblue'">{{ props.protocol }}</span> 
        <h1 class="text-4xl lg:text-5xl font-light mb-8 tracking-wider">{{ props.tick.toUpperCase() }}</h1>
        <p v-if="props.tick === 'tezi'" class="md:text-lg mt-6 mb-6 text-slate-500">Tezos inscriptions tzrc-20 token experiment</p>
        <h2 class="text-2xl mb-8">Total supply: {{ supply.toFormat() }}</h2>
        <div v-if="mintStart" class="text-slate-500">Mint Start: {{ mintStart }}</div>
        <div v-if="mintEnd" class="text-slate-500">Mint End: {{ mintEnd }}</div>
        <h3 v-if="protocol == 'tzrc-20b' && cd.gt(0)" class="text mt-4 mb-1 text-slate-500">Cooldown period: {{ cd.toFixed() }} blocks</h3>
        <div class="flex justify-center gap-1 items-center px-1">
            <progress max="100" :value="percentMinted" class="max-w-full h-8 bg-darkblue text-main rounded-sm w-[500px] transition-all"></progress>
            <span>{{ percentMinted }}%</span>
        </div>
        <p class="transition-all text-sm h-10 text-slate-500 mt-4">{{ operation }}</p>
        <button v-if="canMint" @click="() => openMintDialog()" class="btn-primary shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-950/90">Claim {{ limit }} {{ props.tick.toUpperCase() }}</button>
        <button v-else class="btn-primary">{{ mintStatusLabel }}</button>

        <div v-if="holders.length > 0" class="mt-12">
            <h3 class="text-xl mb-6">Top Holders<span class="text-slate-500 text-sm ps-1">({{holders.length}} total)</span></h3>
            <div class="max-w-sm text-slate-500 text-sm flex justify-between gap-4 pb-2 hover:text-slate-600 dark:hover:text-slate-400 mx-auto" v-for="(item, index) in holders.slice(0,50)" :key="item.id">
                <span>
                    #{{ (index + 1) }}
                </span>
                <router-link :to="{ name: 'users', params: { wallet: item.address }}" class="align-middle inline-block">
                    {{ item.address.slice(0,4) }}<span class="hidden md:inline">{{ item.address.slice(4,32) }}</span>
                    <span class="md:hidden">..</span>{{ item.address.slice(-4) }}
                </router-link> 
                <span>
                    {{item.balance}}
                </span>
            </div>
        </div>
        <dialog ref="mintDialog" class="p-5 bg-slate-50 border border-slate-200 shadow-lg rounded-xl dark:bg-slate-900 dark:border-black dark:text-slate-300 max-w-full w-[400px]">
            <h3 class="w-full flex justify-between items-center mb-4 text-xl">
                <span>Confirm Claim</span>
                <button @click="() => mintDialog.close()" class="p-2 rounded-full -m-4 hover:bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <div class="my-6 text-center">
                {{ limit }} {{ props.tick.toUpperCase() }}
            </div>
            <div class="flex justify-between items-center">
                <button @click="() => mintDialog.close()" class="btn-secondary">
                    Cancel
                </button>
                <button @click="mint" class="btn-primary">
                    Claim 
                </button>
            </div>
        </dialog>
    </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { toast } from 'vue3-toastify'
import { prepareOperation, decodeBytes } from '../util/tzrc-20'
import BigNumber from 'bignumber.js'
import { api } from '../util/api'

const CDI = 0
const DECI = 1
const LIMI = 3
const MINTEDI = 5
const MAXI = 4
const NBFI = 6
const EXPI = 2

const props = defineProps({protocol:String, tick:String})

console.log(props)

const KT = import.meta.env.VITE_TICKETER

const minting = ref(false)
const operation = ref('')
const recordId = ref(null)

const supply = ref(new BigNumber(1))
const nbf = ref(0)
const exp = ref(0)
const cd = ref(new BigNumber(0))
const limit = ref(new BigNumber(0))
const decimals = ref(0)
const minted = ref(new BigNumber(0))

const holders = ref([])
const holdersPage = ref(1)
const holdersTotalPages = ref(1)
const holdersPerPage = ref(500)

const account = inject('walletConnection')
const contractAt = inject('contract')
// const connect = inject('connectWallet')

const tokenKey = computed(() => `${props.protocol}${props.tick ? ':':''}${props.tick || ''}`)

const canMint = computed(() => minted.value.lt(supply.value))
const mintStart = computed(() => nbf.value > 0 ? new Date(nbf.value * 1000).toLocaleString() : false)
const mintEnd = computed(() => exp.value > 0 ? new Date(exp.value * 1000).toLocaleString() : false)

const mintDialog = ref(null)

const openMintDialog = async() => {
    mintDialog.value.showModal()
}

const mintStatusLabel = computed(() => {
    const now = Date.now() / 1000
    if (now < nbf.value) {
        return 'Waiting for the start'
    } else if (supply.value.lte(minted.value)) {
        return 'Max supply reached'
    } else if (now > exp.value) {
        return 'Timeout reached'
    }
    return '????'
})

const percentMinted = computed(() => minted.value.dividedBy(supply.value).multipliedBy(100).toFixed(2))
const isConnected = computed(() => !!account.address)

const inscribe = async (protocol, claim) => {
    try {
        if (minting.value) return

        minting.value = true

        if (!isConnected.value) throw new Error('Connect wallet first')

        mintDialog.value.close()

        operation.value = 'Preparing transaction...'

        const contract = await contractAt(KT)

        console.log(contract)

        const op = await contract.methodsObject.claim({ claim, protocol }).send()

        operation.value = 'Waiting for blockchain confirmation...'

        await op.confirmation(1)

        toast.success(`Transaction confirmed`, { autoClose: 3000, theme: 'colored', position: 'top-center' })

    } catch (e) {
        console.log(e)
        const message = e.data?.[1]?.with?.string || e.description || e.message
        toast.error(message, { autoClose: 3000, theme: 'colored', position: 'top-center' })
    } finally {
        minting.value = false
        operation.value = ''
    }
}

const mint = async () => {
    const { bytes } = prepareOperation({ op: 'mint', tick: props.tick, amt: limit.value.toFixed() })
    console.log(bytes)
    await inscribe(props.protocol, bytes)
}

const deployToken = async () => {
    const { bytes } = prepareOperation({ op: 'deploy', tick: 'tezi', max: supply, lim: limit, cd: 10, nbf: 0, dec: 6 }) //exp for ending timestamp
    console.log(bytes)
    await inscribe(PROTOCOL, bytes)
}

const getHolders = async () => {
    const { items, page, perPage, totalItems, totalPages } = await api.collection('balance_view').getList(holdersPage.value, holdersPerPage.value, { filter: `p="${tokenKey.value}"`, sort: '-balance', fields: 'balance,holder,updated' });
    holders.value = items.map(({ balance, holder, updated }) => ({
        balance: new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals.value)).toFormat(),
        address: holder,
        updated: new Date(updated)
    }))
}

const load = async () => {
    try {
        // TZKT Query
        const response = await fetch("https://api.tzkt.io/v1/contracts/KT1UURhEJPhvqp4xgF4C9ZVddJ8Qd34hHXtZ/bigmaps/state/keys?active=true&select=key,value&key=%22"+tokenKey.value+"%22");
        const block = await response.json()

        console.log(block)

        const data = decodeBytes({ bytes: block[0].value})

        console.log(data)

        cd.value = new BigNumber(data[CDI])
        decimals.value = new BigNumber(data[DECI] || 0)
        limit.value = new BigNumber(data[LIMI])
        minted.value = new BigNumber(data[MINTEDI])
        supply.value = new BigNumber(data[MAXI])
        nbf.value = data[NBFI]
        exp.value = data[EXPI]

        // API Query
        const subscribe = !recordId.value
        const { id, total_supply } = await api.collection('protocol_tickets').getFirstListItem("p='"+props.protocol+":"+props.tick+"'")
        recordId.value = id

        minted.value = new BigNumber(total_supply).dividedBy(new BigNumber(10).pow(decimals.value))

        if (subscribe) {
            console.log('subscription')
            await api.collection('protocol_tickets').subscribe(id, (message) => {
                const { record: { total_supply } } = message
                console.log(message, total_supply)
                minted.value = new BigNumber(total_supply).dividedBy(new BigNumber(10).pow(decimals.value))
            }).catch(e => {
                console.log(e)
            })
        }
        await getHolders()
    } catch (e) {
        console.log(e)
    }
}

onMounted(async () => {
    load()
})

onBeforeUnmount(() => {
    api.collection('protocol_tickets').unsubscribe()
})
</script>

<style scoped>
progress[value] {
  --pb-color: #2F59ED; /* the progress color */
  --pb-background: #cbd5e1; /* the background color */

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  margin: 0 10px;
  border-radius: 0.2rem;
  background: var(--pb-background);
}
progress[value]::-webkit-progress-bar {
  border-radius: 0.2rem;
  background: var(--pb-background);
}
progress[value]::-webkit-progress-value {
  border-radius: 0.2rem;
  background: var(--pb-color);
}
progress[value]::-moz-progress-bar {
  border-radius: 0.2rem;
  background: var(--pb-color);
}
</style>