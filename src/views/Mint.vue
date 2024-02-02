<template>
    <div class="mx-auto w-full max-w-6xl py-12 text-center px-4">
        <h1 class="text-4xl lg:text-5xl font-light mb-8 tracking-wider">{{ props.tick.toUpperCase() }}</h1>
        <p class="md:text-lg mb-12 text-slate-500">Tezos inscriptions tzrc-20 token experiment</p>
        <h2 class="text-2xl mb-10">Total supply: {{ supply }}</h2>
        <h3 v-if="protocol == 'tzrc-20b'" class="text mb-1 text-slate-500">Inscription Cooldown: {{ cd }}</h3>
        <div class="flex justify-center gap-1 items-center px-1 mb-8">
            <progress max="100" :value="percentMinted" class="max-w-full h-8 bg-darkblue text-main rounded-sm w-[500px] transition-all"></progress>
            <span>{{ percentMinted }}%</span>
        </div>
        <div v-if="nbf" class="text-slate-500">Mint Start: {{ nbf }}</div>
        <div v-if="exp" class="text-slate-500">Mint End: {{ exp }}</div>
        <p class="text-sm h-10 text-slate-500">{{ operation }}</p>
        <button v-if="minted < supply" @click="mint" :class="BTN">Inscribe {{ limit }} {{ props.tick.toUpperCase() }}</button><button v-else :class="BTN">Mint concluded</button>
    </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { toast } from 'vue3-toastify'
import { prepareOperation, decodeBytes } from '../util/tzrc-20'
import BigNumber from 'bignumber.js'
import api from '../util/api'

const props = defineProps({protocol:String, tick:String})

console.log(props)

const BTN = import.meta.env.VITE_BTN_CLASS
const KT = import.meta.env.VITE_TICKETER

const minting = ref(false)
const operation = ref('')
const recordId = ref(null)

const supply = ref(1)
const cd = ref(0)
const limit = ref(0)
const decimals = ref(0)
const nbf = ref(0)
const exp = ref(0)
const minted = ref(0)

const account = inject('walletConnection')
const contractAt = inject('contract')
const connect = inject('connectWallet')

const percentMinted = computed(() => (new BigNumber(minted.value).toFixed() / new BigNumber(supply.value).toFixed() * 100).toFixed(2))
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
        const { bytes } = prepareOperation({ op: 'mint', tick: 'test', amt: 42069 })
        console.log(bytes)
        await inscribe('tzrc-20b', bytes)
}

const deployToken = async () => {
    const { bytes } = prepareOperation({ op: 'deploy', tick: 'tezi', max: supply, lim: limit, cd: 10, nbf: 0, dec: 6 }) //exp for ending timestamp
    console.log(bytes)
    await inscribe(PROTOCOL, bytes)
}

const load = async () => {
    try {
        // TZKT Query
        const response = await fetch("https://api.tzkt.io/v1/contracts/KT1UURhEJPhvqp4xgF4C9ZVddJ8Qd34hHXtZ/bigmaps/state/keys?active=true&select=key,value&key=%22"+props.protocol+":"+props.tick+"%22");
        const block = await response.json()

        console.log(block)

        const data = decodeBytes({ bytes: block[0].value})

        console.log(data)

        cd.value = new BigNumber(data[0]).toFixed()
        decimals.value = new BigNumber(data[1]).toFixed()
        limit.value = new BigNumber(data[3]).toFixed()
        minted.value = new BigNumber(data[5]).toFixed()
        supply.value = new BigNumber(data[4]).toFixed()
        nbf.value = data[2] === 0 ? 0 : new Date(data[2]*1000).toISOString().slice(0,16)
        exp.value = data[6] === 0 ? 0 : new Date(data[6]*1000).toISOString().slice(0,16)

        // API Query
        const subscribe = !recordId.value
        const { id, total_supply } = await api.collection('protocol_tickets').getFirstListItem("p='"+props.protocol+":"+props.tick+"'")
        recordId.value = id
         minted.value = new BigNumber(total_supply).dividedBy(new BigNumber(1_000)).toNumber()
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