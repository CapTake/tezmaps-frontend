<template>
    <div class="mx-auto w-full max-w-2xl py-12 text-center px-4">
        <h1 class="text-4xl lg:text-5xl font-light mb-8 tracking-wider ">Inscribe</h1>

        <div class="flex flex-wrap">
            <div class="w-full">
            <ul class="flex mb-0 list-none flex-wrap pt-3 pb-3 flex-row">
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center mb-3">
                <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal cursor-pointer" @click="toggleTabs(1)" v-bind:class="{'text-lightgrey bg-slate-300 hover:bg-gradient-to-r hover:from-lightblue hover:to-darkblue hover:text-white': openTab !== 1, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 1}">
                    TZRC-20
                </a>
                </li>
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center mb-3">
                <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal cursor-pointer" disabled @click="toggleTabs(2)" v-bind:class="{'text-lightgrey bg-slate-300 hover:bg-gradient-to-r hover:from-lightblue hover:to-darkblue hover:text-white': openTab !== 2, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 2}">
                    File
                </a>
                </li>
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center mb-3">
                <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal cursor-pointer" disabled @click="toggleTabs(3)" v-bind:class="{'text-lightgrey bg-slate-300 hover:bg-gradient-to-r hover:from-lightblue hover:to-darkblue hover:text-white': openTab !== 3, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 3}">
                    Text
                </a>
                </li>
            </ul>
            <div class="relative flex flex-col min-w-0 break-words bg-white dark:bg-darkgrey dark:border-lightgrey w-full mb-6 shadow-lg rounded-lg">
                <div class="px-4 py-5 flex-auto">
                <div class="tab-content tab-space">
                    <div v-bind:class="{'hidden': openTab !== 1, 'block': openTab === 1}">
                        <p class="md:text-md text-slate-500 dark:text-slate-300 mb-6">Deploy your own tzrc-20 token</p>
                        <form @submit.prevent="onSubmit">
                            <div class="flex justify-center">
                                <div class="grid grid-cols-1 gap-5 text-left text-black flex justify-center ">
                                <label class="block">
                                <span class="text-slate-500">Protocol*</span>
                                <select v-model="protocol" class="lowercase mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="tzrc-20">TZRC-20</option>
                                    <option value="tzrc-20b">TZRC-20B</option>
                                </select>
                                <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">tzrc-20b offers more configuration like a fair Claim-Cooldown</p>
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Ticker*</span>
                                    <input v-model="ticker"
                                    type="text"
                                    class="lowercase mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="i.e. tezi [4-6 chars]"
                                    minlength="4" maxlength="6"
                                    required
                                    />
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Supply*</span>
                                    <input v-model="supply"
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="i.e. 21,000,000"
                                    minlength="1"
                                    required
                                    />
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Claim Amount*</span>
                                    <input v-model="maxClaim"
                                    type="number"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="i.e. 1000"
                                    min="1" :max="supply"
                                    required
                                    />
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Decimals*</span>
                                    <input v-model="decimals"
                                    type="number" 
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="i.e. 6 [0-18]"
                                    min="0" max="18"
                                    required
                                    />
                                </label>
                                <label v-show="protocol == 'tzrc-20b'" class="block">
                                    <span class="text-slate-500">Claim Cooldown*</span>
                                    <input v-model="cooldown"
                                    type="number" 
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="1 or more Blocks"
                                    min="1" step="1"
                                    />
                                </label>
                                <label class="block" v-show="protocol == 'tzrc-20b'">
                                    <span class="text-slate-500">Start Date</span>
                                    <input v-model="startDate"
                                    type="datetime-local"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </label>
                                <label class="block" v-show="protocol == 'tzrc-20b'">
                                    <span class="text-slate-500">End Date</span>
                                    <input v-model="endDate"
                                    type="datetime-local"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </label>
                                </div>
                            </div>
                            <p class="text-sm h-10 text-slate-500">{{ operation }}</p>
                            <button type="submit" :class="BTN">Inscribe Token</button>
                        </form>
                    </div>
                    <div v-bind:class="{'hidden': openTab !== 2, 'block': openTab === 2}">
                    <p>
                        Coming Soon
                    </p>
                    </div>
                    <div v-bind:class="{'hidden': openTab !== 3, 'block': openTab === 3}">
                    <p>
                        Coming Soon
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { prepareOperation } from '../util/tzrc-20'
import { BTN } from '../util/constants.js'
import BigNumber from 'bignumber.js'

const openTab = ref(1)

const toggleTabs = (tabNumber) => {
    openTab.value = tabNumber
}

const KT = import.meta.env.VITE_TICKETER
const minting = ref(false)
const operation = ref('')
const account = inject('walletConnection')
const contractAt = inject('contract')
const isConnected = computed(() => !!account.address)

/*Inscribe TZRC-20 */
const protocol = ref('tzrc-20')
const ticker = ref('')
const supply = ref('')
const maxClaim = ref('')
const cooldown = ref('')
const decimals = ref('')
const startDate = ref('')
const endDate = ref('')

const onSubmit = async () => {
    const { bytes } = prepareOperation({ 
        op: 'deploy', 
        tick: ticker.value, 
        max: new BigNumber(supply.value).toFixed(),
        lim: new BigNumber(maxClaim.value).toFixed(),
        cd: protocol.value === 'tzrc-20' ? 0 : new BigNumber(cooldown.value).toFixed(), 
        nbf: startDate.value === '' ? 0 : ((new Date(startDate.value)).getTime()/1000).toFixed(), 
        exp: endDate.value === '' ? 0 : ((new Date(endDate.value)).getTime()/1000).toFixed(),
        dec: new BigNumber(decimals.value).toFixed()
    }) 
    console.log(((new Date(startDate.value)).getTime()/1000).toFixed(), ((new Date(endDate.value)).getTime()/1000).toFixed())
    await inscribe(protocol.value, bytes,)
}

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

</script>