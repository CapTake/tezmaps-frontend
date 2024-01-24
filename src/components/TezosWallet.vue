<template>
    <slot></slot>
</template>

<script setup>
import { BeaconWallet } from '@taquito/beacon-wallet'
import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito'
import { LocalForger } from '@taquito/local-forging'
import { reactive, onBeforeMount, provide } from 'vue'
import { useDark } from '@vueuse/core'

const props = defineProps({
    dappName: String,
    network: String,
    rpcUrl: String,
})

const Tezos = new TezosToolkit(props.rpcUrl)

const forger = new LocalForger()

Tezos.setPackerProvider(new MichelCodecPacker())

const isDark = useDark()

const wallet = new BeaconWallet({
  name: props.dappName,
  preferredNetwork: props.network,
  colorMode: isDark.value ? 'dark' : 'light'
})

Tezos.setWalletProvider(wallet)

const requestPermissions = async () => {
  return await wallet.requestPermissions({
        network: {
            type: import.meta.env.VITE_TEZOS_NETWORK
        }
    })
}

const getActiveAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount()

  return activeAccount
}

const connectWallet = async () => {
    try {
        console.log('connect')
        if (connection.connecting) return

        connection.connecting = true

        if (!connection.address) {

            let account = await getActiveAccount()

            if (!account) {
                await requestPermissions()

                account = await getActiveAccount()
            }

            connection.address = account?.address
        }
    } catch (e) {
        console.error(e)
    } finally {
        connection.connecting = false
    }
}

const disconnectWallet = async () => {
    try {
        connection.connecting = true

        await wallet.clearActiveAccount()

        connection.address = null
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

provide('originate', async ({ code, storage, init }) => Tezos.wallet.originate({ code, storage, init }).send())

provide('contract', async (address) => Tezos.wallet.at(address))

provide('transferTicket', async (params) => {
    const prepared = await Tezos.prepare.transferTicket(params)

    const forgeParams = Tezos.prepare.toForge(prepared)

    const forgedBytes = await forger.forge(forgeParams)

    console.log(forgedBytes)

    // sign the transaction operation
    // const signedBytes = await wallet.sign(forgedBytes);

    // console.log(signedBytes)

    throw new Error('Not supported yet.')
    // // get the operation hash using the encodeOpHash() function
    // const opHash = encodeOpHash(signedBytes.sbytes, new Uint8Array([3]));
    // console.log(opHash)
    // const op = await Tezos.rpc.injectOperation(signedBytes.sbytes);

    // return op
    //    Tezos.contract.transferTicket(params)
})

provide('walletConnection', connection)

provide('connectWallet', connectWallet)

provide('disconnectWallet', disconnectWallet)

onBeforeMount(async () => {
    try {
        connection.connecting = true

        const account = await getActiveAccount()

        if (account) {
            connection.address = account.address
        }
    } catch (e) {
        console.log(e)
    } finally {
        connection.connecting = false
    }
})

</script>
