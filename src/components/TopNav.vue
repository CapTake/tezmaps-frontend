<template>
    <nav>
        <router-link to="/" class="flex gap-1 items-center">
            <Logo class="text-[#2196f3] w-8 h-8"/><span class="font-bold text-slate-600 text-xl">Tezmaps</span>
        </router-link>
        <div class="grow"></div>
        <div @click="menu = false" class="md:flex md:justify-between gap-5 md:flex-row flex-col absolute md:static bg-white top-16 right-4 rounded shadow-md md:shadow-none md:p-1 p-5" :class="{hidden: !menu, flex: menu}">
            <router-link to="/" class="transition-all hover:text-blue-500">Explore</router-link>
            <router-link to="/trade" class="transition-all hover:text-blue-500">Marketplace</router-link>
            <router-link to="/docs" class="transition-all hover:text-blue-500">Docs</router-link>
        </div>
        <SyncButton class="text-sm transition-all rounded bg-[#2196f3] border border-[#2196f3] text-white px-4 py-1.5 hover:text-black hover:bg-white hover:border-black" />
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
import { ref } from 'vue'
const menu = ref(false)
</script>
