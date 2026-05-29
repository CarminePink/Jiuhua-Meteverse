<template>
    <div class="home-container">
        <!-- <button class="spline-edit-btn" @click="handleSplineEditClick">
            {{ isSplineEditMode ? '结束路线编辑' : '编辑漫游路线' }}
        </button> -->
        <img
            class="icon-back"
            src="@/assets/images/home/icon_back.png"
            alt=""
            v-show="!isImmersiveMode"
            @click="handleBack"
        />
        <div v-if="showConclusion" class="conclusion">
            <p class="conclusion-text" v-for="(line, idx) in conclusionTexts" :key="idx">
                {{ line }}
            </p>
        </div>
        <HomeMenu v-show="!isImmersiveMode" />
        <PlotInfo :texts="plotTexts" />
        <MissionInfo :target="missionTarget" :clue="missionClue" @guide="handleTreasureGuide" />
        <CollectInfo />
        <!-- <ViewControl @view-change="handleViewChange" /> -->
        <MarkerDetail
            :visible="markerDetailVisible"
            :name="currentMarker.name"
            :description="currentMarker.description"
            :video="currentMarker.video"
            @close="markerDetailVisible = false"
        />
        <component :is="renderChapterComponent" @end="handleChapterEnd" />
    </div>
</template>

<script setup lang="ts">
import DasSpline from '@/components/dasUE/layer/DasSplineLayer'
import DasPointEditTool from '@/components/dasUE/tool/DasPointEditTool'
import { useDasUE } from '@/hooks/useDasUEHook'
import { useChapterStore } from '@/stores/chapter'
import { useCollectStore } from '@/stores/collect'
import { useMapStore } from '@/stores/map'
import { useDialogueStore } from '@/stores/dialogue'
import { usePlotInfoStore } from '@/stores/plotInfo'
import { HomeVisitMode, useHomeModeStore } from '@/stores/homeMode'
import { useImmersiveStore } from '@/stores/immersive'
import { useMissionStore } from '@/stores/mission'
import { useMarkerPoints } from '@/hooks/useMarkerPoints'
import { ChapterEnum } from '@/config/ChapterAll'
import { chapter1RoamPath, chapter1MarkerPoints } from '@/config/Chapter1'
import { chapter2RoamPath, chapter2MarkerPoints } from '@/config/Chapter2'
import { chapter3RoamPath, chapter3MarkerPoints } from '@/config/Chapter3'
import { TreasureList } from '@/config/Treasure'
import { chapter4RoamPath, dialogueEnd, chapter4MarkerPoints } from '@/config/Chapter4'
import { getObtainedCards, completeDailyTask } from '@/api/home/index'
import { resolveRetainedQueryFromRoute } from '@/router/query'

const HomeMenu = defineAsyncComponent(() => import('./components/HomeMenu.vue'))
const PlotInfo = defineAsyncComponent(() => import('./components/PlotInfo.vue'))
const MissionInfo = defineAsyncComponent(() => import('./components/MissionInfo.vue'))
const CollectInfo = defineAsyncComponent(() => import('./components/CollectInfo.vue'))
const MarkerDetail = defineAsyncComponent(() => import('./components/chapter1/MarkerDetail.vue'))
const ChapterOne = defineAsyncComponent(() => import('./components/chapter1/ChapterOne.vue'))
const ChapterTwo = defineAsyncComponent(() => import('./components/chapter2/ChapterTwo.vue'))
const ChapterThree = defineAsyncComponent(() => import('./components/chapter3/ChapterThree.vue'))
const ChapterFour = defineAsyncComponent(() => import('./components/chapter4/ChapterFour.vue'))
const ViewControl = defineAsyncComponent(() => import('./components/ViewControl.vue'))

const router = useRouter()
const route = useRoute()
const chapterStore = useChapterStore()
const collectStore = useCollectStore()
const dialogueStore = useDialogueStore()
const mapStore = useMapStore()
const plotInfoStore = usePlotInfoStore()
const homeModeStore = useHomeModeStore()
const immersiveStore = useImmersiveStore()
const missionStore = useMissionStore()
let ueManager: any = null

