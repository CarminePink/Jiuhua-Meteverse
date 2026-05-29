<template>
    <div class="modal-mask" @click="closeModal" @contextmenu="closeModal"></div>
    <div class="info-video-modal-bg" :style="modalPositionStyle" ref="infoModalRef">
        <div class="info-video-modal">
            <img
                class="modal-close"
                src="@/assets/images/common/icon_close.png"
                @click="closeModal"
            />
            <img class="modal-corner-1" src="@/assets/images/common/modal_corner_1.png" />
            <img class="modal-corner-2" src="@/assets/images/common/modal_corner_2.png" />
            <img class="modal-corner-3" src="@/assets/images/common/modal_corner_2.png" />
            <div class="modal-content">
                <div class="detail-left" v-if="props.detailData?.video">
                    <video
                        class="detail-video"
                        controls
                        autoplay
                        ref="videoRef"
                        :src="props.detailData?.video"
                    />
                </div>
                <div class="detail-left" v-else-if="props.detailData?.image">
                    <img class="detail-img" :src="props.detailData?.image" />
                </div>
                <div class="detail-right">
                    <div class="detail-title" :title="props.detailData?.name || ''">
                        {{ props.detailData?.name }}
                    </div>
                    <div class="detail-remark">{{ props.detailData?.description }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
let infoModalRef = ref()
onMounted(() => {
    // document.addEventListener('mousedown', eventHandler)
})
onBeforeUnmount(() => {
    // document.removeEventListener('mousedown', eventHandler)
})
const emit = defineEmits(['close'])
const props = defineProps({
    detailData: {
        type: Object,
        default: () => {}
    },
    detailScreenXY: {
        type: Array,
        default: () => [0, 0]
    },
    // 触发元素的尺寸，用于避免遮挡
    triggerSize: {
        type: Array,
        default: () => [100, 80] // [width, height]
    }
})

// 计算弹窗位置的响应式样式
const modalPositionStyle = computed(() => {
    return calculateModalPosition()
})

// 计算弹窗的最佳位置
const calculateModalPosition = () => {
    // 确保坐标值为数字类型
    const clickX = Number(props.detailScreenXY[0]) || 0
    const clickY = Number(props.detailScreenXY[1]) || 0

    // 获取视口尺寸
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // 获取当前rem基准值（amfe-flexible设置的）
    const htmlFontSize = parseFloat(
        document.documentElement.style.fontSize ||
            getComputedStyle(document.documentElement).fontSize ||
            '16'
    )

    // 弹窗尺寸（rem转换为px，rootValue=960）
    const actualModalWidth = (3400 / 960) * htmlFontSize
    const actualModalHeight = (1600 / 960) * htmlFontSize

    // 安全边距
    const margin = 20

    // 获取触发元素的尺寸
    const triggerWidth = Number(props.triggerSize[0]) || 100
    const triggerHeight = Number(props.triggerSize[1]) || 80

    let left = 0
    let top = 0

    // 优先级：右侧 > 左侧 > 下方 > 上方
    // 1. 尝试在右侧显示
    if (clickX + triggerWidth + actualModalWidth + margin <= viewportWidth) {
        left = clickX + triggerWidth
        // 垂直居中对齐触发元素
        top = Math.max(
            margin,
            Math.min(
                clickY + triggerHeight / 2 - actualModalHeight / 2,
                viewportHeight - actualModalHeight - margin
            )
        )
    } else if (clickX - triggerWidth - actualModalWidth - margin >= 0) {
        // 2. 尝试在左侧显示
        left = clickX - actualModalWidth - triggerWidth
        // 垂直居中对齐触发元素
        top = Math.max(
            margin,
            Math.min(
                clickY + triggerHeight / 2 - actualModalHeight / 2,
                viewportHeight - actualModalHeight - margin
            )
        )
    } else if (clickY + triggerHeight + actualModalHeight + margin <= viewportHeight) {
        // 3. 尝试在下方显示
        top = clickY + triggerHeight
        // 水平居中对齐触发元素
        left = Math.max(
            margin,
            Math.min(
                clickX + triggerWidth / 2 - actualModalWidth / 2,
                viewportWidth - actualModalWidth - margin
            )
        )
    } else if (clickY - actualModalHeight - margin >= 0) {
        // 4. 尝试在上方显示
        top = clickY - actualModalHeight
        // 水平居中对齐触发元素
        left = Math.max(
            margin,
            Math.min(
                clickX + triggerWidth / 2 - actualModalWidth / 2,
                viewportWidth - actualModalWidth - margin
            )
        )
    } else {
        // 5. 如果都放不下，则居中显示并确保不超出边界
        left = Math.max(
            margin,
            Math.min(
                clickX + triggerWidth / 2 - actualModalWidth / 2,
                viewportWidth - actualModalWidth - margin
            )
        )
        top = Math.max(
            margin,
            Math.min(
                clickY + triggerHeight / 2 - actualModalHeight / 2,
                viewportHeight - actualModalHeight - margin
            )
        )
    }

    return {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        transform: 'none'
    }
}

const closeModal = () => {
    emit('close')
}
// 监听事件，有其他鼠标操作时则关闭当前信息弹窗
const eventHandler = (event: any) => {
    const isInsideComponent = infoModalRef.value.contains(event.target)
    if (!isInsideComponent) {
        closeModal()
    }
}
</script>

<style scoped lang="scss">
@keyframes panelContentShow {
    0% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}
@property --border-gradient-angle {
    syntax: '<angle>';
    inherits: true;
    initial-value: 0turn;
}
@keyframes buttonBorderSpin {
    0% {
        --border-gradient-angle: 0turn;
    }

    100% {
        --border-gradient-angle: 1turn;
    }
}
.modal-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 3000;
    left: 0;
    top: 0;
    background: transparent;
}
.info-video-modal-bg {
    position: fixed;
    z-index: 3000;
    background-image: conic-gradient(
        from var(--border-gradient-angle) at 50% 50%,
        transparent,
        #ffe2b4 14%,
        transparent 17%
    );
    border-radius: 20px;
    background-size: contain;
    padding: 8px;
    width: 3400px;
    height: 1600px;
    animation:
        panelContentShow 0.3s ease-in-out,
        buttonBorderSpin 9s linear infinite 0ms;
}
.info-video-modal {
    width: 100%;
    height: 100%;
    padding: 110px 60px 110px 100px;
    background: linear-gradient(
        155deg,
        rgba(175, 167, 142, 0.9) -61.8%,
        rgba(141, 130, 99, 0.9) -37.56%,
        rgba(74, 65, 39, 0.9) -3.93%,
        rgba(17, 15, 9, 0.9) 39.86%,
        rgba(33, 32, 29, 0.9) 100.85%
    );
    border-radius: 20px;
    backdrop-filter: blur(16px);
    .modal-close {
        position: absolute;
        right: -50px;
        top: -50px;
        width: 100px;
        height: 100px;
        cursor: pointer;
        &:hover {
            filter: brightness(1.3);
        }
    }
    .modal-corner-1 {
        position: absolute;
        width: 207px;
        height: 194px;
        left: -70px;
        top: -90px;
    }
    .modal-corner-2 {
        position: absolute;
        width: 91px;
        height: 32px;
        right: 50px;
        top: -15px;
    }
    .modal-corner-3 {
        position: absolute;
        width: 91px;
        height: 32px;
        right: 12px;
        top: 50px;
        transform: rotate(-90deg);
        transform-origin: right top;
    }
    .modal-content {
        width: 100%;
        height: 100%;
        display: flex;
        .detail-left {
            display: flex;
            align-items: center;
            max-width: 2040px;
            .detail-video {
                width: 2040px;
                max-height: 100%;
                object-fit: contain;
            }
            .detail-img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        }
        .detail-right {
            flex: 1;
            margin-left: 105px;
            overflow: hidden;
            .detail-title {
                width: 100%;
                font-size: 80px;
                color: #ffe2b4;
                text-align: center;
                padding-right: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .detail-remark {
                margin-top: 30px;
                color: #fff;
                font-size: 50px;
                text-align: justify;
                line-height: 1.6;
                height: 1220px;
                overflow-y: auto;
                white-space: pre-wrap;
                padding-right: 50px;
            }
        }
    }
}
</style>
