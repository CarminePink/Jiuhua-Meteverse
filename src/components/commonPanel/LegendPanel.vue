<template>
    <div class="legend-panel-container common-modal-border">
        <div class="panel-title">图例</div>
        <div class="panel-content">
            <div v-for="item in allLegendData" :key="item.name" class="legend-item">
                <div class="legend-icon">
                    <div
                        v-if="item.iconType === 'rect'"
                        class="legend-icon-rect"
                        :style="{
                            background: `${item.color}66`,
                            border: `1px solid ${item.color}`
                        }"
                    ></div>
                    <div
                        v-else-if="item.iconType === 'solidline'"
                        class="legend-icon-solidline"
                        :style="{ borderColor: `${item.color}` }"
                    ></div>
                    <div
                        v-else
                        class="legend-icon-img"
                        :class="'legend-icon-' + item.iconType"
                    ></div>
                </div>
                <div class="legend-text">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    legendData: {
        type: Array,
        default: () => []
    }
})
const allLegendData = ref([])
const exampleLegendData = [
    { name: '景区边界', iconType: 'rect', color: '#5EB0F4' },
    { name: '七十二峰', iconType: 'qsef' },
    { name: '朝圣神道', iconType: 'solidline', color: '#E9A920' },
    { name: '古树名木', iconType: 'gsmm' },
    { name: '古建筑群', iconType: 'gjzq' }
    // { name: '砖雕', iconType: 'zd' },
    // { name: '民俗传说', iconType: 'mscs' },
    // { name: '壁画彩绘', iconType: 'bhch' },
    // { name: '造像', iconType: 'zx' },
    // { name: '碑刻石刻', iconType: 'bksk' },
    // { name: '四至界碑', iconType: 'szjb' },
]

onMounted(() => {
    allLegendData.value = props.legendData?.length ? props.legendData : exampleLegendData
})
</script>

<style lang="scss" scoped>
.legend-panel-container {
    position: relative;
    background: rgba(33, 32, 29, 0.8);
    border-radius: 8px;
    padding: 20px 60px 40px 60px;
    width: 640px;
    height: auto;
    backdrop-filter: blur(4px);
    z-index: 1000;

    .panel-title {
        color: #e1bb82;
        font-size: 50px;
        font-weight: 700;
        letter-spacing: 5px;
        padding: 0 0 40px 0;
        margin-bottom: 10px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        background: url('@/assets/images/common/underline_title.png') center bottom / 393px auto
            no-repeat;
    }
    .panel-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        font-size: 30px;
        color: #fff;
        .legend-item {
            width: 230px;
            margin-top: 40px;
            display: flex;
            align-items: center;
            .legend-icon {
                width: 50px;
                margin-right: 20px;
            }
            .legend-icon-rect {
                height: 36px;
                border-radius: 2px;
            }
            .legend-icon-solidline {
                width: 50px;
                border-top: 2px solid;
            }
            .legend-icon-img {
                background-size: 100%;
                background-repeat: no-repeat;
                width: 50px;
                height: 50px;
                &.legend-icon-zd {
                    background-image: url('@/assets/images/common/legend_zd.png');
                }
                &.legend-icon-gjzq {
                    background-image: url('@/assets/images/common/legend_gjzq.png');
                }
                &.legend-icon-mscs {
                    background-image: url('@/assets/images/common/legend_mscs.png');
                }
                &.legend-icon-bhch {
                    background-image: url('@/assets/images/common/legend_bhch.png');
                }
                &.legend-icon-gsmm {
                    background-image: url('@/assets/images/common/legend_gsmm.png');
                }
                &.legend-icon-zx {
                    background-image: url('@/assets/images/common/legend_zx.png');
                }
                &.legend-icon-qsef {
                    background-image: url('@/assets/images/common/legend_qsef.png');
                }
                &.legend-icon-bksk {
                    background-image: url('@/assets/images/common/legend_bksk.png');
                }
                &.legend-icon-szjb {
                    background-image: url('@/assets/images/common/legend_szjb.png');
                }
            }
        }
    }
}
</style>
