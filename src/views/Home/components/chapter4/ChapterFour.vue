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
import { TreasureList } from '@/config/Treasure'
import { saveCard, completeDailyTask } from '@/api/home/index'
import { ChapterEnum } from '@/config/ChapterAll'
import {
    chapter4TriggerPoints,
    chapter4TreasureIntro,
    dialogueOne,
    dialogueTwo,
    dialogueThree,
    dialogueFour
} from '@/config/Chapter4'
import { useShapeListener } from '@/hooks/useShapeListener'
import { useCustomLayer } from '@/hooks/useCustomLayer'

const Dialogue = defineAsyncComponent(() => import('../Dialogue.vue'))

let ueManager: any = null
const LISTENER_ID = 'ChapterFour_TriggerPointListener'
const missionStore = useMissionStore()
const dialogueStore = useDialogueStore()
const collectStore = useCollectStore()
const homeModeStore = useHomeModeStore()

const emit = defineEmits<{
    (e: 'end', chapter: number): void
}>()

const CHAPTER_ONE_COLLECT_COINS = 50

const { addCustomGizmoLayer, clearCustomGizmoLayer } = useCustomLayer(chapter4TriggerPoints)

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
        desc: treasureInfo?.tagName === 'QYS_BaoZang' ? chapter4TreasureIntro : [],
        coins: CHAPTER_ONE_COLLECT_COINS
    })
}

// 对话播放完毕
const handleDialogueComplete = (type: string) => {
    if (type === 'target') {
        // 显示任务指引
        missionStore.setShowMission(true)
        homeModeStore.resumeRoam()
    } else if (type === 'resumeRoam') {
        homeModeStore.resumeRoam()
    } else if (type === 'end') {
        emit('end', ChapterEnum.QiYuanSi)
    }
}

const triggerPointListener = (_shapeID: string, shapeName: string) => {
    if (shapeName === 'Shape_万佛殿') {
        // TODO: 触发宝藏收集
    } else {
        // 触发点播放对白时暂停自动漫游
        homeModeStore.pauseRoam()

        switch (shapeName) {
            case 'Shape_祇园寺山门':
                dialogueStore.setDialogueList(dialogueOne) // 进入触发点后显示对话
                break
            case 'Shape_天王殿':
                dialogueStore.setDialogueList(dialogueTwo)
                break
            case 'Shape_大雄宝殿':
                dialogueStore.setDialogueList(dialogueThree)
                break
            case 'Shape_卧佛殿':
                dialogueStore.setDialogueList(dialogueFour)
                break
            default:
                homeModeStore.resumeRoam() // 未匹配到对白的触发点，恢复漫游
                break
        }
    }
}

const triggerPointUnListener = (_shapeID: string, _shapeName: string) => {}

const { registerTriggerPoints, removeTriggerPointListeners } = useShapeListener(
    LISTENER_ID,
    chapter4TriggerPoints,
    triggerPointListener,
    triggerPointUnListener
)

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
        ueManager.dasScene.setWeather('SetTimeOfDay', '06:48')
        ueManager.dasWatchGuideLine.setCurrentGuideLineRouteName('QYSRoad1') // 出生点到卧佛殿的引导线

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
    })
})

onBeforeUnmount(() => {
    if (ueManager) {
        removeTriggerPointListeners(ueManager)
        clearCustomGizmoLayer()
        ueManager.viewer.removeResponseEventListener('CustomMessage')
    }
})
</script>

<style scoped lang="scss"></style>
