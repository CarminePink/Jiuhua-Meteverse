<template>
    <div class="chapter-one-container">
        <Release :visible="releaseVisible" @confirm="handleRelease" @close="handleReleaseClose" />
    </div>
    <Dialogue @complete="handleDialogueComplete" />
</template>

<script setup lang="ts">
import Release from './Release.vue'
import { useDasUE } from '@/hooks/useDasUEHook'
import { useChapterStore } from '@/stores/chapter'
import { useCollectStore } from '@/stores/collect'
import { usePlotInfoStore } from '@/stores/plotInfo'
import { useMissionStore } from '@/stores/mission'
import { useDialogueStore } from '@/stores/dialogue'
import { useImmersiveStore } from '@/stores/immersive'
import {
    chapter1TriggerPoints,
    chapter1IntroOne,
    chapter1IntroTwo,
    chapter1IntroThree,
    chapter1TreasureIntro,
    dialogueOne,
    dialogueTwo,
    dialogueThree,
    dialogueFour
} from '@/config/Chapter1'
import { useShapeListener } from '@/hooks/useShapeListener'
import { useCustomLayer } from '@/hooks/useCustomLayer'
import { ChapterEnum } from '@/config/ChapterAll'
import { TreasureList } from '@/config/Treasure'
import { saveCard, completeDailyTask } from '@/api/home/index'

const Dialogue = defineAsyncComponent(() => import('../Dialogue.vue'))

let ueManager: any = null
const LISTENER_ID = 'ChapterOne_TriggerPointListener'
const chapterStore = useChapterStore()
const collectStore = useCollectStore()
const plotInfoStore = usePlotInfoStore()
const missionStore = useMissionStore()
const dialogueStore = useDialogueStore()
const immersiveStore = useImmersiveStore()

const {
    customGizmoLayers,
    addCustomGizmoLayer,
    setCustomGizmoLayerVisible,
    clearCustomGizmoLayer
} = useCustomLayer(chapter1TriggerPoints)

const releaseVisible = ref(false)
const currentSequence = ref('')

const emit = defineEmits<{
    (e: 'end', chapter: number): void
}>()

const CHAPTER_ONE_COLLECT_COINS = 50
let missionPanelTimer: number | null = null

const clearMissionPanelTimer = () => {
    if (missionPanelTimer !== null) {
        window.clearTimeout(missionPanelTimer)
        missionPanelTimer = null
    }
}

// 显示宝藏奖励
const showChapterReward = async (payload: string) => {
    const treasureInfo = TreasureList.find(item => item.tagName === payload)

    if (!treasureInfo) {
        return
    }

    try {
        await saveCard(treasureInfo.tagName)
    } catch (error) {
        console.error('保存卡片信息失败:', error)
    }

    completeDailyTask('TREASURE_HUNT').catch(() => {})

    collectStore.showCollectInfo({
        name: treasureInfo?.name ?? '',
        desc: treasureInfo?.tagName === 'HCS_BaoZang' ? chapter1TreasureIntro : [],
        coins: CHAPTER_ONE_COLLECT_COINS
    })
}

// 对话播放完毕
const handleDialogueComplete = (type: string) => {
    if (type === 'release') {
        releaseVisible.value = true
        ueManager?.dasElectron?.setMousePassThrough(true)
    } else if (type === 'bells') {
        currentSequence.value = 'bells'
        immersiveStore.enterImmersiveMode()
        ueManager.dasLevelSequenceControl.setSequence('/Game/JHS_Video/HCS_QiaoZHong')
    } else if (type === 'end') {
        emit('end', ChapterEnum.HuaChengSi)
    }
}

// 放生弹窗关闭
const handleReleaseClose = () => {
    releaseVisible.value = false
    ueManager?.dasElectron?.setMousePassThrough(false)
}

// 放生事件
const handleRelease = () => {
    releaseVisible.value = false
    ueManager?.dasElectron?.setMousePassThrough(false)
    currentSequence.value = 'release'
    immersiveStore.enterImmersiveMode()
    ueManager.dasLevelSequenceControl.setSequence('/Game/JHS_Video/HSC_FangSheng')
}