// 当前章节的标记点配置映射
const chapterMarkerPointsMap: Partial<Record<ChapterEnum, any[]>> = {
    [ChapterEnum.HuaChengSi]: chapter1MarkerPoints,
    [ChapterEnum.YueShenDian]: chapter2MarkerPoints,
    [ChapterEnum.BaiSuiGong]: chapter3MarkerPoints,
    [ChapterEnum.QiYuanSi]: chapter4MarkerPoints
}

const getCurrentChapterMarkerPoints = () => {
    return chapterMarkerPointsMap[chapterStore.currentChapter] ?? []
}

const { markerDetailVisible, currentMarker, addMarkerPoints, onMarkerClick, clearMarkerPoints } =
    useMarkerPoints(getCurrentChapterMarkerPoints())

let chapterTransitionTimer: number | null = null
let currentSplineLayer: DasSpline | null = null

// 鼠标指针隐藏（全局注入样式，不影响鼠标事件传递）
let cursorStyleEl: HTMLStyleElement | null = null
const roamSpeed = 300
const isSplineEditMode = ref(false)
const isManualModeSwitch = ref(false) // 手动切换模式标记，用于区分漫游结束回调来源
const showConclusion = ref(false)
const conclusionTexts = ref<string[]>([
    '本关卡完成！前方，仍有因缘待续。',
    '下一个目标点已在地图上标记。请前往该区域。'
])

const isImmersiveMode = computed(() => {
    return immersiveStore.isImmersiveMode
})

// 是否存在需要用户交互的非点击触发面板（用于控制鼠标穿透）
// 排除音频播放类：对白字幕(dialogue)、剧情介绍(plotInfo)、宝藏收集(collect)、结束语(conclusion)
const hasActivePanel = computed(() => {
    return missionStore.isShowMission
})

const renderChapterComponent = computed(() => {
    switch (chapterStore.currentChapter) {
        case 0:
            return ChapterOne
        case 1:
            return ChapterTwo
        case 2:
            return ChapterThree
        case 3:
            return ChapterFour
        default:
            return null
    }
})

const plotTexts = computed(() => {
    return chapterStore.chapterPlotInfo
}) // 章节剧情文本
const missionTarget = computed(() => {
    return chapterStore.chapterMissionTarget
}) // 任务目标
const missionClue = computed(() => {
    return chapterStore.chapterMissionClue
}) // 任务线索

const chapterRoamPathMap: Record<ChapterEnum, number[][]> = {
    [ChapterEnum.HuaChengSi]: chapter1RoamPath,
    [ChapterEnum.YueShenDian]: chapter2RoamPath,
    [ChapterEnum.BaiSuiGong]: chapter3RoamPath,
    [ChapterEnum.QiYuanSi]: chapter4RoamPath
}

// 获取当前章节的漫游路线坐标
const getCurrentChapterRoamPath = () => {
    return chapterRoamPathMap[chapterStore.currentChapter] ?? []
}

// 取消自动漫游
const stopSplineAutoMove = async () => {
    if (!ueManager?.dasSplineWalk) {
        return
    }

    try {
        await ueManager.dasSplineWalk.setEnableAutoMove(false)
    } catch (error) {
        console.error('停止样条自动漫游失败:', error)
    }
}

// 绑定样条漫游完成回调
const bindSplineWalkCompleteCallback = () => {
    if (!ueManager?.dasSplineWalk) {
        return
    }

    ueManager.dasSplineWalk.removeCallBack()
    ueManager.dasSplineWalk.addCallBack((obj: any) => {
        if (obj?.message === 'splineWalkCompleted') {
            // 手动切换模式触发的回调，不进行章节跳转
            if (isManualModeSwitch.value) {
                isManualModeSwitch.value = false
                return
            }

            // 剧情/对白暂停期间触发的回调，不进行章节跳转
            if (homeModeStore.isRoamPaused) {
                return
            }

            // 移除回调，防止重复触发
            ueManager.dasSplineWalk.removeCallBack()

            // 自动漫游结束，触发章节结束并跳转下一章节
            handleChapterEnd(chapterStore.currentChapter)
        }
    })
}

