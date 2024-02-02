<template>
    <nav class="font-light font-customFont text-black dark:text-light">
        <router-link to="/" class="flex gap-1 items-center">
            <Logo style="width:35px;margin-top:2px"/><span class="transition-all font-normal text-black dark:text-light text-2xl uppercase invisible sm:visible hover:text-blue-500 " style="margin-top:3px;">Tezi Network</span>
        </router-link>
        <div class="grow"></div>
        <div @click="menu = false" class="md:flex md:justify-between gap-5 md:flex-row flex-col absolute md:static bg-white dark:bg-black top-16 right-4 rounded shadow-md md:shadow-none md:p-1 p-5" :class="{hidden: !menu, flex: menu}">
            <router-link v-if="isConnected" to="/balance" class="transition-all hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                </svg>
            </router-link>
            <router-link to="/tokens" class="transition-all hover:text-blue-500">Tokens</router-link>
            <router-link to="/create" class="transition-all hover:text-blue-500">Inscribe</router-link>
            <!--<router-link :to="{ name: 'mint', params: { protocol: 'tzrc-20', tick: 'tezi' }}" class="transition-all hover:text-blue-500">Mint</router-link>-->
            <router-link to="/trade" class="transition-all hover:text-blue-500">Market</router-link>
            <router-link to="/docs" class="transition-all hover:text-blue-500">Docs</router-link>
        </div>
        <SyncButton :class="BTN" class="mb-0 mt-2 btn-xs"/>
        <button @click="menu = !menu" class="rounded-full text-slate-600 hover:text-[#2196f3] flex md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
            </svg>
        </button>
    </nav>
</template>

<script setup>
import Logo from './Logo.vue'
import SyncButton from './SyncButton.vue'
import { inject, ref, computed } from 'vue'
const BTN = import.meta.env.VITE_BTN_CLASS

const menu = ref(false)
const account = inject('walletConnection')
const isConnected = computed(() => !!account?.address)
</script>
