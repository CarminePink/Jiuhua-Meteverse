<template>
    <div class="chapter-two-container">
        <Question
            :visible="questionVisible"
            @close="handleQuestionClose"
            @completed="handleQuestionCompleted"
        />
        <VideoModal :visible="videoVisible" @close="handleVideoClose" />
    </div>
    <Dialogue @complete="handleDialogueComplete" />
</template>

<script setup lang="ts">
import { ChapterEnum } from '@/config/ChapterAll'
import { useDasUE } from '@/hooks/useDasUEHook'
import { useChapterStore } from '@/stores/chapter'
import { usePlotInfoStore } from '@/stores/plotInfo'
import { useMissionStore } from '@/stores/mission'
import { useDialogueStore } from '@/stores/dialogue'
import { useImmersiveStore } from '@/stores/immersive'
import {
    chapter2TriggerPoints,
    chapter2IntroOne,
    chapter2TreasureIntro,
    dialogueOne,
    dialogueTwo,
    dialogueThree
} from '@/config/Chapter2'
import { useShapeListener } from '@/hooks/useShapeListener'
import { useCustomLayer } from '@/hooks/useCustomLayer'
import { useCollectStore } from '@/stores/collect'
import { TreasureList } from '@/config/Treasure'
import { saveCard, completeDailyTask } from '@/api/home/index'
import Question from './Question.vue'
import VideoModal from './VideoModal.vue'

const Dialogue = defineAsyncComponent(() => import('../Dialogue.vue'))

let ueManager: any = null
const LISTENER_ID = 'ChapterTwo_TriggerPointListener'
const chapterStore = useChapterStore()
const collectStore = useCollectStore()
const plotInfoStore = usePlotInfoStore()
const missionStore = useMissionStore()
const dialogueStore = useDialogueStore()
const immersiveStore = useImmersiveStore()
const questionVisible = ref(false)
const videoVisible = ref(false)

const { addCustomGizmoLayer, clearCustomGizmoLayer } = useCustomLayer(chapter2TriggerPoints)

const emit = defineEmits<{
    (e: 'end', chapter: number): void
}>()

const CHAPTER_ONE_COLLECT_COINS = 50
let rewardDialogueTimer: number | null = null

const clearRewardDialogueTimer = () => {
    if (rewardDialogueTimer !== null) {
        window.clearTimeout(rewardDialogueTimer)
        rewardDialogueTimer = null
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
        desc: treasureInfo?.tagName === 'BP_YSD_BaoZang' ? chapter2TreasureIntro : [],
        coins: CHAPTER_ONE_COLLECT_COINS
    })

    const collectInfoDuration = Math.max(
        ...chapter2TreasureIntro.map(item => item.duration * 1000),
        2000 // 最短展示2秒
    )

    clearRewardDialogueTimer()
    rewardDialogueTimer = window.setTimeout(() => {
        dialogueStore.setDialogueList(dialogueThree)
        rewardDialogueTimer = null
    }, collectInfoDuration)
}

// 对话播放完毕
const handleDialogueComplete = (type: string) => {
    if (type === 'answer') {
        questionVisible.value = true
        ueManager?.dasElectron?.setMousePassThrough(true)
    } else if (type === 'answer_pass') {
        // 答题通过
        missionStore.setShowMission(true)
    } else if (type === 'end') {
        videoVisible.value = true
        ueManager?.dasElectron?.setMousePassThrough(true)
    }
}

const handleQuestionClose = () => {
    questionVisible.value = false
    ueManager?.dasElectron?.setMousePassThrough(false)
}

const handleQuestionCompleted = () => {
    completeDailyTask('QUIZ_CHALLENGE').catch(() => {})
    questionVisible.value = false
    ueManager?.dasElectron?.setMousePassThrough(false)
    dialogueStore.setDialogueList(dialogueTwo)
}

const handleVideoClose = () => {
    videoVisible.value = false
    ueManager?.dasElectron?.setMousePassThrough(false)
    immersiveStore.enterImmersiveMode()
    ueManager.dasLevelSequenceControl.setSequence('/Game/JHS_Video/YSD_YanHua')
}

const triggerPointListener = (_shapeID: string, shapeName: string) => {
    if (shapeName === 'Shape_月身殿NPC') {
        dialogueStore.setDialogueList(dialogueOne) // 进入触发点后显示对话
    } else {
        switch (shapeName) {
            case 'Shape_月身殿山门':
                chapterStore.setChapterPlotInfo(chapter2IntroOne.map(item => item.text))
                break
            default:
                break
        }

        plotInfoStore.setShowPlotInfo(true)
    }
}

const triggerPointUnListener = () => {
    plotInfoStore.setShowPlotInfo(false)
}

const { registerTriggerPoints, removeTriggerPointListeners } = useShapeListener(
    LISTENER_ID,
    chapter2TriggerPoints,
    triggerPointListener,
    triggerPointUnListener
)

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
        ueManager.dasScene.setWeather('SetTimeOfDay', '16:36')
        ueManager.dasWatchGuideLine.setCurrentGuideLineRouteName('YSDRoad1') // 出生点到长廊的引导线

        registerTriggerPoints(ueManager)
        addCustomGizmoLayer(ueManager)

        // 监听自定义事件
        ueManager.viewer.addResponseEventListener('CustomMessage', (json: any) => {
            const obj = JSON.parse(json)
            if (obj.class == 'CustomMessage' && obj.messageName === 'JHSPickup') {
                // 月身殿宝藏拾取事件
                showChapterReward(obj.message)
            }
        })

        // 监听交互动画播完事件
        ueManager.viewer.addResponseEventListener('LevelSequenceControl', (json: any) => {
            const obj = JSON.parse(json)
            if (obj.class == 'LevelSequenceControl' && obj.message === 'sequenceFinished') {
                immersiveStore.exitImmersiveMode()
                emit('end', ChapterEnum.YueShenDian)
            }
        })
    })
})

onBeforeUnmount(() => {
    clearRewardDialogueTimer()

    if (questionVisible.value || videoVisible.value) {
        ueManager?.dasElectron?.setMousePassThrough(false)
    }
    questionVisible.value = false
    videoVisible.value = false
    immersiveStore.resetImmersiveMode()

    if (ueManager) {
        removeTriggerPointListeners(ueManager)
        clearCustomGizmoLayer()
        ueManager.viewer.removeResponseEventListener('CustomMessage')
        ueManager.viewer.removeResponseEventListener('LevelSequenceControl')
    }
})
</script>

<style scoped lang="scss"></style>
