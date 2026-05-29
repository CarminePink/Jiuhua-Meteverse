<template>
    <div class="loading-page-container" v-if="isActive">
        <!--加载页 -->
        <div class="loading-scene" v-if="phase === 'loading'">
            <img class="bg" src="@/assets/images/layout/bg.png" />
            <img class="cloud cloud-top" src="@/assets/images/layout/cloud.png" />
            <img class="cloud cloud-bottom-left" src="@/assets/images/layout/cloud_2.png" />
            <div class="center-content">
                <img class="title-img" src="@/assets/images/layout/title.png" />
                <div class="subtitle">数字体验空间</div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--欢迎词页 -->
        <div class="intro-scene" v-else-if="phase === 'intro'">
            <img class="bg" src="@/assets/images/layout/bg_2.png" />
            <img class="cloud cloud-top-right" src="@/assets/images/layout/cloud_3.png" />
            <button class="skip-button" type="button" @click="skipIntro">跳过</button>
            <div class="intro-content">
                <h2 class="intro-title">欢 迎 词</h2>
                <div class="intro-text-wrapper">
                    <img class="content-bg" src="@/assets/images/layout/content_bg.png" />
                    <p class="intro-text">
                        “大唐盛世，新罗国僧金乔觉，远涉重洋，历经千辛万苦，卓锡九华，开辟道场，潜心修持。因他笃信地藏菩萨，且容貌酷似地藏菩萨瑞相，后人尊称他为“金地藏”。从此，九华山成为地藏菩萨道场。今日，有缘人寻迹而来，在四座古刹中寻找四件关键宝物，揭开一段跨越千年的传奇故事……”
                    </p>
                </div>
            </div>
            <audio ref="audioRef" :src="introAudioSrc" @ended="onAudioEnded"></audio>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDasUE } from '@/hooks/useDasUEHook'
import { useLogoStore } from '@/stores/logo'
import { useUserInfo } from '@/stores/userInfo'
import introAudioSrc from '@/assets/images/layout/introduce.mp3'
import { resolveRetainedQueryFromRoute } from '@/router/query'

const router = useRouter()
const route = useRoute()
const userStore = useUserInfo()
const logoStore = useLogoStore()
const audioRef = ref<HTMLAudioElement | null>(null)

const isActive = ref(true)
const phase = ref<'loading' | 'intro'>('loading')
const progress = ref(0)
let ueManager: any = null
let ueReady = false
let mockTimer: ReturnType<typeof setInterval> | null = null
let hasExitedIntro = false

// 是否已选择角色性别（如果已选择过，直接进入地图；如果未选择过，进入角色选择页）
const hasSelectedCharacterGender = computed(() => {
    return userStore.userInfos.hasSelectedCharacterGender
})

// 隐藏系统logo
onMounted(() => {
    logoStore.setShowLogo(false)
    startMockProgress()

    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(async () => {
        ueManager = dasUE
        ueReady = true
    })
})

// mock加载进度，后续可替换为ueManager实际进度
function startMockProgress() {
    mockTimer = setInterval(() => {
        if (progress.value < 90 && !ueReady) {
            progress.value += Math.random() * 3
            if (progress.value > 90) progress.value = 90
        } else if (progress.value < 100) {
            progress.value += 5
            if (progress.value >= 100) {
                progress.value = 100
                clearInterval(mockTimer!)
                mockTimer = null
                onLoadingComplete()
            }
        }
    }, 100)
}

function onLoadingComplete() {
    phase.value = 'intro'
    nextTick(() => {
        audioRef.value?.play().catch(() => {
            // 浏览器可能阻止自动播放，静默处理
            onAudioEnded()
        })
    })
}

function skipIntro() {
    audioRef.value?.pause()
    if (audioRef.value) audioRef.value.currentTime = 0
    onAudioEnded()
}

function onAudioEnded() {
    if (hasExitedIntro) return
    hasExitedIntro = true
    isActive.value = false
    logoStore.setShowLogo(true)
    const retainedQuery = resolveRetainedQueryFromRoute(route)

    if (hasSelectedCharacterGender.value) {
        router.push({
            path: '/home',
            query: retainedQuery
        })
        if (ueManager) {
            const isMale = userStore.userInfos.characterGender === 0 ? true : false

            ueManager.dasCustomMessage.MessageFromWeb('SetRoleMale', isMale)
        }
    } else {
        router.push({
            path: '/select',
            query: retainedQuery
        })
    }
}

onUnmounted(() => {
    if (mockTimer) clearInterval(mockTimer)
})
</script>

<style scoped lang="scss">
.loading-page-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}

.bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cloud {
    position: absolute;
    z-index: 1;
}

// UI1 样式
.loading-scene {
    position: relative;
    width: 100%;
    height: 100%;

    .cloud-top {
        top: 0;
        right: 100px;
        width: 1356px;
        height: 628px;
    }

    .cloud-bottom-left {
        bottom: -70px;
        left: -400px;
        width: 715px;
        height: 322px;
        opacity: 0.6;
    }

    .center-content {
        position: absolute;
        z-index: 2;
        top: 54%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title-img {
        width: 1245px;
    }

    .subtitle {
        color: #fff;
        text-align: center;
        text-shadow: 0 0 8px rgba(232, 190, 115, 0.8);
        font-family: 'Source Han Serif CN';
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 15px;
        margin-bottom: 210px;
    }

    .progress-bar-wrapper {
        width: 500px;
        max-width: 70vw;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #6bb5f0, #a8d8ff);
        border-radius: 4px;
        transition: width 0.1s linear;
    }
}

// UI2 样式
.intro-scene {
    position: relative;
    width: 100%;
    height: 100%;

    .skip-button {
        position: absolute;
        top: 28px;
        right: 28px;
        z-index: 3;
        padding: 5px 20px;
        border-radius: 10px;
        background: rgba(26, 21, 13, 0.7);
        color: #fff;
        font-family: 'Source Han Serif CN';
        font-size: 28px;
        font-weight: 700;
        cursor: pointer;
    }

    .cloud-top-right {
        top: 0;
        right: 0;
        width: 617px;
        height: 367px;
        aspect-ratio: 116/69;
    }

    .intro-content {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .intro-title {
        color: #fff;
        text-align: center;
        font-size: 60px;
        font-weight: 900;
        letter-spacing: 20px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .intro-text-wrapper {
        position: relative;
        width: 1254px;
        height: 382px;
        margin-top: 90px;
    }

    .content-bg {
        width: 100%;
        display: block;
    }

    .intro-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        color: #fff;
        text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        font-family: 'Source Han Serif CN';
        font-size: 30px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%;
        text-indent: 60px;
    }
}
</style>
