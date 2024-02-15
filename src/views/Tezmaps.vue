<template>
    <div class="mx-auto w-full text-center p-0 pt-3 pb-3">
        <BlockMap :width="width" :height="height/2" :offset="offset" :limit="5000" :row-width="100" @selected="showPopup" class="mx-4">
        </BlockMap>
        <div class="w-full px-5">
            <h2 class="text-center pt-6 text-xl font-semibold">Tezmaps {{ firstBlock }} &ndash; {{ firstBlock + 4999 }} </h2>
            <div class="text-xs text-slate-500 pt-3 pb-0.25">Go to</div>
            <input type="number" class="text-black w-[125px] text-lg rounded-xl bg-slate-300 " style="opacity:1!Important;" :step="5000" :min="0" :max="lastBlock" v-model.number="firstBlock" @change="(e) => {offset = +e.target.value}" @input="(e) => console.log(e.target.value, offset)">
            <div class="text-xs text-slate-500 pt-0.5 pb-3">Choose only 5,000 Steps</div>
            <input v-model.number="firstBlock" type="range" :min="0" :max="lastBlock" :step="5000" @change="(e) => {offset = +e.target.value}" @input="(e) => console.log(e.target.value, offset)" class="w-full accent-slate-400"> 
            <h3 class="pt-6 dark:text-slate-300">Tezmaps is the first Tezoscription. Each Tezos Block is represented by a uniquely claimable Tezmap.</h3>
            <h3 class="pt-6 dark:text-slate-500">Track your claims <router-link to="/balance" class="transition-all underline hover:text-blue-500">here</router-link> until Tezoscriptions get wallet support.</h3>
        </div>
    </div>
    <div class="fixed w-full h-0 bottom-0 z-50">
        <div class="py-5 px-6 w-full sm:max-w-xs rounded-t-xl absolute bg-white dark:bg-black dark:border-lightgrey dark:border-b-0 z-50 top-0 border border-slate-100 shadow-2xl transition-all duration-300 ease-out text-center" :class="{ '-translate-y-full': selection.length > 0 }">
            <div class="w-full text-end">
                <button @click="selection = []" class="p-2 rounded-full -m-4 hover:bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <h3 class="mt-5 mb-8 text-xl">{{ selection[0] }}.tezmap</h3>
            <button @click="() => openMintDialog()" class="rounded mx-auto flex gap-1 justify-center items-center px-6 py-1.5 mb-6 bg-main bg-gradient-to-r from-lightblue to-darkblue text-light font-light text-lg" :class="{'hover:bg-blue-600 bg-blue-500': !minting, 'bg-slate-300 cursor-not-allowed': minting }">
                <svg v-if="minting" aria-hidden="true" class="w-5 h-5 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                {{ selection[1] ? 'Taken' : 'Claim' }}
            </button>
            <dialog ref="mintDialog" class="p-5 bg-slate-50 border border-slate-200 shadow-lg rounded-xl dark:bg-slate-900 dark:border-black dark:text-slate-300 max-w-full w-[400px]">
            <h3 class="w-full flex justify-between items-center mb-4 text-xl">
                <span>Confirm Claim</span>
                <button @click="() => mintDialog.close()" class="p-2 rounded-full -m-4 hover:bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <div v-if="selection" class="my-6 text-center">
                {{ selection[0] }}.tezmap
            </div>
            <div class="flex justify-between items-center">
                <button @click="() => mintDialog.close()" class="btn-secondary">
                    Cancel
                </button>
                <button @click="claimTezmap(selection)" class="btn-primary">
                    Claim 
                </button>
            </div>
        </dialog>
        </div>
    </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { ref, computed, inject, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import BlockMap from '../components/BlockMap.vue'

const { width, height } = useWindowSize()

const KT = import.meta.env.VITE_TICKETER

const offset = ref(0)
const firstBlock = ref(0)
const lastBlock = ref(5000000)

const minting = ref(false)
const operation = ref('')

const account = inject('walletConnection')
// const connect = inject('connectWallet')
const contractAt = inject('contract')

const isConnected = computed(() => !!account.address)

const selection = ref([])

const readLastBlock = async () => {
    const response = await fetch("https://api.tzkt.io/v1/blocks/count");
    const block = await response.json()
    lastBlock.value = Number(block || 5000000)
}

const claimTezmap = async ([id, claimed]) => {
    try {
        if (typeof id === 'undefined' || claimed > 0 || minting.value) return

        minting.value = true

        let bytes = id.toString(16)

        if (bytes.length % 2) bytes = '0' + bytes

        mintDialog.value.close()

        if (!isConnected.value) throw new Error('Connect wallet first')

        operation.value = 'Preparing transaction...'

        const contract = await contractAt(KT)

        console.log(contract)

        const op = await contract.methodsObject.claim({ claim: bytes, protocol: 'tezmap' }).send()

        operation.value = 'Waiting for blockchain confirmation...'

        await op.confirmation(1)

        selection.value = []

        toast.success(`Successfully claimed ${id}.tezmap`, { autoClose: 3000, theme: 'colored', position: 'top-center' })

    } catch (e) {
        console.log(e)
        const message = e.description || e.message
        toast.error(message, { autoClose: 3000, theme: 'colored', position: 'top-center' })
    } finally {
        minting.value = false
        operation.value = ''
    }
}

const showPopup = (level) => {
    selection.value = level
}

const mintDialog = ref(null)

const openMintDialog = async() => {
    mintDialog.value.showModal()
}

onMounted(() => {
    readLastBlock()
})
</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {  

   opacity: 1;

}
</style>