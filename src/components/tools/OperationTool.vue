<template>
    <div class="operation-tool-container">
        <button
            v-for="(item, index) in btnList"
            :key="item.label"
            type="button"
            class="operation-btn"
            :class="{ active: activeIndex === index }"
            @click="handleBtnClick(index)"
        >
            <span v-if="activeIndex === index" class="operation-btn-label">{{ item.label }}</span>
            <div class="operation-btn-icon-wrapper">
                <img
                    class="operation-btn-icon"
                    :src="item.url"
                    :alt="item.label"
                    :style="{ opacity: activeIndex === index ? 0 : 1 }"
                />
                <img
                    class="operation-btn-icon operation-btn-icon-active"
                    :src="item.activeUrl"
                    :alt="item.label"
                    :style="{ opacity: activeIndex === index ? 1 : 0 }"
                />
            </div>
        </button>
        <OperatingHelp v-model:visible="showHelp" />
        <Standings v-model:visible="showStandings" />
        <DailyRewards v-model:visible="showDailyRewards" />
        <PointsRedemption v-model:visible="showPointsRedemption" />
        <MyBag v-model:visible="showMyBag" />
        <MapTool />
    </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/map'
import { Local } from '@/utils/storage'

const OperatingHelp = defineAsyncComponent(() => import('./OperatingHelp.vue'))
const Standings = defineAsyncComponent(() => import('./Standings.vue'))
const DailyRewards = defineAsyncComponent(() => import('./DailyRewards.vue'))
const PointsRedemption = defineAsyncComponent(() => import('./PointsRedemption.vue'))
const MyBag = defineAsyncComponent(() => import('./MyBag.vue'))
const MapTool = defineAsyncComponent(() => import('./MapTool.vue'))

const mapStore = useMapStore()
const activeIndex = ref(-1)
const showHelp = ref(false)
const showStandings = ref(false)
const showDailyRewards = ref(false)
const showPointsRedemption = ref(false)
const showMyBag = ref(false)
const OPERATING_HELP_SEEN_KEY = 'operation-help-seen'

const btnList = ref([
    {
        label: '操作指引',
        url: new URL('@/assets/images/tool/btn_operation_1.png', import.meta.url).href,
        activeUrl: new URL('@/assets/images/tool/btn_operation_1_active.png', import.meta.url).href
    },
    {
        label: '积分榜',
        url: new URL('@/assets/images/tool/btn_operation_2.png', import.meta.url).href,
        activeUrl: new URL('@/assets/images/tool/btn_operation_2_active.png', import.meta.url).href
    },
    {
        label: '每日奖励',
        url: new URL('@/assets/images/tool/btn_operation_3.png', import.meta.url).href,
        activeUrl: new URL('@/assets/images/tool/btn_operation_3_active.png', import.meta.url).href
    },
    {
        label: '积分兑换',
        url: new URL('@/assets/images/tool/btn_operation_4.png', import.meta.url).href,
        activeUrl: new URL('@/assets/images/tool/btn_operation_4_active.png', import.meta.url).href
    },
    {
        label: '我的背包',
        url: new URL('@/assets/images/tool/btn_operation_5.png', import.meta.url).href,
        activeUrl: new URL('@/assets/images/tool/btn_operation_5_active.png', import.meta.url).href
    },
    {
        label: '地图指引',
        url: new URL('@/assets/images/tool/btn_operation_6.png', import.meta.url).href,
        activeUrl: new URL('@/assets/images/tool/btn_operation_6_active.png', import.meta.url).href
    }
])

const closeAllPanels = () => {
    showHelp.value = false
    showStandings.value = false
    showDailyRewards.value = false
    showPointsRedemption.value = false
    showMyBag.value = false
}

const handleBtnClick = (index: number) => {
    if (index === 5) {
        const nextVisible = !mapStore.isShowMap

        closeAllPanels()

        mapStore.setShowMap(nextVisible)
        activeIndex.value = nextVisible ? 5 : -1
        return
    }

    activeIndex.value = index
    mapStore.setShowMap(false)

    closeAllPanels()

    if (index === 0) {
        showHelp.value = true
        return
    }

    if (index === 1) {
        showStandings.value = true
        return
    }

    if (index === 2) {
        showDailyRewards.value = true
        return
    }

    if (index === 3) {
        showPointsRedemption.value = true
        return
    }

    if (index === 4) {
        showMyBag.value = true
    }
}

onMounted(() => {
    if (Local.get(OPERATING_HELP_SEEN_KEY)) return

    showHelp.value = true
    activeIndex.value = 0
    Local.set(OPERATING_HELP_SEEN_KEY, true)
})

watch(
    [showHelp, showStandings, showDailyRewards, showPointsRedemption, showMyBag],
    ([
        helpVisible,
        standingsVisible,
        dailyRewardsVisible,
        pointsRedemptionVisible,
        myBagVisible
    ]) => {
        if (
            !helpVisible &&
            !standingsVisible &&
            !dailyRewardsVisible &&
            !pointsRedemptionVisible &&
            !myBagVisible &&
            [0, 1, 2, 3, 4].includes(activeIndex.value)
        ) {
            activeIndex.value = -1
        }
    }
)

watch(
    () => mapStore.isShowMap,
    visible => {
        if (visible) {
            closeAllPanels()
            activeIndex.value = 5
            return
        }

        if (activeIndex.value === 5) {
            activeIndex.value = -1
        }
    }
)
</script>

<style lang="scss" scoped>
.operation-tool-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
}

.operation-btn {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    .operation-btn-icon-wrapper {
        position: relative;
        width: 60px;
        height: 60px;
    }

    .operation-btn-icon {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    &.active {
        margin-bottom: 0;
        .operation-btn-icon-wrapper {
            width: 60px;
            height: 60px;
        }
    }
}

.operation-btn-label {
    position: absolute;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
}
</style>
