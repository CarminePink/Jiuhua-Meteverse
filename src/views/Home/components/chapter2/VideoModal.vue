<template>
    <Teleport to=".app-wrapper">
        <div v-if="visible" class="video-modal-root">
            <div class="video-modal common-modal-border">
                <button class="close-btn" type="button" @click="handleClose">
                    <img :src="closeIcon" alt="关闭复原视频弹窗" />
                </button>

                <div class="modal-header">
                    <h3 class="modal-title">朝圣古道复原视频</h3>
                </div>

                <div class="video-wrapper">
                    <video
                        ref="videoRef"
                        class="video-player"
                        :src="mockVideoSrc"
                        controls
                        autoplay
                        muted
                        playsinline
                        preload="auto"
                    />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import closeIcon from '@/assets/images/tool/icon_close.png'

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    close: []
}>()

const mockVideoSrc = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const videoRef = ref<HTMLVideoElement | null>(null)

const resetAndPlay = async () => {
    const videoEl = videoRef.value

    if (!videoEl) {
        return
    }

    videoEl.currentTime = 0

    try {
        await videoEl.play()
    } catch (error) {
        console.warn('视频自动播放失败:', error)
    }
}

const handleClose = () => {
    videoRef.value?.pause()
    emit('close')
}

watch(
    () => props.visible,
    visible => {
        if (visible) {
            nextTick(() => {
                resetAndPlay()
            })
            return
        }

        videoRef.value?.pause()
    }
)

onBeforeUnmount(() => {
    videoRef.value?.pause()
})
</script>

<style scoped lang="scss">
.video-modal-root {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3200;
    pointer-events: none;
}

.video-modal {
    position: relative;
    width: min(748px, calc(100vw - 32px));
    height: min(496px, calc(100vh - 32px));
    padding: 20px;
    border-radius: 14px;
    box-sizing: border-box;
    background:
        linear-gradient(180deg, rgba(31, 74, 118, 0.94) 0%, rgba(10, 39, 70, 0.96) 100%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.26);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    pointer-events: auto;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(circle at 16% 18%, rgba(255, 255, 255, 0.18), transparent 22%),
            radial-gradient(circle at 78% 0%, rgba(255, 214, 154, 0.1), transparent 18%);
        pointer-events: none;
    }
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    z-index: 1;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding-right: 36px;
}

.modal-title {
    margin: 0;
    color: #fff4da;
    font-family: 'YouSheBiaoTiHei';
    font-size: 28px;
    font-weight: 400;
    letter-spacing: 2px;
}

.video-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(2, 10, 20, 0.86);
    box-shadow: inset 0 0 0 1px rgba(255, 228, 190, 0.15);
}

.video-player {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    background: #020812;
}

@media (max-width: 768px) {
    .video-modal {
        gap: 12px;
    }

    .modal-title {
        font-size: 22px;
    }
}
</style>
