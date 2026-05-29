<template>
    <PanelContainer :title="props.detailData?.title">
        <template #content>
            <div class="detail-container">
                <div class="number-content">
                    <div
                        v-for="(item, index) in props.detailData?.totals"
                        :key="index"
                        class="number-item"
                    >
                        <div class="number-value">
                            {{ item.value }}
                        </div>
                        <div class="number-title">
                            {{ item.title }}
                        </div>
                    </div>
                </div>
                <div v-if="props.detailData?.audio" class="audio-content">
                    <div class="audio-title">解说音频</div>
                    <AudioBar :audio-src="props.detailData?.audio" />
                </div>
                <div class="remark-content">
                    {{ props.detailData?.remark }}
                </div>
            </div>
        </template>
    </PanelContainer>
</template>
<script setup lang="ts">
import PanelContainer from '@/components/commonPanel/PanelContainer.vue'
import AudioBar from '@/components/audioBar/index.vue'
const props = defineProps({
    detailData: {
        type: Object,
        default: () => {}
    }
})
</script>
<style lang="scss" scoped>
.detail-container {
    width: 100%;
    letter-spacing: 2px;
    .number-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .number-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 511px;
            height: 157px;
            margin-bottom: 73px;
            background: url('@/assets/images/common/number_border.png') center center / 100%
                no-repeat;
            .number-value {
                font-size: 50px;
                font-weight: bold;
                color: #ffe5a0;
            }
            .number-title {
                font-size: 30px;
                color: #fff;
            }
        }
    }
    .audio-content {
        margin: 20px 0;
        .audio-title {
            color: #e1bb82;
            font-size: 40px;
            margin-bottom: 23px;
        }
    }
    .remark-content {
        font-size: 30px;
        color: #fff;
        line-height: 1.6;
        text-align: justify;
        padding-right: 20px;
        max-height: 530px;
        overflow-y: auto;
    }
}
</style>
