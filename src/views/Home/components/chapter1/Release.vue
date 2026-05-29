<template>
    <Teleport to=".app-wrapper">
        <Transition name="release-fade">
            <div v-if="visible" class="release-panel">
                <button class="close-btn" type="button" @click="emit('close')">&#x2715;</button>
                <div class="release-content">
                    <div class="title-area">
                        <div class="title-bg"></div>
                        <div class="title-text">{{ title }}</div>
                    </div>

                    <div class="image-wrapper">
                        <img class="koi-image" :src="koiImage" :alt="title" />
                        <button class="action-btn" type="button" @click="emit('confirm')">
                            <img :src="btnBg" alt="放生按钮背景" />
                            <span>放 生</span>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import btnBg from '@/assets/images/tool/btn_bg.png'
import koiImage from '@/assets/images/tool/koi.png'

withDefaults(
    defineProps<{
        visible: boolean
        title?: string
    }>(),
    {
        title: '锦鲤放生'
    }
)

const emit = defineEmits<{
    close: []
    confirm: []
}>()
</script>

<style scoped lang="scss">
.release-panel {
    position: fixed;
    top: 123px;
    right: 113px;
    width: 400px;
    height: 480px;
    border-radius: 10px;
    border: 1.5px solid rgba(252, 223, 165, 0.18);
    background: linear-gradient(180deg, rgba(32, 84, 134, 0.9) 0%, rgba(44, 54, 97, 0.82) 100%);
    backdrop-filter: blur(6px);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
    overflow: hidden;
    pointer-events: auto;
    z-index: 3000;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 18px;
    width: 30px;
    height: 30px;
    border: 2px solid rgba(255, 255, 255, 0.92);
    border-radius: 50%;
    color: #fff;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    z-index: 2;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
    }
}

.release-content {
    position: relative;
    padding: 10px;
    font-family: '微软雅黑', 'Microsoft YaHei', sans-serif;
}

.title-area {
    position: absolute;
    top: 20px;
    left: 10px;
    display: inline-flex;
    align-items: center;
    min-width: 264px;
    height: 70px;
    z-index: 1;
}

.title-bg {
    position: absolute;
    inset: 0;
    background: url('/images/bg_title.png') no-repeat left center;
    background-size: 100% 100%;
}

.title-text {
    position: relative;
    z-index: 1;
    padding-left: 56px;
    color: #fff;
    font-size: 23px;
    font-weight: 700;
    line-height: 1;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.28);
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.koi-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.action-btn {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 135px;
    height: 44px;
    border: 0;
    padding: 0;
    cursor: pointer;
    background: transparent;

    img {
        display: block;
        width: 100%;
        height: 100%;
    }

    span {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-align: center;
        text-shadow: 0 5px 5px rgba(0, 0, 0, 0.25);
        font-size: 18px;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: 3.6px;
    }

    &:hover {
        filter: brightness(1.08);
    }

    &:active {
        transform: scale(0.98);
        transform-origin: bottom right;
    }
}

.release-fade-enter-active,
.release-fade-leave-active {
    transition: opacity 0.25s ease;
}

.release-fade-enter-from,
.release-fade-leave-to {
    opacity: 0;
}
</style>
