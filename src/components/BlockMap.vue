<template>
    <div class="relative overflow-clip">
        <div id="bm-container" @mousemove="tooltipMove" ref="container" class="bg-slate-50 dark:bg-black" :style="containerStyle">
        </div>
        <div class="absolute rounded-lg shadow-md border text-sm border-slate-100 bg-white dark:bg-black py-1.5 px-3 pointer-events-none trasition-all" :style="tooltipStyle">
            {{ hoveredLevel }}.tezmap
        </div>
        <div v-if="loading" class="bg-white dark:bg-darkgrey rounded-lg shadow p-8 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg aria-hidden="true" class="w-12 h-12 text-slate-400 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watchEffect, ref, computed, reactive, nextTick } from 'vue';
import { watchDebounced } from '@vueuse/core'
import { api } from '../util/api'
import axios from 'axios'
import Konva from 'konva'

const props = defineProps({
    width: Number,
    height: Number,
    offset: Number,
    limit: Number,
    rowWidth: Number,
})

const MAX_SCALE = 12

const emit = defineEmits(['selected'])
const ready = ref(false)
const loading = ref(false)
const items = ref([])
const container = ref(null)
const hoveredLevel = ref(null)
const tooltipStyle = reactive({
    left: '20px',
    top: '40px',
    opacity: '0',
    transtionDuration: '300ms',
})

const containerStyle = computed(() => ({ width: `${props.width}px`, height: `${props.height}px`}))

const tooltipMove = (e) => {
    const { offsetX, offsetY } = e
    const dx = (props.width - offsetX) > 100 ? 16 : -120
    const dy = offsetY < 20 ? 0 : (offsetX - props.height) < 20 ? -32 : -16
    tooltipStyle.left = `${offsetX + dx}px`
    tooltipStyle.top = `${offsetY + dy}px`
}

const blocks = computed(() => {
    const result = []
    const { offset, limit } = props
    try {
        for (let i = offset; i < offset + limit; i++) {
            result.push([i, 0])
        }
        for (const id of items.value) {
            result[id % limit] = [id, 1]
        }
    } catch (e) {
        console.log(e)
    }
    return result
})

watchDebounced(
  props,
  async () => {
    await loadTezmaps(props)
  },
  { debounce: 500, maxWait: 1000 },
)

let stage = null

let layer = null

let textLayer = null

let blockSize = 16

let scaleBy = 1.1

const loadTezmaps = async ({ offset, limit }) => {
    try {
        loading.value = true
        const url = import.meta.env.VITE_BACKEND_API;
        const { data } = await axios.get(`${url}/api/tezmaps?page=${offset / limit}&pageSize=${limit}`)
        if (!Array.isArray(data)) {
            throw new Error('Couldn`t read Tezmaps')
        }

        items.value = data.map(({ id }) => Number(id)) || []
    } catch (e) {
        console.log(e)
    } finally {
        init()
        loading.value = false
    }
}

const stagePosition = (position, scale) => {
    let { x, y } = position;

    const w = stage.width()
    const h = stage.height()

    const cols = Math.floor(stage.width() / blockSize)
    const rows = Math.ceil(props.limit / cols)

    const minOffsetX = w - cols * blockSize * scale
    const minOffsetY = h - blockSize * rows * scale
    
    x = Math.max(minOffsetX, Math.min(x, 0))

    y = Math.max(minOffsetY, Math.min(y, 0))

    stage.position({ x, y })
    
    textLayer.visible(scale > 2.4)
}

const onWheel = (e) => {
    // stop default scrolling
    e.evt.preventDefault()

    let oldScale = stage.scaleX()
    let pointer = stage.getPointerPosition();

    let mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    }

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY < 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale >= 1 && newScale <= MAX_SCALE) {
        stage.scale({ x: newScale, y: newScale });
        
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        }
        
        stagePosition(newPos, newScale);
    }
}

let lastCenter = null
let lastDist = 0
let dragStopped = false

const onDragStart = function () {
    stage.container().style.cursor = 'grab'
}

const onDragEnd = function () {
    stage.container().style.cursor = 'pointer'
}

const onDragMove = function (e) {
    const { target } = e

    stagePosition(target.position(), target.scaleX())
}

