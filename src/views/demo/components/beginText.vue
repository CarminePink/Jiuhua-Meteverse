<template>
    <div class="intro-text-container" @wheel="handleWheel">
        <div
            class="intro-title"
            v-for="(text, index) in introText"
            v-show="index === introIndex"
            :key="text"
        >
            <div v-if="index === introText.length - 1" class="enter-title-big yuweixingshu-style">
                “遇”见武当
            </div>
            <span><span class="text-shadow"></span>{{ text }}</span>
        </div>
        <div v-if="introIndex === introText.length - 1" class="btn-enter" @click="clickEnter">
            <div class="btn-enter-bg"></div>
            <div>进入</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const emits = defineEmits(['close'])
const introIndex = ref(0)
const introText = ref([
    '武林圣地，太极祖庭。遇真宫，是永乐皇帝仰慕著名高道张三丰所建，其传奇佳话，宛如宫前细流的水河，悠悠流淌历经千秋。',
    '明洪武年间(1368-1398)，张三丰在现遇真宫所在的“黄士城”结庵修行，命名为“会仙馆”，此地，自此被武当弟子、武林人士视为武林之圣地、太极之祖庭，承载着无尽的敬仰与向往。',
    '遇见武当，便是踏上了一场问道求真的心灵之旅。在这里，每一砖一瓦都镌刻着历史的痕迹，每一风一雨都诉说着道家的智慧与哲理。让我们在遇真宫的庄严与神秘中，探寻先人足迹，领悟道家哲理。'
])

const changeIntro = delta => {
    if (delta > 0) {
        introIndex.value =
            introIndex.value + delta > introText.value.length - 1
                ? introText.value.length - 1
                : introIndex.value + delta
    } else {
        introIndex.value = introIndex.value + delta < 0 ? 0 : introIndex.value + delta
    }
}

const handleWheel = e => {
    changeIntro(e.deltaY > 0 ? 1 : -1)
}
const clickEnter = () => {
    emits('close')
}
</script>
<style scoped lang="scss">
.intro-text-container {
    pointer-events: all;
    width: 1000px;
    height: calc(100vh - 150px);
    position: fixed;
    left: calc(50% - 500px);
    top: 0;

    @keyframes textAnimation {
        0% {
            opacity: 0;
            margin-top: 35px;
            transform: scale(1.1) translate(0, -50%);
        }

        100% {
            opacity: 1;
            margin-top: 0;
            transform: scale(1) translate(0, -50%);
        }
    }

    .intro-title {
        position: absolute;
        color: #fff;
        font-size: 38px;
        width: 1000px;
        text-align: center;
        top: 50%;
        left: calc(50% - 500px);
        transform: translate(0, -50%);
        animation: textAnimation 1.5s ease-out;
        user-select: none;
        font-family: Source Han Serif CN;
    }

    .enter-title-big {
        font-size: 120px;
        margin-top: -140px;
        margin-bottom: 20px;
    }

    .text-shadow {
        position: absolute;
        top: -25%;
        bottom: -25%;
        left: -15%;
        right: -15%;
        background: rgba(0, 0, 0, 0.28);
        border-radius: 50%;
        filter: blur(50px);
        z-index: -1;
        pointer-events: none;
    }

    .btn-enter {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 160px;
        position: absolute;
        left: calc(50% - 80px);
        bottom: 26px;
        color: #5a0c0a;
        font-size: 26px;
        font-family: Source Han Serif CN;
        cursor: pointer;

        &:hover {
            filter: brightness(1.1);
        }

        @keyframes enterRotate {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        .btn-enter-bg {
            width: 100%;
            height: 100%;
            position: absolute;
            background: url('/src/assets/images/btn_enter.png') no-repeat center center / 100% 100%;
            z-index: -1;
            animation: enterRotate 20s linear infinite;
        }
    }
}
</style>
