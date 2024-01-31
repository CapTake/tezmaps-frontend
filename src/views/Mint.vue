<template>
    <div class="mx-auto w-full max-w-6xl py-12 text-center px-4">
        <h1 class="text-5xl font-light mb-8 tracking-wider">{{ TICK.toUpperCase() }}</h1>
        <p class="md:text-lg mb-12 text-slate-500">Tezos inscriptions tzrc-20 token experiment</p>
        <h2 class="text-2xl mb-10">Total supply: {{ SUPPLY.toLocaleString() }}</h2>
        <div class="flex justify-center gap-1 items-center px-1 mb-8">
            <progress max="100" :value="percentMinted" class="max-w-full h-8 bg-darkblue text-main rounded-sm w-[500px] transition-all"></progress>
            <span>{{ percentMinted }}%</span>
        </div>
        <p class="text-sm h-10 text-slate-500">{{ operation }}</p>
        <button @click="mint" :class="BTN">Airdrop concluded</button>
    </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { toast } from 'vue3-toastify'
import { prepareOperation } from '../util/tzrc-20'
import BigNumber from 'bignumber.js'
import api from '../util/api'

const BTN = import.meta.env.VITE_BTN_CLASS
const KT = import.meta.env.VITE_TICKETER
const PROTOCOL = 'tzrc-20'
const TICK = 'tezi'
const LIMIT = 1000
const SUPPLY = 21_000_000

const minted = ref(7000000)
const minting = ref(false)
const operation = ref('')
const recordId = ref(null)

const account = inject('walletConnection')
const contractAt = inject('contract')
const connect = inject('connectWallet')

const percentMinted = computed(() => (minted.value / SUPPLY * 100).toFixed(2))
const isConnected = computed(() => !!account.address)

const inscribe = async (protocol, claim) => {
    try {
        if (minting.value) return

        minting.value = true

        if (!isConnected.value) throw new Error('Connect wallet first')

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
        const { bytes } = prepareOperation({ op: 'mint', tick: 'tezi', amt: LIMIT })
        console.log(bytes)
    // await inscribe(PROTOCOL, bytes)
}

const deployToken = async () => {
    const { bytes } = prepareOperation({ op: 'deploy', tick: 'tezi', max: SUPPLY, lim: LIMIT, cd: 10, nbf: 0, dec: 6 }) //exp for ending timestamp
    console.log(bytes)
    await inscribe(PROTOCOL, bytes)
}

const load = async () => {
    try {
        const subscribe = !recordId.value
        const { id, total_supply } = await api.collection('protocol_tickets').getFirstListItem('p="tzrc-20:tezi"')
        recordId.value = id
        minted.value = new BigNumber(total_supply).dividedBy(new BigNumber(1_000_000)).toNumber()
        if (subscribe) {
            console.log('subscription')
            await api.collection('protocol_tickets').subscribe(id, (message) => {
                const { record: { total_supply } } = message
                console.log(message, total_supply)
                minted.value = new BigNumber(total_supply).dividedBy(new BigNumber(1_000_000)).toNumber()
            }).catch(e => {
                console.log(e)
            })
        }
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
  --pb-background: lightgrey; /* the background color */

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