<template>
    <button @click="toggleConnection" class="btn-primary mb-1 mt-1 btn-xs">
       <span v-if="conn.connecting" class="loading loading-spinner"></span>
        <span class="tracking-tighter md:tracking-normal">{{ label }}</span>
    </button>
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
