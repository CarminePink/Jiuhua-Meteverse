<template>
    <div class="app-wrapper" @contextmenu="disableRightClick">
        <div class="display-logo" v-show="isShowLogo">
            <img class="img-logo" :src="currentChapterLogo" />
        </div>
        <app-main />
        <scene-viewer v-show="showSceneViewer" />
        <div class="right-top-tools" v-if="isShowTopTools">
            <SystemTool />
            <OperationTool v-if="isShowOperationTool" />
        </div>
        <!-- <div class="test-pass-through">
            <div class="btn-test" @click="handleSetPassThrough(true)">开启穿透</div>
            <div class="btn-test" @click="handleSetPassThrough(false)">关闭穿透</div>
        </div> -->
        <!-- <div class="btn-camera" @click="handleGetCamera">获取视角</div>
        <div class="btn-camera2" @click="handlePoints">多线段点位</div>
        <div class="btn-camera3" @click="handleComplete">创建多线段</div> -->
    </div>
</template>

<script setup lang="ts">
import AppMain from './AppMain.vue'
import SceneViewer from '@/components/scene/SceneViewer.vue'
import SystemTool from '@/components/tools/SystemTool.vue'
import OperationTool from '@/components/tools/OperationTool.vue'
import { useRouter } from 'vue-router'
import { useDasUE } from '@/hooks/useDasUEHook'
import { useLogoStore } from '@/stores/logo'
import { useChapterStore } from '@/stores/chapter'
import { useImmersiveStore } from '@/stores/immersive'
import { ChapterEnum } from '@/config/ChapterAll'
import chapter1Logo from '@/assets/images/home/chapter_1.png'
import chapter2Logo from '@/assets/images/home/chapter_2.png'
import chapter3Logo from '@/assets/images/home/chapter_3.png'
import chapter4Logo from '@/assets/images/home/chapter_4.png'

let ueManager: any = null
const router = useRouter()
const logoStore = useLogoStore()
const chapterStore = useChapterStore()
const immersiveStore = useImmersiveStore()
const showSceneViewer = ref(true)
const chapterLogoMap: Record<ChapterEnum, string> = {
    [ChapterEnum.HuaChengSi]: chapter1Logo,
    [ChapterEnum.YueShenDian]: chapter2Logo,
    [ChapterEnum.BaiSuiGong]: chapter3Logo,
    [ChapterEnum.QiYuanSi]: chapter4Logo
}

const currentBusinessPath = computed(() => {
    return router.currentRoute.value.fullPath.split('?')[0].split('#')[0]
})

const isShowControl = computed(() => {
    return currentBusinessPath.value !== '/'
})

const isShowOperationTool = computed(() => {
    return currentBusinessPath.value === '/home'
})

const isShowLogo = computed(() => {
    return logoStore.isShowLogo && !immersiveStore.isImmersiveMode
})

const isShowTopTools = computed(() => {
    return isShowControl.value && !immersiveStore.isImmersiveMode
})

const currentChapterLogo = computed(() => {
    return chapterLogoMap[chapterStore.currentChapter] ?? chapter1Logo
})

const handleGetCamera = async () => {
    if (!ueManager) return

    const result = await ueManager.dasCamera.getCameraFlyInfoLLH()

    console.log('当前视角：', result)
}

const handlePoints = async () => {
    await ueManager.dasPolylineTool.setToCurrent()
}

const handleComplete = async () => {
    // 获取所有工具属性
    const toolData = await ueManager.dasPolylineTool.getAll()
    console.log('工具数据:', toolData)
}

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()

    onViewerReady(async () => {
        ueManager = dasUE
        ueManager.dasScene.setWeather('SetWeatherType', '晴')
        ueManager.dasScene.setWeather('SetTimeOfDay', '11:00')
        ueManager.dasScene.setWeather('SetSunAngle', '300')

        chapterStore.setCurrentChapter(ChapterEnum.HuaChengSi) // 设置当前章节为第一章
    })
})
const handleSetPassThrough = (val: boolean) => {
    if (!ueManager) return
    ueManager.dasElectron.setMousePassThrough(val)
    console.log('setMousePassThrough:', val)
}

const disableRightClick = (event: MouseEvent) => {
    event.preventDefault()
}
</script>

<style scoped lang="scss">
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100%;

    .display-logo {
        position: absolute;
        z-index: 1001;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        .img-logo {
            width: 549px;
            height: 116px;
        }
    }

    .right-top-tools {
        position: absolute;
        z-index: 2500;
        top: 40px;
        right: 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .btn-camera {
        width: 74px;
        height: 74px;
        cursor: pointer;
        background-color: red;
        position: absolute;
        top: 15px;
        right: 750px;
        z-index: 2500;
    }

    .btn-camera2 {
        width: 74px;
        height: 74px;
        cursor: pointer;
        background-color: blue;
        position: absolute;
        top: 15px;
        right: 600px;
        z-index: 2500;
    }

    .btn-camera3 {
        width: 74px;
        height: 74px;
        cursor: pointer;
        background-color: green;
        position: absolute;
        top: 15px;
        right: 500px;
        z-index: 2500;
    }

    .test-pass-through {
        position: absolute;
        z-index: 2500;
        top: 40px;
        right: 200px;
        display: flex;
        gap: 10px;

        .btn-test {
            padding: 8px 16px;
            cursor: pointer;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            font-size: 14px;
            user-select: none;

            &:hover {
                background-color: rgba(0, 0, 0, 0.8);
            }
        }
    }
}
</style>