const onTouchMove = (e) => {
    e.evt.preventDefault()

    stage.draggable(e.evt.touches.length === 1)

    const touch1 = e.evt.touches[0]
    const touch2 = e.evt.touches[1]
    
    // we need to restore dragging, if it was cancelled by multi-touch
    if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
        stage.startDrag();
        dragStopped = false;
    }
    
    if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
            dragStopped = true;
            stage.stopDrag();
        }
    
        const p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
        }
    
        const p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
        }
    
        if (!lastCenter) {
            lastCenter = getCenter(p1, p2)
            return
        }

        let newCenter = getCenter(p1, p2)
    
        let dist = getDistance(p1, p2)
    
        if (!lastDist) {
            lastDist = dist
        }
    
        // local coordinates of center point
        const pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
        }
    
        let scale = stage.scaleX() * (dist / lastDist)

        if (scale <= MAX_SCALE && scale >= 1) {
            stage.scale({ x: scale, y: scale })
        
            // calculate new position of the stage
            const dx = newCenter.x - lastCenter.x
            const dy = newCenter.y - lastCenter.y
        
            const newPos = {
                x: newCenter.x - pointTo.x * scale + dx,
                y: newCenter.y - pointTo.y * scale + dy,
            };
        
            stagePosition(newPos, scale);
        }
    
        lastDist = dist;
        lastCenter = newCenter;
    }
}

const onTouchEnd = () => {
    lastDist = 0
    lastCenter = null
    stage.draggable(true)
}

const COLORS = ['#a0a0a0', '#2F59ED', '#62cb3b']

const init = () => {

    stage = new Konva.Stage({
        container: 'bm-container',   // id of container <div>
        width: props.width || 500,
        height: props.height || 500,
        draggable: true,
    })

    layer = new Konva.Layer()
    textLayer = new Konva.Layer({
        visible: false,
        listening: false,
        draggable: false,
    })

    stage.container().style.cursor = 'pointer'

    const rowWidth = Math.floor(props.width / blockSize)

    for (let i = 0; i < blocks.value.length; i++) {
        if (!blocks.value[i]) continue
    
        const [n, occupied] = blocks.value[i]
        const name = `${n}`
        const x = (i % rowWidth) * blockSize + 0.5

        const y = Math.floor(i / rowWidth) * blockSize + 0.5
        const width = blockSize - 1
        const height = blockSize - 1

        const fill = COLORS[occupied]

        // if (occupied === 2) { fill = OWNED_COLOR }

        const text = new Konva.Text({
            x,
            y,
            fontSize: 2,
            fontFamily: 'monospace',
            text: name,
            width,
            height,
            fill: 'black',
            align: 'center',
            verticalAlign: 'middle'
        })

        textLayer.add(text)

        const block = new Konva.Rect({
            x,
            y,
            width,
            height,
            fill,
            name,
            opacity: 0.5,
            hitStrokeWidth: 0,
            shadowEnabled: false,
        })
        block.occupied = occupied

        layer.add(block)
    }

    // tooltipLayer.add(tooltip)

    stage.on('wheel', onWheel)

    stage.on('dragstart', onDragStart)

    stage.on('dragend', onDragEnd)
    
    stage.on('touchmove', onTouchMove)

    stage.on('touchend', onTouchEnd)

    stage.on('dragmove', onDragMove)

    layer.on('click touchend', function (evt) {
        const {target} = evt
        if (target instanceof Konva.Rect) {
           // const level = blocks.value.find(([id]) => Number(target.name()) === id)
            // if (level) 
            emit('selected', [Number(target.name()), Number(target.occupied)])
        }
    })

    layer.on('mouseover', function (evt) {
        const {target} = evt

        if (target instanceof Konva.Rect) {
            target.opacity(1)
            hoveredLevel.value = target.name()
            tooltipStyle.opacity = '1'
        }
    })

    layer.on('mouseout', function (evt) {
        const {target} = evt
        if (target instanceof Konva.Rect) {
            target.opacity(0.5)
            tooltipStyle.opacity = '0'
        }
    })

    stage.add(layer)
    stage.add(textLayer)

    stage.draw()

    ready.value = true
}

const processCollectionMessage = ({ action, record: { c, p } }) => {
    if (action !== 'create' || p !== 'tezmaps') return
    const [id] = c.split('.')
    const index = Number(id) % blocks.value.length
    console.log(p, c, index)
    const node = layer.findOne('.' + id)
    if (node) {
        node.occupied = 1
        node.fill(OCCUPIED_COLOR)
        layer.draw()
    }
}

onMounted(async () => {
    await api.collection('tickets').subscribe('*', (message) => {
        processCollectionMessage(message)
    }).catch(e => {
        console.log(e)
    })

    await loadTezmaps(props)
})

watchEffect(() => {
    if (!ready.value) return

    stage.width(props.width || 500)

    stage.height(props.height || 300)
})
</script>

<style>
.konvajs-content {
    width: 100%;
    height: 100%;
}
</style>
