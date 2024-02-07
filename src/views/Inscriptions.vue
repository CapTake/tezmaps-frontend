<template>
    <div class="mx-auto w-full max-w-6xl py-12 text-center px-4">
        <span class="lowercase tracking-wider inline-block whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.60em] font-bold leading-none text-neutral-50" :class="props.protocol === 'tzrc-20' ? 'bg-slate-700' :  'bg-lightblue'">{{ props.protocol }}</span> 

        <h1 class="text-4xl lg:text-5xl font-light mb-8 tracking-wider">{{ props.tick.toUpperCase() }}</h1>

        <button @click="collect" class="btn-primary">Collect</button>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
// import { toast } from 'vue3-toastify'
// import BigNumber from 'bignumber.js'
// import { api } from '../util/api'

const props = defineProps({protocol:String, tick:String})

console.log(props)

const load = async () => {
    try {

    } catch (e) {
        console.log(e)
    }
}

onMounted(async () => {
    load()
})

onBeforeUnmount(() => {
})
</script>

<style scoped>
</style>