<template>
    <div class="chapter-two-container"></div>
    <Dialogue @complete="handleDialogueComplete" />
</template>

<script setup lang="ts">
import { useDasUE } from '@/hooks/useDasUEHook'
import { useMissionStore } from '@/stores/mission'
import { useDialogueStore } from '@/stores/dialogue'
import { useCollectStore } from '@/stores/collect'
import { useHomeModeStore } from '@/stores/homeMode'
import { useImmersiveStore } from '@/stores/immersive'
import { TreasureList } from '@/config/Treasure'
import { saveCard, completeDailyTask } from '@/api/home/index'
import {
    chapter3TriggerPoints,
    chapter3TreasureIntro,
    dialogueOne,
    dialogueTwo,
    dialogueThree
} from '@/config/Chapter3'
import { useShapeListener } from '@/hooks/useShapeListener'
import { useCustomLayer } from '@/hooks/useCustomLayer'
import { ChapterEnum } from '@/config/ChapterAll'

const Dialogue = defineAsyncComponent(() => import('../Dialogue.vue'))

let ueManager: any = null
const LISTENER_ID = 'ChapterThree_TriggerPointListener'
const missionStore = useMissionStore()
const dialogueStore = useDialogueStore()
const collectStore = useCollectStore()
const homeModeStore = useHomeModeStore()
const immersiveStore = useImmersiveStore()

const CHAPTER_ONE_COLLECT_COINS = 50
let rewardDialogueTimer: number | null = null
let blessingSequenceTimer: number | null = null

const { addCustomGizmoLayer, clearCustomGizmoLayer } = useCustomLayer(chapter3TriggerPoints)

const emit = defineEmits<{
    (e: 'end', chapter: number): void
}>()

const clearRewardDialogueTimer = () => {
    if (rewardDialogueTimer !== null) {
        window.clearTimeout(rewardDialogueTimer)
        rewardDialogueTimer = null
    }
}

const clearBlessingSequenceTimer = () => {
    if (blessingSequenceTimer !== null) {
        window.clearTimeout(blessingSequenceTimer)
        blessingSequenceTimer = null
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
        desc: treasureInfo?.tagName === 'BSG_BaoZang' ? chapter3TreasureIntro : [],
        coins: CHAPTER_ONE_COLLECT_COINS
    })

    const collectInfoDuration = Math.max(
        ...chapter3TreasureIntro.map(item => item.duration * 1000),
        2000 // 最短展示2秒
    )

    clearRewardDialogueTimer()
    rewardDialogueTimer = window.setTimeout(() => {
        dialogueStore.setDialogueList(dialogueTwo)
        rewardDialogueTimer = null
    }, collectInfoDuration)
}

// 对话播放完毕
const handleDialogueComplete = (type: string, blessing?: string) => {
    if (type === 'target') {
        // 显示任务指引
        missionStore.setShowMission(true)
        homeModeStore.resumeRoam()
    } else if (type === 'bless') {
        ueManager.dasCustomMessage.MessageFromWeb('SetKongMingDengVisible', true)
        ueManager.dasCustomMessage.MessageFromWeb('SetKongMingDengText', blessing)
        ueManager.dasCustomMessage.MessageFromWeb('FreeKongMingDeng', '')

        clearBlessingSequenceTimer()
        blessingSequenceTimer = window.setTimeout(() => {
            ueManager.dasCustomMessage.MessageFromWeb('SetKongMingDengVisible', false)
            immersiveStore.enterImmersiveMode()
            ueManager.dasLevelSequenceControl.setSequence('/Game/JHS_Video/BSG_KongMingDeng')

            blessingSequenceTimer = null
        }, 5000) // 5秒后自动关闭孔明灯
    } else if (type === 'end') {
        emit('end', ChapterEnum.BaiSuiGong)
    }
}

const triggerPointListener = (_shapeID: string, shapeName: string) => {
    if (shapeName === 'Shape_山门口') {
        homeModeStore.pauseRoam()
        dialogueStore.setDialogueList(dialogueOne) // 进入触发点后显示对话
    } else if (shapeName === 'Shape_五百罗汉堂') {
        // TODO: 寻找宝藏
    }
}

const triggerPointUnListener = () => {}

const { registerTriggerPoints, removeTriggerPointListeners } = useShapeListener(
    LISTENER_ID,
    chapter3TriggerPoints,
    triggerPointListener,
    triggerPointUnListener
)

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
        ueManager.dasScene.setWeather('SetTimeOfDay', '16:00')
        ueManager.dasWatchGuideLine.setCurrentGuideLineRouteName('BSGRoad1') // 出生点到宝藏的引导线

        registerTriggerPoints(ueManager)
        addCustomGizmoLayer(ueManager)

        // 监听自定义事件
        ueManager.viewer.addResponseEventListener('CustomMessage', (json: any) => {
            const obj = JSON.parse(json)
            if (obj.class == 'CustomMessage' && obj.messageName === 'JHSPickup') {
                // 百岁宫宝藏拾取事件
                showChapterReward(obj.message)
            }
        })

        // 监听交互动画播完事件
        ueManager.viewer.addResponseEventListener('LevelSequenceControl', (json: any) => {
            const obj = JSON.parse(json)
            if (obj.class == 'LevelSequenceControl' && obj.message === 'sequenceFinished') {
                immersiveStore.exitImmersiveMode()
                completeDailyTask('LANTERN_PRAYER').catch(() => {})
                dialogueStore.setDialogueList(dialogueThree)
            }
        })
    })
})

onBeforeUnmount(() => {
    clearRewardDialogueTimer()
    clearBlessingSequenceTimer()
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
