<template>
    <div class="mx-auto w-full max-w-2xl py-12 text-center px-4">
        <h1 class="text-4xl lg:text-5xl font-light mb-8 tracking-wider ">Inscribe</h1>

        <div class="flex flex-wrap">
            <div class="w-full">
            <ul class="flex mb-0 list-none flex-wrap pt-3 pb-3 flex-row">
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center mb-3">
                <a class="lowercase text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal cursor-pointer" @click="toggleTabs(1)" v-bind:class="{'text-lightgrey bg-slate-300 hover:bg-gradient-to-r hover:from-lightblue hover:to-darkblue hover:text-white': openTab !== 1, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 1}">
                    TZRC-20
                </a>
                </li>
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center mb-3">
                <a class="lowercase text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal cursor-pointer" disabled @click="toggleTabs(2)" v-bind:class="{'text-lightgrey bg-slate-300 hover:bg-gradient-to-r hover:from-lightblue hover:to-darkblue hover:text-white': openTab !== 2, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 2}">
                    File
                </a>
                </li>
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center mb-3">
                <a class="lowercase text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal cursor-pointer" disabled @click="toggleTabs(3)" v-bind:class="{'text-lightgrey bg-slate-300 hover:bg-gradient-to-r hover:from-lightblue hover:to-darkblue hover:text-white': openTab !== 3, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 3}">
                    Text
                </a>
                </li>
            </ul>
            <div class="relative flex flex-col min-w-0 break-words bg-white dark:bg-darkgrey dark:border-lightgrey w-full mb-6 shadow-lg rounded-lg">
                <div class="px-4 py-5 flex-auto">
                <div class="tab-content tab-space">
                    <div v-bind:class="{'hidden': openTab !== 1, 'block': openTab === 1}">
                        <p class="md:text-md text-slate-500 dark:text-slate-300 mb-6">Deploy your own tzrc-20 token</p>           
                        <p class="md:text-sm text-slate-500 dark:text-slate-600 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                            Deploying will trigger one token claim to your wallet. The rest is claimable by the public. To disable public claims, set the <u>Claim Amount</u> to the <u>Max Supply</u> to claim all tokens at deploying.
                        </p>

                        <form @submit.prevent="onSubmit">
                            <div class="flex justify-center">
                                <div class="grid grid-cols-1 gap-5 text-left text-black flex justify-center ">
                                <label class="block">
                                <span class="text-slate-500">Protocol*</span>
                                <select v-model="protocol" class="lowercase mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="tzrc-20">TZRC-20</option>
                                    <option value="tzrc-20b">TZRC-20B (recommended)</option>
                                </select>
                                <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">tzrc-20b offers a fair distribution with claim cooldown</p>
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Ticker*</span>
                                    <input v-model="ticker"
                                    type="text" title="Four to six character ticker (letters & numbers)"
                                    class="uppercase mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="tezi"
                                    minlength="4" maxlength="6" pattern="[A-Za-z0-9-]{4,6}"
                                    required
                                    />
                                <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">Ticker name must be between 4 and 6 characters</p>
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Max Supply*</span>
                                    <input v-model="supply"
                                    type="text" title="Supply is 1 or higher & max the claim amount"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="21,000,000"
                                    minlength="1"
                                    required
                                    />
                                <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">Number of claimable tokens until max supply is reached</p> 
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Claim Amount*</span>
                                    <input v-model="maxClaim"
                                    type="number"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="1000"
                                    min="1" :max="supply"
                                    required
                                    />
                                    <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">Amount of tokens a wallet can mint each claim</p>
                                </label>
                                <label class="block">
                                    <span class="text-slate-500">Decimals*</span>
                                    <input v-model="decimals"
                                    type="number" 
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="6"
                                    min="0" max="18"
                                    required
                                    />
                                <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">Amount of decimals (0-18) token can have. Tez has 6</p>
                                </label>
                                <label v-show="protocol == 'tzrc-20b'" class="block">
                                    <span class="text-slate-500">Claim Cooldown*</span>
                                    <input v-model="cooldown"
                                    type="number" 
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder="1"
                                    min="1" step="1"
                                    />
                                <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">Amount of cooldown time in blocks (15s) to claim tokens</p>
                                </label>
                                <label class="block" v-show="protocol == 'tzrc-20b'">
                                    <span class="text-slate-500">Start Date</span>
                                    <input v-model="startDate"
                                    type="datetime-local"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">Leave empty for mint starting without delay</p>
                                </label>
                                <label class="block" v-show="protocol == 'tzrc-20b'">
                                    <span class="text-slate-500">End Date</span>
                                    <input v-model="endDate"
                                    type="datetime-local"
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                <p id="helper-text-explanation" class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">Leave empty for open end mint</p>
                                </label>
                                </div>
                            </div>

                            <p class="text-sm h-8 text-slate-500 mt-4">{{ operation }}</p>
                            <button type="submit" class="btn-primary">Inscribe Token</button>
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