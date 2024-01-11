<template>
    <div class="mx-auto w-full text-center p-0">
        <BlockMap :width="width" :height="height/2" :offset="offset" :limit="5000" :row-width="100" @selected="showPopup">
        </BlockMap>
        <div class="w-full px-5">
            <h2 class="text-center py-6 text-xl font-mono font-semibold">Tezmaps {{ firstBlock }} &ndash; {{ firstBlock + 4999 }}</h2>
            <input v-model.number="firstBlock" type="range" :min="0" :max="5000000" :step="5000" @change="(e) => {offset = +e.target.value}" @input="(e) => console.log(e.target.value, offset)" class="w-full">
        </div>
    </div>
    <div class="fixed w-full h-0 bottom-0 z-50">
        <div class="py-5 px-6 w-full sm:max-w-xs rounded-t-xl absolute bg-white z-50 top-0 border border-slate-100 shadow-2xl transition-all duration-300 ease-out text-center" :class="{ '-translate-y-full': selection.length > 0 }">
            <div class="w-full text-end">
                <button @click="selection = []" class="p-2 rounded-full -m-4 hover:bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <h3 class="mt-5 mb-8 text-xl">{{ selection[0] }}.tezmap</h3>
            <button @click="claimTezmap(selection[0])" class="rounded px-6 py-1.5 mb-6 text-white text-lg" :class="{'hover:bg-blue-600 bg-blue-500': !selection[1], 'bg-slate-300 cursor-not-allowed': selection[1]}">
                {{ selection[1] ? 'Taken' : 'Claim' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { ref, computed, inject } from 'vue'
import { toast } from 'vue3-toastify'
import BlockMap from '../components/BlockMap.vue'

const { width, height } = useWindowSize()

const KT = import.meta.env.VITE_TICKETER

const offset = ref(0)
const firstBlock = ref(0)

const minting = ref(false)
const operation = ref('')

const account = inject('walletConnection')
// const connect = inject('connectWallet')
const contractAt = inject('contract')

const isConnected = computed(() => !!account.address)

const selection = ref([])

const claimTezmap = async (id) => {
    try {
        if (typeof id === 'undefined' || minting.value) return

        minting.value = true

        let bytes = id.toString(16)

        if (bytes.length % 2) bytes = '0' + bytes

        if (!isConnected) throw new Error('Connect wallet first')

        operation.value = 'Preparing transaction...'

        const contract = await contractAt(KT)

        console.log(contract)

        const op = await contract.methodsObject.claim({ claim: bytes, protocol: 'tezmaps' }).send()

        operation.value = 'Waiting for blockchain confirmation...'

        await op.confirmation(1)

        selection.value = []

        toast.success(`Successfully claimed ${id}.tezmap`, { autoClose: 3000, theme: 'colored' })

    } catch (e) {
        console.log(e)
        const message = e.description || e.message
        toast.error(message, { autoClose: 3000, theme: 'colored' })
    } finally {
        minting.value = false
        operation.value = ''
    }
}

const showPopup = (level) => {
    selection.value = level
}

</script>
