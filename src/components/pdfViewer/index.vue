<template>
    <div class="pdf-viewer" v-loading="loading" element-loading-background="transparent">
        <!-- 显示模式切换按钮 -->
        <!-- <div class="view-mode-toggle">
            <button :class="{ active: viewMode === 'single' }" @click="setViewMode('single')">
                单页
            </button>
            <button :class="{ active: viewMode === 'double' }" @click="setViewMode('double')">
                双页
            </button>
        </div> -->

        <div
            class="pdf-box"
            ref="pdfBoxRef"
            @wheel="handleWheel"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
        >
            <!-- 单页模式 -->
            <div v-if="viewMode === 'single'" class="single-page-container">
                <canvas id="pdfContainer" />
            </div>

            <!-- 双页模式 -->
            <div v-else class="double-page-container">
                <canvas id="pdfContainerLeft" class="page-canvas left-page" />
                <canvas id="pdfContainerRight" class="page-canvas right-page" />
            </div>
        </div>

        <div class="preview-pdf-btns" v-if="showPage && !loading">
            <div @click="prev" class="preview-scale-icon">
                <img src="@/assets/images/common/icon_page_prev.png" />
            </div>
            <div class="preview-page">
                {{ getPageDisplayText() }}
            </div>
            <div @click="next" class="preview-scale-icon">
                <img src="@/assets/images/common/icon_page_next.png" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted, onBeforeUnmount } from 'vue'
import * as PDFJS from 'pdfjs-dist/build/pdf.mjs'
import * as PdfWorker from 'pdfjs-dist/build/pdf.worker.min?url'

const props = defineProps({
    fileUrl: {
        type: String,
        default: ''
    },
    viewType: {
        type: String,
        default: 'double'
    },
    showPage: {
        type: Boolean,
        default: true
    }
})

let pdfObj: any = null
const currentPage = ref(1)
const pdfPages = ref(0)
const loading = ref(false)
const pdfBoxRef = ref({} as any)
const viewMode = ref('double') // 显示模式：单页single或双页double

// 缩放和拖拽相关状态
const zoomState = ref({
    scale: 1, // 当前缩放比例
    minScale: 0.5, // 最小缩放比例
    maxScale: 4, // 最大缩放比例
    baseScale: 1 // 基础适配比例
})

const dragState = ref({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0
})

// 防抖渲染
let renderTimeout: NodeJS.Timeout | null = null

// 窗口大小变化处理
const handleResize = () => {
    if (pdfObj && pdfBoxRef.value) {
        // 延迟重新渲染，避免频繁调用
        setTimeout(() => {
            if (viewMode.value === 'single') {
                renderPage(currentPage.value)
            } else {
                renderDoublePage(currentPage.value)
            }
        }, 100)
    }
}

onMounted(() => {
    viewMode.value = props.viewType
    loadFile(props.fileUrl)
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)

    // 清理防抖定时器
    if (renderTimeout) {
        clearTimeout(renderTimeout)
        renderTimeout = null
    }
})

// 滚轮缩放处理
const handleWheel = (e: WheelEvent) => {
    e.preventDefault()

    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(
        zoomState.value.minScale,
        Math.min(zoomState.value.maxScale, zoomState.value.scale + delta)
    )

    if (newScale !== zoomState.value.scale) {
        zoomState.value.scale = newScale

        // 防抖渲染，避免频繁重绘
        if (renderTimeout) {
            clearTimeout(renderTimeout)
        }
        renderTimeout = setTimeout(() => {
            renderCurrentPage()
        }, 50) // 50ms防抖
    }
}

// 鼠标拖拽处理
const handleMouseDown = (e: MouseEvent) => {
    // 只有在缩放状态下才启用拖拽
    if (zoomState.value.scale <= 1) return

    const container = pdfBoxRef.value
    if (!container) return

    dragState.value.isDragging = true
    dragState.value.startX = e.clientX
    dragState.value.startY = e.clientY
    dragState.value.scrollLeft = container.scrollLeft
    dragState.value.scrollTop = container.scrollTop

    container.style.cursor = 'grabbing'
    container.style.userSelect = 'none'
    e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value.isDragging) return

    const container = pdfBoxRef.value
    if (!container) return

    e.preventDefault()

    const deltaX = e.clientX - dragState.value.startX
    const deltaY = e.clientY - dragState.value.startY

    // 使用requestAnimationFrame优化滚动性能
    requestAnimationFrame(() => {
        container.scrollLeft = dragState.value.scrollLeft - deltaX
        container.scrollTop = dragState.value.scrollTop - deltaY
    })
}

const handleMouseUp = () => {
    if (!dragState.value.isDragging) return

    const container = pdfBoxRef.value
    if (!container) return

    dragState.value.isDragging = false
    container.style.cursor = zoomState.value.scale > 1 ? 'grab' : 'default'
    container.style.userSelect = 'auto'
}

