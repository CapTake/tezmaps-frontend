<template>
    <div class="w-full min-h-screen reative px-5 ">
        <h1 class="mt-10 mb-6 tezt text-xl">{{ holder }} Holdings</h1>
        <div v-if="loading" class="inset-0 flex justify-center items-center pointer-events-none">
            <div class="flex justify-center items-center max-w-[300px] rounded-lg py-20 px-16 shadow-lg">
                <svg aria-hidden="true" class="w-12 h-12 text-slate-400 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        </div>
        <div v-else-if="items.length === 0" class="flex flex-col items-center h-[50vh] justify-center py-40 w-full text-slate-400">
            <div class="text-center mb-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                </svg>
            </div>
            There is nothing here yet.
        </div>
        <div v-else class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xl:gap-3 mb-8">
            <article v-for="item in items" :key="item.id" class="border border-slate-300 rounded-lg shadow hover:shadow-lg px-3 md:px-5 bg-white dark:bg-darkgrey dark:border-lightgrey relative tracking-tight">
                <div class="py-2 text-xs text-slate-500 flex justify-between items-center uppercase" :class="{'line-through decoration-red-500': item.deprecated}">
                    {{ item.protocol }}
                    <svg v-if="item.trusted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-green-300">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div v-if="item.protocol === 'tezmap'" class="w-full flex justify-center items-end gap-1 mb-6 mt-4">
                    <div>
                        {{ item.content }}
                    </div>
                </div>
                <div v-else-if="item.protocol === 'tzrc-20'" class="w-full flex justify-center items-center gap-1 mb-6 mt-4">
                    <div>
                        {{ item.balance }} 
                    </div>
                    <div class="text-sm text-slate-500 uppercase">
                         {{ item.ticker }}
                    </div>
                </div>
                <div v-else-if="item.protocol === 'tzrc-20b'" class="w-full flex justify-center items-center gap-1 mb-6 mt-4">
                    <div>
                        {{ item.balance }} 
                    </div>
                    <div class="text-sm text-slate-500 uppercase">
                         {{ item.ticker }}
                    </div>
                </div>
                <div v-else class="w-full flex justify-center items-end gap-1 mb-6 mt-4 flex-wrap">
                    <div v-if="item.content" :title="item.content" class="bg-slate-100 dark:bg-darkblue rounded p-1 text-sm">
                        {{ item.content.slice(0,8) }}{{ item.content.length > 8 ? '&hellip;' : '' }}
                    </div>
                    <div>
                        &times;
                    </div>
                    <div>
                        {{ item.balance }} {{ item.ticker }}
                    </div>
                </div>
                <div v-if="isOwn" class="w-full flex justify-around items-end gap-2 md:gap-3 xl:gap-4 mb-4 text-sm lg:text-base">
                    <button @click="comingSoon" class="text-sm bg-slate-700 text-white hover:bg-slate-500 flex justify-center gap-2 rounded py-1.5 px-4 items-center flex-grow">
                        List
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 hidden sm:inline">
                            <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z" />
                            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button @click="() => openSendDialog(item)" title="Send" class="text-sm bg-blue-500 bg-gradient-to-r text-light from-lightblue to-darkblue hover:to-lightblue flex justify-center gap-2 rounded py-1.5 px-4 items-center">
                        <span class="hidden lg:inline">
                            Send
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                        </svg>
                    </button>
                </div>
            </article>
        </div>
        <div v-if="totalPages > 1" class="flex justify-center gap-2 w-full items-center max-w-[300px] mx-auto overflow-clip mt-8">
            <button @click="goToPage(p)" v-for="p in paging" :key="p" class="px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-darkblue rounded" :class="{'bg-slate-200': p === page}, {'dark:bg-darkblue': p === page}">
                {{ p }}
            </button>
        </div>
        <dialog ref="sendDialog" class="p-5 shadow-lg rounded-xl bg-white dark:bg-darkgrey dark:text-light max-w-full w-[400px]">
            <h3 class="w-full flex justify-between items-center mb-4 text-xl">
                <span>Sending</span>
                <button @click="() => sendDialog.close()" class="p-2 rounded-full -m-4 hover:bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <div v-if="selection" class="my-6 text-center">
                {{ selection.content }}
            </div>
            <label class="my-6 text-center flex gap-2 justify-between items-center border p-2 rounded whitespace-nowrap" :class="{'border-slate-300': !destError, 'border-red-400': destError}">
                <span class="flex-shrink">To:</span>
                <input type="text" min="36" max="36" v-model.trim="destAddress" class="flex-grow text-sm outline-none dark:bg-slate-300 dark:text-slate-900" placeholder="tz1SaxU1fWespNC8xLR82H1C1YqRMrRLCyCV" novalidate @focus="destError = false" /> 
            </label>
            <div class="flex justify-between items-center">
                <button @click="() => sendDialog.close()" class="btn-secondary">
                    Cancel
                </button>
                <button @click="() => openSendConfirmationDialog()" class="btn-primary">
                    Send
                </button>
            </div>
        </dialog>
        <dialog ref="sendConfirmationDialog" class="p-5 bg-slate-50 border border-slate-200 shadow-lg rounded-xl dark:bg-slate-900 dark:border-black dark:text-slate-300 w-[400px]">
            <h3 class="w-full flex justify-between items-center mb-4 text-xl">
                <span>Confirm Sending</span>
                <button @click="() => sendConfirmationDialog.close()" class="p-2 rounded-full -m-4 hover:bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </h3>
            <div v-if="selection" class="my-6 text-center">
                {{ selection.content }}
            </div>
            <label class="my-6 text-center flex gap-2 justify-between items-center border  p-2 rounded whitespace-nowrap" :class="{'border-slate-300': !destError, 'border-red-400': destError}">
                <span class="flex-shrink text-sm">To: {{ destAddress }}</span>
            </label>
            <div class="flex justify-between items-center">
                <button @click="() => sendConfirmationDialog.close()" class="btn-secondary">
                    Cancel
                </button>
                <button @click="sendTicket" class="btn-primary">
                    Confirm
                </button>
            </div>
        </dialog>
    </div>
