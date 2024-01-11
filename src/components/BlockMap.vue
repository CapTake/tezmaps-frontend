<template>
    <div class="relative overflow-clip">
        <div id="bm-container" @mousemove="tooltipMove" ref="container" class="bg-slate-50" :style="containerStyle">
        </div>
        <div class="absolute rounded-lg shadow-md border text-sm border-slate-100 bg-white py-1.5 px-3 pointer-events-none trasition-all" :style="tooltipStyle">
            {{ hoveredLevel }}.tezmap
        </div>
    </div>
</template>

<script setup>
import { onMounted, watchEffect, ref, computed, reactive } from 'vue';
import { watchDebounced } from '@vueuse/core'
import api from '../util/api'
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
    const { offset, limit } = props
    const result = []
    for (let i = offset; i < offset + limit; i++) {
        result.push([i, 0])
    }

    for (const id of items.value) {
        result[id] = [id, 1]
    }

    return result
})

const items = ref([])

watchDebounced(
  props,
  async () => {
    console.log(props.offset)
    await loadTezmaps(props)
    init()
  },
  { debounce: 500, maxWait: 1000 },
)

let stage = null

let layer = null

let blockSize = 12

let scaleBy = 1.1

const loadTezmaps = async ({ offset, limit }) => {
    try {
        loading.value = true
        const { data } = await axios.get(`/api/tezmaps?page=${offset / limit}&pageSize=${limit}`)
        if (!Array.isArray(data)) {
            throw new Error('Couldn`t read Tezmaps')
        }
        items.value = data.map(({ id }) => Number(id))
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }
}

const stagePosition = (position, scale) => {
    let { x, y } = position;

    const w = stage.width()
    const h = stage.height()

    const rowWidth = stage.width() / blockSize
    const cols = Math.ceil(props.limit / rowWidth)

    const minOffsetX = - (w * scale - w)
    const minOffsetY = (h - blockSize * cols) * scale
    
    x = Math.max(minOffsetX, Math.min(x, 0))

    y = Math.max(minOffsetY, Math.min(y, 0))

    stage.position({ x, y })
    
    console.log(h, blockSize * 50, minOffsetY)
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

    console.log(e.evt.deltaY)

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    console.log(direction, newScale)
    
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
const inViewPort = (r1, r2) => {

    let w1 = r1.width, h1 = r1.height;
    let w2 = r2.width, h2 = r2.height;

    let diff = {x: Math.abs((r1.x + w1/2) - (r2.x + w2/2)), 
                y: Math.abs((r1.y + h1/2) - (r2.y + h2/2))};

    let compWidth = (r1.width + r2.width)/2,
        compHeight = (r1.height + r2.height)/2;

    let hasOverlap = ((diff.x <= compWidth) && (diff.y <= compHeight)) 

    return hasOverlap;
}
const onTouchMove = (e) => {
    console.log(e)

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

const init = () => {

    stage = new Konva.Stage({
        container: 'bm-container',   // id of container <div>
        width: props.width || 500,
        height: props.height || 500,
        draggable: true,
    })

    layer = new Konva.Layer()

    stage.container().style.cursor = 'pointer'

    const rowWidth = Math.floor(props.width / blockSize)

    for (let i = 0; i < blocks.value.length; i++) {
        const [n, occupied] = blocks.value[i]
        const x = (i % rowWidth) * blockSize

        const y = Math.floor(i / rowWidth) * blockSize

        const fill = occupied === 0 ? '#c0c0c0' : '#0d47a1' 

        const block = new Konva.Rect({
            x: x + 1,
            y: y + 1,
            width: blockSize - 1,
            height: blockSize - 1,
            fill,
            name: `${n}`,
            opacity: 0.5,
            hitStrokeWidth: 0,
            shadowEnabled: false,
        })

        layer.add(block)
    }

    // tooltipLayer.add(tooltip)

    stage.on('wheel', onWheel)

    stage.on('dragstart', onDragStart)

    stage.on('dragend', onDragEnd)
    
    stage.on('touchmove', onTouchMove)

    stage.on('touchend', onTouchEnd)

    stage.on('dragmove', onDragMove)

    layer.on('click', function (evt) {
        const {target} = evt
        if (target instanceof Konva.Rect) {
            // alert('you clicked on target "' + target.name() + '"')
            const level = blocks.value.find(([id]) => Number(target.name()) === id)
            if (level) emit('selected', level)
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

    layer.draw()

    ready.value = true
}

onMounted(async () => {

    await api.collection('tickets').subscribe('*', (message) => {
        console.log(message)
    })

    await loadTezmaps(props)

    init()
})

watchEffect(() => {
    if (!ready.value) return

    stage.width(props.width || 500)

    stage.height(props.height || 300)

    if (!loading.value) init()
})
</script>

<style>
.konvajs-content {
    width: 100%;
    height: 100%;
}
</style>