// 更新容器样式以支持滚动
const updateContainerStyle = (
    canvasWidth: number,
    canvasHeight: number,
    containerWidth: number,
    containerHeight: number
) => {
    const container = pdfBoxRef.value
    if (!container) return

    // 如果内容超出容器，启用滚动和拖拽
    if (canvasWidth > containerWidth || canvasHeight > containerHeight) {
        container.style.overflow = 'auto' // 启用滚动条
        container.style.cursor = 'grab'

        // 设置内容区域大小
        const contentArea = container.querySelector(
            '.single-page-container, .double-page-container'
        )
        if (contentArea) {
            contentArea.style.width = `${canvasWidth}px`
            contentArea.style.height = `${canvasHeight}px`
            contentArea.style.minWidth = `${canvasWidth}px`
            contentArea.style.minHeight = `${canvasHeight}px`
        }
    } else {
        container.style.overflow = 'hidden'
        container.style.cursor = 'default'

        // 重置内容区域大小
        const contentArea = container.querySelector(
            '.single-page-container, .double-page-container'
        )
        if (contentArea) {
            contentArea.style.width = '100%'
            contentArea.style.height = '100%'
            contentArea.style.minWidth = 'auto'
            contentArea.style.minHeight = 'auto'
        }
    }
}

// 渲染当前页面
const renderCurrentPage = () => {
    if (viewMode.value === 'single') {
        renderPage(currentPage.value)
    } else {
        renderDoublePage(currentPage.value)
    }
}

// 设置显示模式
const setViewMode = (mode: 'single' | 'double') => {
    viewMode.value = mode
    // 切换模式时重新渲染当前页面
    if (mode === 'single') {
        renderPage(currentPage.value)
    } else {
        renderDoublePage(currentPage.value)
    }
}

// 获取页面显示文本
const getPageDisplayText = () => {
    if (viewMode.value === 'single') {
        return `${currentPage.value} / ${pdfPages.value}`
    } else {
        const rightPage = currentPage.value + 1
        if (rightPage <= pdfPages.value) {
            return `${rightPage} / ${pdfPages.value}`
        } else {
            return `${currentPage.value} / ${pdfPages.value}`
        }
    }
}

const loadFile = async (url: any) => {
    loading.value = true
    PDFJS.GlobalWorkerOptions.workerSrc = PdfWorker.default
    let CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/cmaps/'
    const loadingTask = PDFJS.getDocument({
        url: url,
        cMapUrl: CMAP_URL,
        cMapPacked: true
    })
    loadingTask.promise.then(async (pdf: any) => {
        loading.value = false
        pdfObj = pdf // 保存加载的pdf文件流
        pdfPages.value = pdfObj.numPages // 获取pdf文件的总页数
        await nextTick(() => {
            // 根据当前显示模式渲染
            if (viewMode.value === 'single') {
                renderPage(1)
            } else {
                renderDoublePage(1)
            }
        })
    })
}

const renderPage = async (num: any) => {
    try {
        const page = await pdfObj.getPage(num)
        page.cleanup()
        const container: any = pdfBoxRef.value
        if (!container) return

        const containerWidth = container.clientWidth - 20 // 减去padding
        const containerHeight = container.clientHeight - 20 // 减去padding

        const canvas = container.querySelector('#pdfContainer')
        const ctx = canvas.getContext('2d')
        if (canvas && ctx) {
            const viewportOrigin = page.getViewport({ scale: 1 })

            // 计算基础适配比例
            const scaleX = containerWidth / viewportOrigin.width
            const scaleY = containerHeight / viewportOrigin.height
            const baseScale = Math.min(scaleX, scaleY)

            // 保存基础缩放比例
            zoomState.value.baseScale = baseScale

            // 应用用户缩放
            const finalScale = baseScale * zoomState.value.scale

            const viewport = page.getViewport({ scale: finalScale })
            canvas.width = viewport.width
            canvas.height = viewport.height

            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 更新容器样式以支持滚动
            updateContainerStyle(viewport.width, viewport.height, containerWidth, containerHeight)

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            }
            currentPage.value = num
            await page.render(renderContext).promise
        }
    } catch (error) {
        console.error('单页渲染错误:', error)
    }
}

