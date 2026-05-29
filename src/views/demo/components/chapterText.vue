<template>
    <div id="chapterInfoBox" class="chapter-info-box">
        <div class="chapter-title yuweixingshu-style">{{ chapterInfo.name }}</div>
        <div class="chapter-desc">
            <span><span class="text-shadow"></span>{{ chapterInfo.description }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const emits = defineEmits(['close'])
const timer = ref<any>(null)
const props = defineProps({
    currentStep: {
        type: Number,
        default: -1
    }
})
const chapterInfo = ref<any>({})
const chapterList = ref([
    {
        stepKey: 2,
        id: 1,
        name: '第一章·求真',
        description:
            '遇真宫，六百年间历经风雨与重建，见证历代帝王追寻，传承求真问道精神。它与张三丰的故事，至今仍激励人们追求真理与精神升华。'
    },
    {
        stepKey: 4,
        id: 2,
        name: '第二章·遇真',
        description:
            '踏入遇真宫，每处细节都彰显着独特魅力和深厚文化底蕴，展现了明代官式建筑的特色。'
    },
    {
        stepKey: 7,
        id: 3,
        name: '第三章·修真',
        description:
            '纵观史书，皇帝为一名道士建宫观、奉生祠，世所罕见。张三丰祖师在武当山修行，研道家经典悟精髓。其智慧启迪身心、探寻命谛，引后人崇仰。'
    },
    {
        stepKey: 9,
        id: 4,
        name: '尾章·归真',
        description:
            '历史上的遇真宫殿阁巍峨，琼台伟岸。作为世界遗产武当山古建群的重要组成部分，遇真宫遗址的沧桑之美为后人留下了想象空间，成为历史长河的深刻印记。'
    }
])

onMounted(() => {
    initChapterInfo()
})

onBeforeUnmount(() => {
    return timer.value && clearTimeout(timer.value)
})

const initChapterInfo = () => {
    chapterInfo.value =
        chapterList.value.find((item: any) => item.stepKey == props.currentStep) || {}
    document.getElementById('chapterInfoBox')?.classList.add('hide-chapter-title')
    timer.value = setTimeout(() => {
        emits('close')
    }, 2800)
}
</script>
<style scoped lang="scss">
.hide-chapter-title {
    animation: hideAnimation 1s ease-out;
    animation-delay: 2s;
}
.chapter-info-box {
    pointer-events: none;
    background: transparent;
    width: 100vw;
    height: calc(100vh - 150px);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;

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

    @keyframes hideAnimation {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .chapter-title {
        position: absolute;
        font-size: 95px;
        left: 80px;
        width: 110px;
        top: 52%;
        transform: translateY(-50%);
        line-height: 120px;
    }

    .chapter-desc {
        position: absolute;
        color: #fff;
        font-size: 40px;
        width: 1000px;
        text-align: center;
        top: 50%;
        left: calc(50% - 500px);
        animation: textAnimation 1s ease-out;
        transform: translate(0, -50%);
        font-family: Source Han Serif CN;
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
}
</style>
