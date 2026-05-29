<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDasUE } from '@/hooks/useDasUEHook'
let ueManager = null
onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE(true)
    onViewerReady(() => {
        ueManager = dasUE
    })
})

const form1 = ref({
    timeOfDay: 37.5,
    sunAngle: false,
    sunPower: false
})
watch(
    () => form1.value.timeOfDay,
    newValue => {
        let rate = (60 * 24) / 2400
        const hour = Math.floor((rate * newValue * 24) / 60)
        const minute = Math.floor(rate * newValue * 24 - hour * 60)
        let timeStr = hour === 24 ? '23:59' : `${hour}:${minute < 10 ? '0' + minute : minute}`
        ueManager.dasScene.setWeather('SetTimeOfDay', timeStr)
    }
)

watch(
    () => form1.value.sunAngle,
    newValue => {
        ueManager.dasScene.setWeather('SetSunAngle', newValue * 3.6)
    }
)

watch(
    () => form1.value.sunPower,
    newValue => {
        ueManager.dasScene.setWeather('SetSunIntensity', 4 + newValue * 0.06)
    }
)
// 时间格式设置
const setTimeLabel = value => {
    let rate = (60 * 24) / 2400
    const hour = Math.floor((rate * value * 24) / 60)
    const minute = Math.floor(rate * value * 24 - hour * 60)
    return hour === 24
        ? '23:59'
        : `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`
}
</script>

<template>
    <div class="sky_container">
        <div class="title">天空设置</div>
        <div class="split_line"></div>
        <div class="weather_setting_item">
            <div class="item_label">时间设置</div>
            <el-slider
                v-model="form1.timeOfDay"
                style="margin-left: -8px; margin-top: -10px"
                :format-tooltip="value => setTimeLabel(value)"
                :marks="{ 0: '0', 100: '24' }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">太阳角度</div>
            <el-slider
                v-model="form1.sunAngle"
                style="margin-left: -8px; margin-top: -10px"
                :format-tooltip="value => parseFloat((value * 3.6).toFixed(1))"
                :marks="{ 0: '0', 100: '360' }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">太阳强度</div>
            <el-slider
                v-model="form1.sunPower"
                style="margin-left: -8px; margin-top: -10px"
                :format-tooltip="value => parseFloat((4 + value * 0.06).toFixed(1))"
                :marks="{ 0: '4', 100: '10' }"
            ></el-slider>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.sky_container {
    width: 670px;
    height: 400px;
    border-radius: 4px;
    border: none;
    background: url('@/assets/images/setting_bg_2.png') center / 100% 100% no-repeat;
    position: absolute;
    top: 60px;
    right: 35px;
    padding: 10px 20px;
    z-index: 2;
    overflow-y: auto;

    .title {
        align-self: stretch;
        color: #ffda91;
        text-align: center;
        font-family: 'Source Han Serif CN';
        font-size: 30px;
        letter-spacing: 5px;
        margin-top: 8px;
    }

    .split_line {
        background-image: url('@/assets/images/hl.png');
        background-size: 100% 100%;
        height: 15px;
        width: 190px;
        margin: auto;
        margin-top: 8px;
        margin-bottom: 10px;
    }

    .weather_setting_item {
        width: 100%;
        border-radius: 4px;
        background: rgba(93, 231, 255, 0.05);
        margin-top: 20px;
        padding: 20px 30px 20px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 17px;
        .item_label {
            width: 30%;
            color: #fff;
        }
        .el-slider {
            width: 55%;
            margin-top: -10px;
        }
    }

    :deep(.el-slider__button) {
        width: 25px;
        height: 15px;
        border: none;
        background: none;
        border-color: inherit;
        background-image: url('@/assets/images/slider.png');
        background-size: 100% 100%;
    }

    :deep(.el-slider__bar) {
        height: 5px;
        background: #ffda91;
    }

    :deep(.el-slider__runway) {
        height: 5px;
        background: #e1bb8233;
    }

    :deep(.el-slider__marks-text) {
        color: #ffda91;
        font-size: 14px;
        margin-top: 12px;
    }

    :deep(.el-slider__stop) {
        background: none;
    }
}
</style>
