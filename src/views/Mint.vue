<template>
    <div class="mx-auto w-full max-w-6xl py-12 text-center px-4">
        <h1 class="text-5xl mb-8 tracking-wider">{{ TICK }}</h1>
        <p class="md:text-lg mb-12 text-slate-800">Tezos inscriptions tzrc-20 token experiment.</p>
        <h2 class="text-2xl mb-10">Total supply: {{ SUPPLY.toLocaleString() }}</h2>
        <div class="flex justify-center gap-1 items-center px-1 mb-8">
            <progress max="100" :value="percentMinted" class="max-w-full h-8 rounded-sm w-[500px] transition-all"></progress>
            <span>{{ percentMinted }}%</span>
        </div>
        <p class="text-sm h-10 text-slate-600">{{ operation }}</p>
        <button v-if="isConnected" @click="mint" class="transition-all rounded bg-[#2196f3]  text-white px-4 py-2  hover:bg-black">Inscribe {{ LIMIT.toLocaleString() }} <span class="">{{ TICK }}</span></button>
        <button v-else @click="connect" class="transition-all rounded hover:bg-[#2196f3]  text-white px-4 py-2  bg-black">Connet wallet</button>
    </div>
</template>

<script setup>
import { ref, computed, inject, toRaw } from 'vue'
import { char2Bytes } from '@taquito/utils'
import code from '../data/code'
import { toast } from 'vue3-toastify'

const TICK = 'TEZI'
const LIMIT = 2000
const SUPPLY = 21_000_000

const minted = ref(7000000)
const minting = ref(false)
const operation = ref('')

const account = inject('walletConnection')
const connect = inject('connectWallet')
const originate = inject('originate')

const percentMinted = computed(() => (minted.value / SUPPLY * 100).toFixed(2))
const isConnected = computed(() => !!account.address)

const inscribe = async (data, mediaType = '') => {
    try {
        if (minting.value) return

        minting.value = true

        const inscription = char2Bytes(`data:${mediaType},${JSON.stringify(data)}`)

        const { address } = account

        operation.value = 'Signing & Originating inscription...'
        const mintOp = await originate({ code, storage: [inscription, address] })

        console.log(mintOp.opHash)
        operation.value = 'Waiting for blockchain confirmation...'
        await mintOp.contract(1, 60000)
        toast.success(`Successfully minted ${LIMIT} ${TICK}`, { autoClose: 3000, theme: 'colored' })

    } catch (e) {
        console.log(e)
        const message = e.description || e.message
        toast.error(message, { autoClose: 3000, theme: 'colored' })
    } finally {
        minting.value = false
        operation.value = ''
    }
}

const mint = async () => {
    await inscribe({
        p: 'tzrc-20',
        op: 'mint',
        tick: TICK.toLowerCase(),
        amt: LIMIT.toString(),
    })
}

const deployToken = async () => {
    await inscribe({
        p: 'tzrc-20',
        op: 'deloy',
        tick: TICK.toLowerCase(),
        max: SUPPLY.toString(),
        lim: LIMIT.toString(),
    })
}

</script>

<style scoped>
progress[value] {
  --pb-color: #2196f3; /* the progress color */
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