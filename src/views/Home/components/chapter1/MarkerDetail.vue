<template>
    <Transition name="marker-detail-fade">
        <div v-if="visible" class="marker-detail-overlay">
            <div class="marker-detail-container" :class="{ 'has-video': video }">
                <h3 class="marker-detail-title">{{ name }}</h3>

                <button class="close-btn" type="button" @click="emit('close')">
                    <img src="@/assets/images/tool/icon_close.png" alt="关闭详情" />
                </button>

                <div v-if="video" class="video-area">
                    <video
                        ref="videoRef"
                        class="marker-video"
                        :src="video"
                        autoplay
                        playsinline
                        controls
                    />
                </div>

                <div class="description-area">
                    <p class="description-text">{{ description }}</p>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
    visible: boolean
    name: string
    description: string
    video?: string
}>()

const emit = defineEmits<{
    close: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

watch(
    () => props.visible,
    val => {
        if (!val && videoRef.value) {
            videoRef.value.pause()
            videoRef.value.currentTime = 0
        }
    }
)
</script>

<style scoped lang="scss">
.marker-detail-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    pointer-events: none;
}

.marker-detail-container {
    position: relative;
    width: 680px;
    min-height: 234px;
    padding: 20px;
    border-radius: 10px;
    border: none;
    background: url('@/assets/images/tool/detail_bg.png') center / 100% 100% no-repeat;
    display: flex;
    flex-direction: column;
    pointer-events: all;

    &.has-video {
        width: 780px;
    }
}

.video-area {
    margin-bottom: 12px;
    border-radius: 6px;
    overflow: hidden;
}

.marker-video {
    width: 100%;
    max-height: 360px;
    display: block;
    object-fit: contain;
    background: #000;
}

.marker-detail-title {
    margin: 0 0 18px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    line-height: normal;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.description-area {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 10px;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }
}

.description-text {
    margin: 0;
    color: #fff;
    text-align: justify;
    font-size: 20px;
    font-weight: 400;
    line-height: 180%;
    text-indent: 2em;
}

.marker-detail-fade-enter-active,
.marker-detail-fade-leave-active {
    transition: opacity 0.25s ease;
}

.marker-detail-fade-enter-from,
.marker-detail-fade-leave-to {
    opacity: 0;
}
</style>
