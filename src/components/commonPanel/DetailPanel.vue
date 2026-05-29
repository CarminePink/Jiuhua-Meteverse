<template>
    <PanelContainer :title="props.detailData?.title">
        <template #content>
            <div class="detail-container">
                <el-image
                    class="image-content"
                    fit="cover"
                    v-if="props.detailData?.image"
                    :src="props.detailData?.image"
                ></el-image>
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
    .image-content {
        width: 100%;
        height: 393px;
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
        max-height: 810px;
        overflow-y: auto;
    }
}
</style>