// 双页渲染方法
const renderDoublePage = async (leftPageNum: number) => {
    const container: any = pdfBoxRef.value
    if (!container) return

    const containerWidth = container.clientWidth - 40 // 减去padding和间距
    const containerHeight = container.clientHeight - 20 // 减去padding
    const pageWidth = containerWidth / 2 - 10 // 每页宽度，留出间距

    let maxCanvasWidth = 0
    let maxCanvasHeight = 0
    let baseScale = 1

    try {
        // 先获取第一页来计算基础缩放比例
        if (leftPageNum <= pdfPages.value) {
            const firstPage = await pdfObj.getPage(leftPageNum)
            const viewportOrigin = firstPage.getViewport({ scale: 1 })

            // 计算基础适配比例
            const scaleX = pageWidth / viewportOrigin.width
            const scaleY = containerHeight / viewportOrigin.height
            baseScale = Math.min(scaleX, scaleY)

            // 保存基础缩放比例
            zoomState.value.baseScale = baseScale
        }

        // 渲染左页
        if (leftPageNum <= pdfPages.value) {
            const page = await pdfObj.getPage(leftPageNum)
            page.cleanup()
            const canvas = container.querySelector('#pdfContainerLeft')
            const ctx = canvas.getContext('2d')

            if (canvas && ctx) {
                // 应用用户缩放
                const finalScale = baseScale * zoomState.value.scale

                const viewport = page.getViewport({ scale: finalScale })
                canvas.width = viewport.width
                canvas.height = viewport.height

                maxCanvasWidth = Math.max(maxCanvasWidth, viewport.width * 2 + 20) // 双页宽度
                maxCanvasHeight = Math.max(maxCanvasHeight, viewport.height)

                // 清空画布
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                }
                await page.render(renderContext).promise
            }
        }

        // 渲染右页
        const rightPageNum = leftPageNum + 1
        if (rightPageNum <= pdfPages.value) {
            const page = await pdfObj.getPage(rightPageNum)
            page.cleanup()
            const canvas = container.querySelector('#pdfContainerRight')
            const ctx = canvas.getContext('2d')

            if (canvas && ctx) {
                // 应用用户缩放
                const finalScale = baseScale * zoomState.value.scale

                const viewport = page.getViewport({ scale: finalScale })
                canvas.width = viewport.width
                canvas.height = viewport.height

                maxCanvasWidth = Math.max(maxCanvasWidth, viewport.width * 2 + 20)
                maxCanvasHeight = Math.max(maxCanvasHeight, viewport.height)

                // 清空画布
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                }
                await page.render(renderContext).promise
            }
        } else {
            // 如果没有右页，清空右侧canvas
            const canvas = container.querySelector('#pdfContainerRight')
            if (canvas) {
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
        }

        // 更新容器样式
        updateContainerStyle(maxCanvasWidth, maxCanvasHeight, containerWidth, containerHeight)
    } catch (error) {
        console.error('双页渲染错误:', error)
    }

    currentPage.value = leftPageNum
}
// 重置缩放比例
const resetZoom = () => {
    zoomState.value.scale = 1
    const container = pdfBoxRef.value
    if (container) {
        container.scrollLeft = 0
        container.scrollTop = 0
        container.style.cursor = 'default'
    }
}

// 翻页
const prev = () => {
    if (!loading.value && currentPage.value && currentPage.value > 1) {
        // 翻页时重置缩放比例
        resetZoom()

        if (viewMode.value === 'single') {
            renderPage(currentPage.value - 1)
        } else {
            // 双页模式：一次翻两页，但要确保不超出范围
            const newPage = Math.max(1, currentPage.value - 2)
            renderDoublePage(newPage)
        }

        // 滚动到顶部
        setTimeout(() => {
            if (pdfBoxRef.value) {
                pdfBoxRef.value.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }, 100)
    }
}

const next = () => {
    if (!loading.value && pdfPages.value && currentPage.value) {
        // 翻页时重置缩放比例
        resetZoom()

        if (viewMode.value === 'single') {
            if (currentPage.value < pdfPages.value) {
                renderPage(currentPage.value + 1)
            }
        } else {
            // 双页模式：一次翻两页，但要确保不超出范围
            if (currentPage.value < pdfPages.value) {
                const newPage = Math.min(pdfPages.value, currentPage.value + 2)
                renderDoublePage(newPage)
            }
        }

        // 滚动到顶部
        setTimeout(() => {
            if (pdfBoxRef.value) {
                pdfBoxRef.value.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }, 100)
    }
}

defineExpose({
    prev,
    next
})
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
.pdf-viewer {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .view-mode-toggle {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
        display: flex;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 20px;
        overflow: hidden;

        button {
            padding: 8px 16px;
            border: none;
            background: transparent;
            color: #fff;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            &.active {
                background: rgba(255, 255, 255, 0.2);
                font-weight: bold;
            }
        }
    }

    .pdf-box {
        position: relative;
        width: 100%;
        min-height: 200px;
        height: calc(100% - 60px);
        text-align: center;
        overflow: hidden;
        padding: 10px;
        z-index: 1;

        // 自定义滚动条样式
        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;

            &:hover {
                background: rgba(255, 255, 255, 0.5);
            }
        }

        .single-page-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            #pdfContainer {
                margin: 0 auto;
                display: block;
            }
        }

        .double-page-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            position: relative;

            .page-canvas {
                display: block;
            }
        }

        // 拖拽状态下的样式
        &.dragging {
            cursor: grabbing !important;
            user-select: none;
        }

        // 缩放状态下的样式
        &.zoomed {
            cursor: grab;
        }
    }

    .preview-pdf-btns {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        padding: 7px 25px;
        z-index: 10;

        .preview-page {
            margin: 0 25px;
            min-width: 80px;
            text-align: center;
            font-size: 36px;
        }

        .preview-scale-icon {
            display: block;
            cursor: pointer;
            width: 72px;
            height: 72px;
            z-index: 10;

            & + .preview-scale-icon {
                margin-left: 25px;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
