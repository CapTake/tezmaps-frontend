<template>
    <slot></slot>
    <div v-if="isRevealed" ref="target" class="fixed z-50 top-20 sm:right-5 right-2 max-w-sm">
        <div v-if="step === 0" class="p-5 bg-slate-50 w-sm border border-slate-200 shadow-lg rounded-xl dark:bg-slate-900 dark:border-black dark:text-slate-300">
            <h3 class="text-lg mb-3 flex justify-between items-center">
                Import wallet
                <button @click="cancel" class="rounded-full dark:hover:bg-slate-800 hover:bg-slate-300 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <h4 span class="text-sm mb-4 text-slate-500">Experimental until Wallet support</h4>
            <textarea v-model.trim="mnemonic" @focus="errorMessage = ''" class="text-sm rounded-lg w-full h-[120px] text-slate-900" placeholder="Enter mnemonic here. DO NOT USE YOUR MAIN WALLET HERE, create a second wallet that gets used only for Tezi Network until wallets support Tezoscriptions."></textarea>    
            <input v-model="password" type="password" @focus="errorMessage = ''" class="text-sm rounded-lg w-full text-slate-900" placeholder="Set Password"> 
            <p class="transition-all text-sm h-7 mt-2 text-slate-500 text-center">{{ errorMessage }}</p>
            <button @click="importSecret" class="btn-primary w-full">Import</button>
        </div>
        <div v-if="step === 2" class="p-5 bg-slate-50 w-sm border border-slate-200 shadow-lg rounded-xl dark:bg-slate-900 dark:border-black dark:text-slate-300">
            <h3 class="text-lg mb-3 flex justify-between items-center gap-8">
                Wallet Connected
                <button @click="cancel" class="rounded-full dark:hover:bg-slate-800 hover:bg-slate-300 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <div class="flex justify-between mt-6 gap-4">
                <button @click="confirm('disconnect')" class="btn-primary w-full">
                    Disconnect
                </button>
                <button @click="confirm('delete')" class="btn-primary" title="Forget wallet mnemonic">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
        <div v-if="step === 3" class="p-5 bg-slate-50 w-sm border border-slate-200 shadow-lg rounded-xl dark:bg-slate-900 dark:border-black dark:text-slate-300">
            <h3 class="text-lg mb-3 flex justify-between items-center gap-8">
                Forget this wallet ?
                <button @click="cancel" class="rounded-full dark:hover:bg-slate-800 hover:bg-slate-300 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <div class="flex justify-between mt-6 gap-4">
                <button @click="confirm(false)" class="btn-primary mt-3 w-full">No</button>
                <button @click="confirm(true)" class="btn-primary mt-3 w-full">Yes</button>
            </div>
        </div>
        <div v-if="step === 1" class="p-5 bg-slate-50 w-sm border border-slate-200 shadow-lg rounded-xl dark:bg-slate-900 dark:border-black dark:text-slate-300">
            <h3 class="text-lg mb-3 flex justify-between items-center">
                Unlock wallet
                <button @click="cancel" class="rounded-full dark:hover:bg-slate-800 hover:bg-slate-300 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <input v-model="password" @keydown.enter="decryptStoredSecret" @focus="errorMessage = ''" class="text-sm rounded-lg w-full text-slate-500" type="password" placeholder="Enter Password"> 
            <p class="transition-all text-sm h-7 mt-2 text-slate-500 text-center">{{ errorMessage }}</p>
            <button @click="decryptStoredSecret" class="btn-primary w-full">Unlock</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { InMemorySigner } from '@taquito/signer'
import * as Bip39 from 'bip39'
import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito'
import { LocalForger } from '@taquito/local-forging'
import { reactive, provide } from 'vue'
import { useStorage, onClickOutside, useConfirmDialog } from '@vueuse/core'
import { ticketParams } from '../util/ticket'

const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel }  = useConfirmDialog()
import { encrypt, decrypt } from '../util/aes'

const TICKETER = import.meta.env.VITE_TICKETER

const props = defineProps({
    dappName: String,
    network: String,
    rpcUrl: String,
})

const Tezos = new TezosToolkit(props.rpcUrl)

const encryptedSeed = useStorage('wallet', '')

const password = ref('')

const mnemonic = ref('')

const errorMessage = ref('')

const step = ref(0)

const signer = ref(null)

const forger = new LocalForger()

const target = ref(null)

Tezos.setPackerProvider(new MichelCodecPacker())

onClickOutside(target, () => { cancel() })

const importSecret = async () => {
    try {
        errorMessage.value = ''

        const value = mnemonic.value

        const seed = Bip39.mnemonicToEntropy(value)

        if (!password.value || password.value.length < 8) throw new Error('Password is too short')

        encryptedSeed.value = await encrypt(password.value, seed)
        // console.log(encryptedSeed.value)
        mnemonic.value = ''
        confirm(value)
    } catch (e) {
        errorMessage.value = e.message
    }
}

const decryptStoredSecret = async () => {
    try {
        if (!password.value) throw new Error('Password is required')

        const seed = await decrypt(password.value, encryptedSeed.value)

        const mnemonic = Bip39.entropyToMnemonic(seed)

        confirm(mnemonic)
    } catch (e) {
        errorMessage.value = e.message || 'Incorrect Password'
    }
}

const getMnemonic = async () => {
    step.value = encryptedSeed.value ? 1 : 0

    const { data, isCanceled } = await reveal()

    console.log(data, isCanceled)
    
    if (isCanceled) throw new Error('Cancelled')

    return data
}

const clearPassword = async () => {
    try {
        step.value = 2
        const { data } = await reveal()
        if (data === 'disconnect') {
            password.value = ''
            connection.address = false
        } else if (data === 'delete') {
            await forgetMnemonic()
        }
    } catch (e) {
        console.log(e)
    }
}

const forgetMnemonic = async () => {
    step.value = 3
    const { data } = await reveal()
    if (data) {
        encryptedSeed.value = ''
        connection.address = ''
        password.value = ''
        step.value = 0
    } else {
        step.value = 1
    }
}

const getActiveAccount = async () => {
    try {
        const mnemonic = await getMnemonic()

        signer.value = InMemorySigner.fromMnemonic({ mnemonic })

        Tezos.setSignerProvider(signer.value)

        const address = await signer.value.publicKeyHash()

        connection.address = address

        return { address }
    } catch (e) {
        errorMessage.value = e.message.toLowerCase() === 'cancelled' ? '' : e.message
    }
}

const connectWallet = async () => {
    try {
        console.log('connect')
        if (connection.connecting) return

        connection.connecting = true

        const account = await getActiveAccount()

        connection.address = account?.address
    } catch (e) {
        console.error(e)
    } finally {
        connection.connecting = false
    }
}

const disconnectWallet = async () => {
    try {
        connection.connecting = true

        await clearPassword()
    } catch (e) {
        console.error(e)
    } finally {
        connection.connecting = false
    }
}

const connection = reactive({
    address: null,
    client: Tezos,
    connecting: false
})

provide('originate', async ({ code, storage, init }) => Tezos.contract.originate({ code, storage, init }).send())

provide('contract', async (address) => Tezos.contract.at(address))

provide('transferTicket', async ({ protocol, content, recipient, amount, entryPoint = 'default' }) => {
    const op = await Tezos.contract.transferTicket(
        ticketParams(
            recipient,
            protocol,
            content,
            amount,
            TICKETER,
            entryPoint
        )
    );
    // await op.confirmation(1)
    // console.log(op.hash)
    return op
})

provide('walletConnection', connection)

provide('connectWallet', connectWallet)

provide('disconnectWallet', disconnectWallet)
</script>