// 开启样条自动漫游状态（根据当前章节的漫游路线和访问模式）
const syncSplineAutoMove = async () => {
    if (!ueManager?.dasSplineWalk || !currentSplineLayer || isSplineEditMode.value) {
        return
    }

    if (homeModeStore.currentMode !== HomeVisitMode.Roam) {
        await stopSplineAutoMove()
        return
    }

    const roamPath = getCurrentChapterRoamPath()
    if (!roamPath.length) {
        await stopSplineAutoMove()
        return
    }

    try {
        await ueManager.dasSplineWalk.setSpeed(roamSpeed)
        await ueManager.dasSplineWalk.setEnableAutoMove(true)
    } catch (error) {
        console.error('启动样条自动漫游失败:', error)
    }
}

// 将当前样条图层绑定到行走器
const bindSplineLayerToWalk = async () => {
    if (!ueManager?.dasSplineWalk || !currentSplineLayer) {
        return
    }

    try {
        await ueManager.dasSplineWalk.setSplineActorByLayer(currentSplineLayer)
        bindSplineWalkCompleteCallback()
    } catch (error) {
        console.error('绑定样条线到行走器失败:', error)
    }
}

// 同步当前章节的漫游路线到样条图层
const syncSplinePath = async () => {
    if (!currentSplineLayer) {
        return
    }

    try {
        await currentSplineLayer.setPoints(getCurrentChapterRoamPath())
        await bindSplineLayerToWalk()
        await syncSplineAutoMove()
    } catch (error) {
        console.error('同步章节漫游路线失败:', error)
    }
}

// 创建样条图层并绑定到行走器
const createSplineLayer = async () => {
    if (!ueManager?.dasSplineLayer) {
        return
    }

    try {
        currentSplineLayer = await ueManager.dasSplineLayer.createInstance({
            param: {
                lineWidth: 50,
                points: getCurrentChapterRoamPath()
            }
        })
        currentSplineLayer?.setVisible(false) // 隐藏样条线

        await bindSplineLayerToWalk()
        await syncSplineAutoMove()
    } catch (error) {
        console.error('创建章节漫游样条线失败:', error)
    }
}

// 重新创建样条图层
const recreateSplineLayer = async () => {
    await clearSplineLayer()
    await createSplineLayer()
}

// 清除样条图层和相关状态
const clearSplineLayer = async () => {
    await stopSplineAutoMove()

    if (isSplineEditMode.value) {
        try {
            await DasPointEditTool.finishTool()
        } catch (error) {
            console.error('结束样条编辑失败:', error)
        }
        isSplineEditMode.value = false
    }

    if (ueManager?.dasSplineWalk) {
        ueManager.dasSplineWalk.removeCallBack()
    }

    if (!currentSplineLayer) {
        return
    }

    try {
        await currentSplineLayer.removeInstance(() => {})
    } catch (error) {
        console.error('清除章节漫游样条线失败:', error)
    } finally {
        currentSplineLayer = null
    }
}

// 开启样条图层编辑模式
const startSplineEdit = async () => {
    if (!currentSplineLayer) {
        return
    }

    try {
        await stopSplineAutoMove()
        await DasPointEditTool.editLayer(currentSplineLayer)
        await DasPointEditTool.setToCurrent()
        isSplineEditMode.value = true
    } catch (error) {
        console.error('启动样条编辑失败:', error)
    }
}

// 关闭样条图层编辑模式
const stopSplineEdit = async () => {
    if (!currentSplineLayer) {
        return
    }

    try {
        await DasPointEditTool.finishTool()
        isSplineEditMode.value = false
        const latestPoints = await currentSplineLayer.getPoints()
        console.log('当前章节漫游路线坐标:', latestPoints)
        await bindSplineLayerToWalk()
        await syncSplineAutoMove()
    } catch (error) {
        console.error('结束样条编辑失败:', error)
    }
}