</template>

<script setup>
import { inject, ref, watchEffect, computed } from 'vue'
import { api, TRUSTED, DEPRECATED } from '../util/api'
import BigNumber from 'bignumber.js'
import { toast } from 'vue3-toastify'
import { validateAddress, char2Bytes, bytes2Char } from '@taquito/utils'
// import { TicketTokenParams } from '@taquito/rpc'

const props = defineProps({
  wallet: String
})

const account = inject('walletConnection')

const BALANCE_VIEW = 'balance_view'

const loading = ref(false)

const sending = ref(false)

const isOwn = computed(() => account.address && account.address === props.wallet)

const holder = computed(() => {
    if (isOwn.value) return 'Your'
    const address = props.wallet || ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
})

const items = ref([])
const page = ref(1)
const perPage = ref(25)
const totalPages = ref(1)

const filter = computed(() => `holder = "${props.wallet || ''}"`)

const paging = computed(() => {
    const current = page.value
    const last = totalPages.value
    let res  = current > 1 && current < last ? [current] : []
    const len = 3
    for (let i = 1; i <= len; i++) {
        let p = current - i
        if (p > 1 && p < last && res.length < len) {
            res = [p, ...res]
        }
        p = current + i
        if (p > 1 && p < last && res.length < len) {
            res = [...res, p]
        }
    }
    if (last > 1) {
        res.push(last)
    }
    return [1, ...res]
})

const destAddress = ref(null)
const destError = ref(false)
const sendDialog = ref(null)
const sendConfirmationDialog = ref(null)

const selection = ref(null)
const sendAmount = ref(1)

const goToPage = (n) => {
    page.value = n
    lastBlock()
    loadData()
}

const comingSoon = () => {
    toast.warn("Work in progress: feature is coming soon...")
}

const openSendDialog = (sel) => {
    const { protocol, content } = sel
    selection.value = { protocol, content, balance: 1 }
    sendDialog.value.showModal()
}
const openSendConfirmationDialog = async() => {
    sendConfirmationDialog.value.showModal()
}

// const contractAt = inject('contract')
const transferTicket = inject('transferTicket')

const sendTicket = async () => {
    try {
        /// So. Taquito doesn't let you use wallet to send tickets right now.
        /// Temporary solution is to make in-browser wallet
        if (sending.value || !selection.value) return
        sending.value = true

        sendConfirmationDialog.value.close()

        const { protocol, content } = selection.value

        if (protocol !== 'tezmap') {
            sendDialog.value.close()
            throw new Error('Only Tezmaps sending supported so far.')
        }

        const recipient = destAddress.value
        const amount = sendAmount.value

        if (validateAddress(recipient) !== 3) {
            destError.value = true
            return
        }

        if (!account.address) {
            throw new Error('Connect wallet first!')
        }

        
        const op = await transferTicket({
            protocol,
            content: char2Bytes(content),
            amount,
            recipient,
            entryPoint: 'default'
        })

        sendDialog.value.close()

        await op.confirmation(1)

        /*
        {"val":{"prim":"pair","args":[{"prim":"ticket","args":[{"prim":"pair","args":[{"prim":"string"},{"prim":"bytes"}]}],"annots":["%ticket"]},{"prim":"address","annots":["%to_"]}]},"idx":0}
        */

        toast.success(`Successfully sent ${content}`, { autoClose: 3000, theme: 'colored', position: 'top-center' })

    } catch (e) {
        console.log(e)
        const message = e.description || e.message
        toast.error(message, { autoClose: 3000, theme: 'colored', position: 'top-center' })
    } finally {
        sending.value = false
    }
}

const loadData = async () => {
    try {
        loading.value = true
        const { page: p, perPage: pp, totalPages: tp, items: res } = await api.collection(BALANCE_VIEW)
            .getList(page.value, perPage.value, { filter: filter.value, sort: '-updated' })
        page.value = p
        perPage.value = pp
        totalPages.value = tp
        items.value = (res || []).map(({id, p, total_supply, balance, c, holder}) => {
            const [protocol, ticker] = p.split(':')
            let b = new BigNumber(balance)
            let decimals = 0
            let content = c
            if(protocol === 'tzrc-20' || protocol === 'tzrc-20b') {
                decimals = parseInt(c || '0', 16)
                b = b.dividedBy(new BigNumber(10).pow(decimals))
                content = ''
            } else if(protocol === 'tezmap') {
                content = bytes2Char(content)
            }

            return {
                id,
                protocol,
                trusted: TRUSTED.includes(p),
                deprecated: DEPRECATED.includes(p),
                ticker,
                content,
                balance: b.toFormat(),
                total: total_supply,
                decimals,
                holder
            }
        })
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }
}

watchEffect(async () => {
   await loadData(filter.value)
})
</script>
