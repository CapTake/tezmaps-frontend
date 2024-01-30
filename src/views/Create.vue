<template>
    <div class="mx-auto w-full max-w-2xl py-12 text-center px-4">
        <h1 class="text-5xl font-light mb-8 tracking-wider">Inscribe</h1>

        <div class="flex flex-wrap">
            <div class="w-full">
            <ul class="flex mb-0 list-none flex-wrap pt-3 pb-12 flex-row">
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal" v-on:click="toggleTabs(1)" v-bind:class="{'text-lightgrey bg-light': openTab !== 1, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 1}">
                    TZRC-20
                </a>
                </li>
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal" v-on:click="toggleTabs(2)" v-bind:class="{'text-lightgrey bg-light': openTab !== 2, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 2}">
                    File
                </a>
                </li>
                <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded-lg block leading-normal" v-on:click="toggleTabs(3)" v-bind:class="{'text-lightgrey bg-light': openTab !== 3, 'text-white hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue': openTab === 3}">
                    Text
                </a>
                </li>
            </ul>
            <div class="relative flex flex-col min-w-0 break-words bg-white dark:bg-darkgrey dark:border-lightgrey w-full mb-6 shadow-lg rounded-lg">
                <div class="px-4 py-5 flex-auto">
                <div class="tab-content tab-space">
                    <div v-bind:class="{'hidden': openTab !== 1, 'block': openTab === 1}">
                        <p class="md:text-md text-slate-300 mb-6">Deploy your own TZRC-20 token</p>
                        <div class="flex justify-center">
                            <div class="grid grid-cols-1 gap-6 text-left text-black flex justify-center ">
                            <label class="block">
                                <span class="text-slate-500">Token Ticker*</span>
                                <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="i.e. Tezi"
                                />
                            </label>
                            <label class="block">
                                <span class="text-slate-500">Total Supply*</span>
                                <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="i.e. 21,000,000"
                                />
                            </label>
                            <label class="block">
                                <span class="text-slate-500">Max Token per Claim*</span>
                                <input
                                type="number"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="i.e. 1000"
                                />
                            </label>
                            <label class="block">
                                <span class="text-slate-500">Claim Cooldown (Blocks)</span>
                                <input
                                type="number"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="i.e. 1"
                                />
                            </label>
                            <label class="block">
                                <span class="text-slate-500">Start Date</span>
                                <input
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </label>
                            <label class="block">
                                <span class="text-slate-500">End Date</span>
                                <input
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </label>
                            </div>
                        </div>
                        <p class="text-sm h-10 text-slate-500">{{ operation }}</p>
                        <button @click="inscribe" class="transition-all rounded text-light bg-main border-white font-light px-4 py-2 hover:to-lightblue bg-gradient-to-r from-lightblue to-darkblue">Inscribe Token</button>
                    </div>
                    <div v-bind:class="{'hidden': openTab !== 2, 'block': openTab === 2}">
                    <p>
                        Tab2
                    </p>
                    </div>
                    <div v-bind:class="{'hidden': openTab !== 3, 'block': openTab === 3}">
                    <p>
                        Tab3
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
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { prepareOperation } from '../util/tzrc-20'
import BigNumber from 'bignumber.js'
import api from '../util/api'

let openTab = 1

const toggleTabs = (tabNumber) => {
    console.log(tabNumber)
    openTab = tabNumber
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