<template class="bg-white dark:bg-black dark:text-light font-100 font-customFont">
  <TezosWallet :rpc-url="RPC" :network="NETWORK" :dapp-name="DAPP_NAME">
    <TopNav class="fixed top-0 w-full p-5 flex gap-5 justify-between items-center z-50 bg-white dark:bg-black dark:text-light"/>
    <main class="min-h-[100vh] py-[75px] relative bg-white dark:bg-black dark:text-light font-customFont">
      <router-view></router-view>
      <BottomNav class="px-5 py-7 bottom-0 w-full z-0 absolute dark:bg-black dark:text-light" />
    </main>
  </TezosWallet>
</template>

<script setup>
import BottomNav from './components/BottomNav.vue';
// import TezosWallet from './components/TezosWallet.vue'
import TezosWallet from './components/BrowserWallet.vue'
import TopNav from './components/TopNav.vue';

const RPC = import.meta.env.VITE_TEZOS_RPC_URL
const NETWORK = import.meta.env.VITE_TEZOS_NETWORK
const DAPP_NAME = import.meta.env.VITE_DAPP_NAME

</script>