const handleSplineEditClick = async () => {
    if (isSplineEditMode.value) {
        await stopSplineEdit()
        return
    }

    await startSplineEdit()
}

const chapterLevelMap: Record<ChapterEnum, string> = {
    [ChapterEnum.HuaChengSi]: 'HuaChengSi',
    [ChapterEnum.YueShenDian]: 'YueShenDian',
    [ChapterEnum.BaiSuiGong]: 'BaiSuiGong',
    [ChapterEnum.QiYuanSi]: 'QiYuanSi'
}

const chapterMarkerMap: Record<ChapterEnum, string> = {
    [ChapterEnum.HuaChengSi]: '化城寺',
    [ChapterEnum.YueShenDian]: '月身殿',
    [ChapterEnum.BaiSuiGong]: '百岁宫',
    [ChapterEnum.QiYuanSi]: '祇园寺'
}

const markerChapterMap: Record<string, ChapterEnum> = {
    化城寺: ChapterEnum.HuaChengSi,
    月身殿: ChapterEnum.YueShenDian,
    百岁宫: ChapterEnum.BaiSuiGong,
    祇园寺: ChapterEnum.QiYuanSi
}

const chapterGuideLineMap: Partial<Record<ChapterEnum, string>> = {
    [ChapterEnum.HuaChengSi]: 'HCSRoad1_2', // 四大天王殿到化城寺大雄宝殿的引导线
    [ChapterEnum.BaiSuiGong]: 'BSGRoad1_2', // 五百罗汉堂到宝藏的引导线
    [ChapterEnum.QiYuanSi]: 'QYSRoad1_3' // 大雄宝殿到万佛殿的引导线
}

const handleBack = () => {
    router.push({
        path: '/select',
        query: resolveRetainedQueryFromRoute(route)
    })
}

// 视角切换
const handleViewChange = async (type: string) => {
    if (ueManager && type) {
        await ueManager.dasScene.switchPawnType(type)
    }
}

// 宝藏指引
const handleTreasureGuide = async () => {
    const routeName = chapterGuideLineMap[chapterStore.currentChapter]

    if (!routeName || !ueManager?.dasWatchGuideLine) {
        return
    }

    try {
        await ueManager.dasWatchGuideLine.setCurrentGuideLineRouteName(routeName)
    } catch (error) {
        console.error('显示寻宝指引失败:', error)
    }
}

const clearChapterTransitionTimer = () => {
    if (chapterTransitionTimer !== null) {
        window.clearTimeout(chapterTransitionTimer)
        chapterTransitionTimer = null
    }
}

// 清除章节展示内容
const clearChapterPresentation = () => {
    clearChapterTransitionTimer()
    showConclusion.value = false
    plotInfoStore.setShowPlotInfo(false)
    chapterStore.setChapterPlotInfo([])
    dialogueStore.setShowDialogue(false)
    dialogueStore.clearDialogueList()
    homeModeStore.resumeRoam()
}

// 章节切换逻辑：更新当前章节状态、加载对应关卡、控制地图显示和标记点高亮
const switchChapter = (targetChapter: ChapterEnum, showMap = false) => {
    const currentChapter = chapterStore.currentChapter

    mapStore.setActiveMarker(chapterMarkerMap[targetChapter])
    mapStore.setShowMap(showMap)

    if (currentChapter === targetChapter) {
        return
    }

    clearChapterPresentation()
    chapterStore.setCurrentChapter(targetChapter)

    if (ueManager) {
        ueManager.dasScene.loadNextLevel(chapterLevelMap[targetChapter])
    }
}

// 地图标记点触发的章节跳转逻辑：根据标记点名称找到对应章节，进行章节切换
const handleMapChapterJump = (markerName: string) => {
    if (!Object.prototype.hasOwnProperty.call(markerChapterMap, markerName)) {
        return
    }

    const targetChapter = markerChapterMap[markerName]

    if (targetChapter === chapterStore.currentChapter) {
        mapStore.setActiveMarker(markerName)
        mapStore.setShowMap(false)
        return
    }

    switchChapter(targetChapter)
}

