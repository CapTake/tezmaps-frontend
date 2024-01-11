<template>
  <TezosWallet :rpc-url="RPC" :network="NETWORK" :dapp-name="DAPP_NAME">
    <TopNav class="fixed top-0 w-full p-5 flex gap-5 justify-between items-center z-50 bg-white"/>
    <main class="min-h-[100vh] py-[75px] relative">
      <router-view></router-view>
      <BottomNav class="px-5 py-7 bottom-0 w-full z-0 absolute" />
    </main>
  </TezosWallet>
</template>

<script setup>
import BottomNav from './components/BottomNav.vue';
import TezosWallet from './components/TezosWallet.vue'
import TopNav from './components/TopNav.vue';

const RPC = import.meta.env.VITE_TEZOS_RPC_URL
const NETWORK = import.meta.env.VITE_TEZOS_NETWORK
const DAPP_NAME = import.meta.env.VITE_DAPP_NAME
</script>