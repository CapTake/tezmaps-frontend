<template>
    <div class="mx-auto w-full max-w-2xl min-h-screen reative px-5">
        <h1 class="mt-10 mb-6 tezt text-xl "> Tokens</h1>
        <div v-if="loading" class="inset-0 flex justify-center items-center pointer-events-none">
            <div class="flex justify-center items-center max-w-[300px] rounded-lg py-20 px-16 shadow-lg">
                <svg aria-hidden="true" class="w-12 h-12 text-slate-400 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        </div>
        <div v-else-if="tokens.length === 0" class="flex flex-col items-center h-[50vh] justify-center py-40 w-full text-slate-400">
            <div class="text-center mb-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                </svg>
            </div>
            Loading...
        </div>
        <div v-else class="w-full grid grid-cols-1 gap-2 xl:gap-4 mb-8">
            <div v-for="item in tokens" :key="item.id" class="uppercase border border-slate-300 rounded-lg shadow hover:shadow-lg p-4 md:p-5 bg-white dark:bg-darkgrey dark:border-lightgrey dark:hover:border-slate-600 relative tracking-tight">
                <router-link :to="{ name: 'mint', params: { protocol: item.protocol, tick: item.ticker }}">
                <div class="text-md flex align-middle">
                    <div class="w-[80px] pe-3">
                        <span class="lowercase tracking-tight inline-block whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.60em] font-bold leading-none text-neutral-50 bg-lightblue">{{ item.protocol }}</span> 
                     </div>
                     <div class="w-[75px] align-middle inline-block pt-[3px]">
                         {{ item.ticker }} 
                      </div>
                      <div class="w-[350px] pe-3">
                            <progress max="100" :value="item.percentMinted" class="h-2 rounded-sm w-1/2 max-w-[125px] transition-all"></progress><span class="text-xs">{{ item.percentMinted }}%</span>
                      </div>
                      <div class="ml-auto">
                        <router-link :to="{ name: 'mint', params: { protocol: item.protocol, tick: item.ticker }}" class="align-middle inline-block"> <span class="text-xl ">></span></router-link>
                      </div>
                </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, watchEffect, computed } from 'vue'
import api from '../util/api'
import { ticketParams } from '../util/ticket'
import { decodeBytes } from '../util/tzrc-20'
import BigNumber from 'bignumber.js'
import { toast } from 'vue3-toastify'
import { validateAddress, char2Bytes, bytes2Char } from '@taquito/utils'
// import { TicketTokenParams } from '@taquito/rpc'

const TRUSTED = ['tezmap', 'tzrc-20:tezi']
const DEPRECATED = ['tezmaps']

const BTN = import.meta.env.VITE_BTN_CLASS

const loading = ref(false)

const supply = ref(0)
const cd = ref(0)
const limit = ref(0)
const decimals = ref(0)
const nbf = ref(0)
const exp = ref(0)
const minted = ref(0)

const tokens = ref([])

const loadData = async () => {
    try {
        const response = await fetch('https://api.tzkt.io/v1/contracts/KT1UURhEJPhvqp4xgF4C9ZVddJ8Qd34hHXtZ/bigmaps/state/keys?active=true&select=key,value&key.as=tzrc-20*');
        const block = await response.json()

        tokens.value = (block || []).map(({key, value}) => {

            const [protocol, ticker] = key.split(':')

            const data = decodeBytes({ bytes: value})

            cd.value = new BigNumber(data[0]).toFixed()
            decimals.value = new BigNumber(data[1]).toFixed()
            limit.value = new BigNumber(data[3]).toFixed()
            minted.value = new BigNumber(data[5]).toFixed()
            supply.value = new BigNumber(data[4]).toFixed()
            nbf.value = new Date(data[2]*1000)
            exp.value = new Date(data[6]*1000)      
            
            const percentMinted = (minted.value / supply.value * 100).toFixed(2)

            return {
                protocol,
                ticker,
                cd: cd.value,
                decimals: decimals.value,
                limit: limit.value,
                minted: minted.value,
                supply: supply.value,
                nbf: nbf.value,
                exp: exp.value,
                percentMinted, percentMinted
            }

        })

        loading.value = true
        console.log(tokens.value)

    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }
}

watchEffect(async () => {
   await loadData()
})
</script>
<style scoped>
progress[value] {
  --pb-color: rgb(47 89 237); /* the progress color */
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