// 隐藏已拾取的宝藏
const hideObtainedTreasures = async () => {
    if (!ueManager?.dasInnerLayer) return

    try {
        const obtainedCards = await getObtainedCards()
        const obtainedTagNames = [
            ...new Set(
                (obtainedCards?.data ?? []).map((card: { cardCode: string }) => card.cardCode)
            )
        ]

        await Promise.all(
            obtainedTagNames.map(async tagName => {
                const treasure = TreasureList.find(item => item.tagName === tagName)
                if (!treasure) return

                const param = {
                    TagName: treasure.tagName
                }
                const layer = await ueManager.dasInnerLayer.createInstance(param)

                if (layer) {
                    await layer.setVisible(false)
                }
            })
        )
    } catch (error) {
        console.error('获取已拾取卡片信息失败:', error)
    }
}

const handleChapterEnd = async (chapter: number) => {
    // 上报章节完成任务
    const chapterTaskMap: Record<number, string> = {
        [ChapterEnum.HuaChengSi]: 'CHAPTER_ONE',
        [ChapterEnum.YueShenDian]: 'CHAPTER_TWO',
        [ChapterEnum.BaiSuiGong]: 'CHAPTER_THREE',
        [ChapterEnum.QiYuanSi]: 'CHAPTER_FOUR'
    }
    if (chapterTaskMap[chapter]) {
        completeDailyTask(chapterTaskMap[chapter]).catch(() => {})
    }

    // 章节四（祇园寺）单独处理：检查宝藏收集情况
    if (chapter === ChapterEnum.QiYuanSi) {
        try {
            const obtainedCards = await getObtainedCards()
            const obtainedTagNames = new Set(
                (obtainedCards?.data ?? []).map((card: { cardCode: string }) => card.cardCode)
            )
            const collectedCount = TreasureList.filter(t => obtainedTagNames.has(t.tagName)).length
            const allCollected = collectedCount === TreasureList.length

            if (allCollected) {
                conclusionTexts.value = [
                    '本关完成！恭喜四件宝物已集齐，即将揭晓金地藏完整传奇故事。'
                ]
            } else {
                conclusionTexts.value = [
                    `本关完成，恭喜已收集${collectedCount}件宝物，集齐4件宝物可揭晓金地藏完整的传奇故事，快去继续收集吧。`
                ]
            }

            showConclusion.value = true

            setTimeout(() => {
                showConclusion.value = false
                if (allCollected) {
                    dialogueStore.clearDialogueList()
                    dialogueStore.setDialogueList(dialogueEnd)
                }
            }, 3000)
        } catch (error) {
            console.error('获取宝藏收集信息失败:', error)
        }
        return
    }

    // 其他章节的原有逻辑
    let nextChapter = ChapterEnum.HuaChengSi

    conclusionTexts.value = [
        '本关卡完成！前方，仍有因缘待续。',
        '下一个目标点已在地图上标记。请前往该区域。'
    ]
    showConclusion.value = true

    switch (chapter) {
        case ChapterEnum.HuaChengSi: {
            nextChapter = ChapterEnum.YueShenDian
            break
        }

        case ChapterEnum.YueShenDian: {
            nextChapter = ChapterEnum.BaiSuiGong
            break
        }

        case ChapterEnum.BaiSuiGong: {
            nextChapter = ChapterEnum.QiYuanSi
            break
        }

        default:
            break
    }

    clearChapterTransitionTimer()
    chapterTransitionTimer = window.setTimeout(() => {
        switchChapter(nextChapter, true)
        chapterTransitionTimer = null
    }, 3000)
}

watch(
    () => mapStore.pendingJumpMarker,
    markerName => {
        if (!markerName) {
            return
        }

        mapStore.clearPendingChapterJump()
        handleMapChapterJump(markerName)
    }
)