// 进入触发点事件回调
const triggerPointListener = (_shapeID: string, shapeName: string) => {
    if (shapeName === 'Shape_天王殿') {
        // TODO:
    } else if (shapeName === 'Shape_娘娘塔') {
        dialogueStore.setDialogueList(dialogueOne) // 进入触发点后显示对话
    } else if (shapeName === 'Shape_月牙池') {
        dialogueStore.setDialogueList(dialogueTwo) // 进入触发点后显示对话
    } else {
        switch (shapeName) {
            case 'Shape_化城寺石狮子':
                chapterStore.setChapterPlotInfo(chapter1IntroOne.map(item => item.text))
                break
            case 'Shape_四大天王殿':
                chapterStore.setChapterPlotInfo(chapter1IntroTwo.map(item => item.text))
                break
            case 'Shape_大雄宝殿':
                chapterStore.setChapterPlotInfo(chapter1IntroThree.map(item => item.text))
                ueManager.dasWatchGuideLine.setCurrentGuideLineRouteName('HCSRoad2') // 大雄宝殿到放生池的引导线
                break
            default:
                break
        }

        plotInfoStore.setShowPlotInfo(true)
    }
}

// 离开触发点事件回调
const triggerPointUnListener = (_shapeID: string, shapeName: string) => {
    plotInfoStore.setShowPlotInfo(false)

    if (shapeName === 'Shape_化城寺石狮子') {
        clearMissionPanelTimer()
        missionPanelTimer = window.setTimeout(() => {
            missionStore.setShowMission(true) // 离开触发点后显示任务面板
            missionPanelTimer = null
        }, 2000)
    }
}

const { registerTriggerPoints, removeTriggerPointListeners } = useShapeListener(
    LISTENER_ID,
    chapter1TriggerPoints,
    triggerPointListener,
    triggerPointUnListener
)

defineExpose({
    customGizmoLayers,
    setCustomGizmoLayerVisible
})

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE

        ueManager.dasScene.setWeather('SetTimeOfDay', '12:00')
        ueManager.dasWatchGuideLine.setCurrentGuideLineRouteName('HCSRoad1') // 出生点到大雄宝殿的引导线
        addCustomGizmoLayer(ueManager)
        registerTriggerPoints(ueManager)

        // 监听自定义事件
        ueManager.viewer.addResponseEventListener('CustomMessage', (json: any) => {
            const obj = JSON.parse(json)
            if (obj.class == 'CustomMessage' && obj.messageName === 'JHSPickup') {
                // 化城寺宝藏拾取事件
                showChapterReward(obj.message)
            }
        })

        // 监听交互动画播完事件
        ueManager.viewer.addResponseEventListener('LevelSequenceControl', (json: any) => {
            const obj = JSON.parse(json)
            if (obj.class == 'LevelSequenceControl' && obj.message === 'sequenceFinished') {
                immersiveStore.exitImmersiveMode()
                // 判断当前播放的是什么剧情，来决定后续动作
                if (currentSequence.value === 'release') {
                    completeDailyTask('RELEASE_INTERACT').catch(() => {})
                    dialogueStore.setDialogueList(dialogueThree)
                } else if (currentSequence.value === 'bells') {
                    ueManager.dasScene.setWeather('SetTimeOfDay', '16:30')
                    dialogueStore.setDialogueList(dialogueFour)
                    currentSequence.value = '' // 重置当前剧情状态
                }
            }
        })
    })
})

onBeforeUnmount(() => {
    clearMissionPanelTimer()

    if (releaseVisible.value) {
        ueManager?.dasElectron?.setMousePassThrough(false)
    }
    releaseVisible.value = false
    immersiveStore.resetImmersiveMode()

    if (ueManager) {
        removeTriggerPointListeners(ueManager)
        clearCustomGizmoLayer()
        ueManager.viewer.removeResponseEventListener('Scene')
        ueManager.viewer.removeResponseEventListener('CustomMessage')
        ueManager.viewer.removeResponseEventListener('LevelSequenceControl')
    }
})
</script>

<style scoped lang="scss"></style>
