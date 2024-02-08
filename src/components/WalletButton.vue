<template>
    <button @click="toggleConnection" class="btn-primary mb-1 mt-1 btn-xs">
       <span v-if="conn.connecting" class="loading loading-spinner"></span>
        <span class="tracking-tighter md:tracking-normal">{{ label }}</span>
    </button>
    <div v-if="conn.connecting" class="p-5 bg-darkgrey w-[350px] border border-lightgrey rounded-xl top-[230px] fixed right-5 bg-black">
        <h3 class="text-lg">Import wallet</h3>    
        <h4 span class="text-sm mb-4 text-slate-500">Experimental until Wallet support</h4>
        <textarea class="text-sm rounded-lg w-full h-[200px]" placeholder="Enter your secret phrase here (mnemonic or private key). DO NOT USE YOUR MAIN WALLET HERE, create a second wallet that gets used only for Tezi Network until wallets support Tezoscriptions."></textarea>    
        <input class="text-sm rounded-lg w-full text-slate-500" type="text" placeholder="Set Password (optional)"> 
        <p class="transition-all text-sm h-7 mt-2 text-slate-500 text-center">Errormessage {{ operation }}</p>
        <button @click="importSecret" class="btn-primary w-full">Import</button>
   </div>
   <div v-if="conn.connecting" class="p-5 bg-darkgrey w-[350px] border border-lightgrey rounded-xl top-20 fixed right-5 bg-black">
        <h3 class="mb-3 text-lg">Remove wallet <span class="text-sm text-slate-500"></span></h3>   
        <button @click="removeWallet" class="btn-primary mt-3 w-full">Remove</button>
   </div>
   <div v-if="conn.connecting" class="p-5 bg-darkgrey w-[350px] border border-lightgrey rounded-xl top-[640px] fixed right-5 bg-black">
        <h3 class="mb-3 text-lg">Unlock wallet <span class="text-sm text-slate-500"></span></h3>   
        <input class="text-sm rounded-lg w-full text-slate-500" type="password" placeholder="Enter Password"> 
        <p class="transition-all text-sm h-7 mt-2 text-slate-500 text-center">Errormessage {{ operation }}</p>
        <button @click="enterPassword" class="btn-primary w-full">Unlock</button>
   </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const show = false

const conn = inject('walletConnection')

const connect = inject('connectWallet')

const disconnect = inject('disconnectWallet')

const label = computed(() => {
    return conn.address ? `${conn.address.slice(0,4)}...${conn.address.slice(-4)}` : 'Connect'
})

const toggleConnection = async () => {
    if (conn.address) {
        await disconnect()
    } else {
        await connect()
    }
}
</script>