watch(
    () => chapterStore.currentChapter,
    async () => {
        await syncSplinePath()

        // 切换章节时重新渲染标记点
        if (ueManager) {
            markerDetailVisible.value = false
            await clearMarkerPoints()
            await addMarkerPoints(ueManager, getCurrentChapterMarkerPoints())
        }
    }
)

watch(
    () => homeModeStore.currentMode,
    async (newMode, oldMode) => {
        // 仅从漫游模式手动切走时标记，避免漫游结束回调误触发章节跳转
        if (oldMode === HomeVisitMode.Roam && newMode !== HomeVisitMode.Roam) {
            isManualModeSwitch.value = true
        }
        await syncSplineAutoMove()
    }
)

watch(
    () => homeModeStore.isRoamPaused,
    async paused => {
        if (!ueManager?.dasSplineWalk || !currentSplineLayer) {
            return
        }

        if (paused) {
            await ueManager.dasSplineWalk.setEnableAutoMove(false)
        } else if (homeModeStore.isRoamMode) {
            await ueManager.dasSplineWalk.setEnableAutoMove(true)
        }
    }
)

// 剧情介绍或对白显示时，关闭任务指引面板，避免面板重叠
watch(
    () => plotInfoStore.isShowPlotInfo,
    show => {
        if (show) missionStore.setShowMission(false)
    }
)

watch(
    () => dialogueStore.isShowDialogue,
    show => {
        if (show) missionStore.setShowMission(false)
    }
)

// 非用户点击交互面板出现/消失时，控制鼠标穿透状态
watch(hasActivePanel, active => {
    if (!ueManager?.dasElectron) return
    ueManager.dasElectron.setMousePassThrough(active)
})

onMounted(() => {
    homeModeStore.resetCurrentMode()

    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
        recreateSplineLayer()

        // 初始化点击工具并注册标记点
        ueManager.dasSelectTool.initSelectTool({
            onClick: (obj: any) => onMarkerClick(obj)
        })
        addMarkerPoints(ueManager)

        // 监听场景加载完成事件，以隐藏已拾取的宝藏
        ueManager.viewer.addResponseEventListener('Scene', (json: any) => {
            const obj = JSON.parse(json)
            if (obj.class == 'Scene' && obj.message === 'sceneLoadFinish') {
                hideObtainedTreasures()
            }
        })
    })
})

onUnmounted(() => {
    clearChapterTransitionTimer()
    immersiveStore.resetImmersiveMode()
    collectStore.resetCollectInfo()
    mapStore.clearPendingChapterJump()

    if (ueManager) {
        ueManager.dasElectron?.setMousePassThrough(false)
        ueManager.viewer.removeResponseEventListener('Scene')
    }

    clearMarkerPoints()
    clearSplineLayer()
})
</script>

<style scoped lang="scss">
.home-container {
    position: relative;
    width: 100%;
    height: 100%;

    .spline-edit-btn {
        position: absolute;
        top: 40px;
        right: 400px;
        z-index: 2000;
        min-width: 132px;
        height: 44px;
        padding: 0 18px;
        border: 1px solid rgba(252, 223, 165, 0.48);
        border-radius: 22px;
        background: rgba(7, 51, 91, 0.82);
        color: #fff;
        font-size: 16px;
        line-height: 44px;
        cursor: pointer;
    }

    .conclusion {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2000;
        width: 500px;
        height: 200px;
        padding: 42px 34px;
        border-radius: 10px;
        border: 1.5px solid rgba(252, 223, 165, 0.18);
        background: rgba(7, 51, 91, 0.72);
        backdrop-filter: blur(2.5px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 18px;
        pointer-events: none;
    }

    .conclusion-text {
        color: #fff;
        font-size: 18px;
        line-height: 1.65;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
        letter-spacing: 0.5px;
    }

    .icon-back {
        position: absolute;
        top: 40px;
        left: 40px;
        width: 48px;
        height: 48px;
        cursor: pointer;
        z-index: 2000;
    }
}
</style>
