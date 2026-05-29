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
const selectedWeather = ref(null)
const weathers = ref([
    { name: '晴', key: '1', values: [0, 0, 0, 0, 0, 0, 2] }, // 顺序为：云，雨，雪，雾，雷，雪覆盖，风
    { name: '多云', key: '2', values: [3.5, 0, 0, 1, 0, 0, 2] },
    { name: '雾', key: '3', values: [0, 0, 0, 8, 0, 0, 2] },
    { name: '雨', key: '4', values: [6, 3, 0, 3, 1, 0, 4] },
    { name: '雷雨', key: '5', values: [8, 10, 0, 5, 10, 0, 8] },
    { name: '雪', key: '6', values: [6.5, 0, 6, 4, 0, 0.8, 5] },
    { name: '暴风雪', key: '7', values: [9, 0, 10, 7, 0, 1, 8] }
])
// 预设天气
const setWeather = index => {
    selectedWeather.value = index
    const weather = weathers.value[index]
    ueManager.dasScene.setWeather('SetWeatherType', weather.name)
    const settingTypes = [
        'SetControlCloudIntensity',
        'SetControlRainIntensity',
        'SetControlSnowIntensity',
        'SetControlFogIntensity',
        'SetControlThunderIntensity',
        'SetControlSnowOverlapIntensity',
        'SetWindIntensity'
    ]
    const configTypes = [
        'cloudIntensity',
        'rainIntensity',
        'snowIntensity',
        'fogIntensity',
        'thunderIntensity',
        'snowCoverIntensity',
        'windIntensity'
    ]
    settingTypes.forEach((type, typeIndex) => {
        // ueManager.dasScene.setWeather(type, weather.values[typeIndex])
        controlConfig.value[configTypes[typeIndex]] = weather.values[typeIndex]
    })
}

const controlConfig = ref({
    windDirection: 0,
    windIntensity: 0,
    cloudIntensity: 0,
    rainIntensity: 0,
    snowIntensity: 0,
    fogIntensity: 0,
    thunderIntensity: 0,
    snowCoverIntensity: 0
})

watch(
    () => controlConfig.value.windDirection,
    newValue => {
        console.log('newValue', newValue)
        ueManager.dasScene.setWeather('SetWindDirection', newValue)
    }
)

watch(
    () => controlConfig.value.windIntensity,
    newValue => {
        ueManager.dasScene.setWeather('SetWindIntensity', newValue)
    }
)

watch(
    () => controlConfig.value.cloudIntensity,
    newValue => {
        ueManager.dasScene.setWeather('SetControlCloudIntensity', newValue)
    }
)

watch(
    () => controlConfig.value.rainIntensity,
    newValue => {
        ueManager.dasScene.setWeather('SetControlRainIntensity', newValue)
    }
)

watch(
    () => controlConfig.value.snowIntensity,
    newValue => {
        ueManager.dasScene.setWeather('SetControlSnowIntensity', newValue)
    }
)

watch(
    () => controlConfig.value.fogIntensity,
    newValue => {
        ueManager.dasScene.setWeather('SetControlFogIntensity', newValue)
    }
)

watch(
    () => controlConfig.value.thunderIntensity,
    newValue => {
        ueManager.dasScene.setWeather('SetControlThunderIntensity', newValue)
    }
)

watch(
    () => controlConfig.value.snowCoverIntensity,
    newValue => {
        ueManager.dasScene.setWeather('SetControlSnowOverlapIntensity', newValue)
    }
)
const setWindDirectionLabel = value => {
    const windMap = {
        0: '西',
        45: '西北',
        90: '北',
        135: '东北',
        180: '东',
        225: '东南',
        270: '南',
        315: '西南'
    }
    return windMap[value] + '风'
}
</script>

<template>
    <div class="wea_container">
        <div class="title">天气预设</div>
        <div class="split_line"></div>
        <div class="sec_title">
            <div class="bar"></div>
            <span>天气预设</span>
        </div>
        <div class="weather_con">
            <div
                class="weather_item"
                v-for="(weather, index) in weathers"
                :key="index"
                :class="{ selected: selectedWeather === index }"
                @click="setWeather(index)"
            >
                <div :class="'wea_icon icon-' + weather.key"></div>
                <div class="wea_name">{{ weather.name }}</div>
            </div>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">风向</div>
            <el-slider
                v-model="controlConfig.windDirection"
                show-stops
                :min="0"
                :max="315"
                :step="45"
                :format-tooltip="value => setWindDirectionLabel(value)"
                :marks="{
                    0: '西',
                    45: '西北',
                    90: '北',
                    135: '东北',
                    180: '东',
                    225: '东南',
                    270: '南',
                    315: '西南'
                }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">风力大小</div>
            <el-slider
                v-model="controlConfig.windIntensity"
                :min="0"
                :max="10"
                :step="0.1"
                :marks="{ 0: '0', 10: '10' }"
            ></el-slider>
        </div>
        <div class="sec_title">
            <div class="bar"></div>
            <span>自由天气控制</span>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">云</div>
            <el-slider
                v-model="controlConfig.cloudIntensity"
                :min="0"
                :max="10"
                :step="0.1"
                :marks="{ 0: '0', 10: '10' }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">雨</div>
            <el-slider
                v-model="controlConfig.rainIntensity"
                :min="0"
                :max="10"
                :step="0.1"
                :marks="{ 0: '0', 10: '10' }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">雪</div>
            <el-slider
                v-model="controlConfig.snowIntensity"
                :min="0"
                :max="10"
                :step="0.1"
                :marks="{ 0: '0', 10: '10' }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">雾</div>
            <el-slider
                v-model="controlConfig.fogIntensity"
                :min="0"
                :max="10"
                :step="0.1"
                :marks="{ 0: '0', 10: '10' }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">雷鸣闪电</div>
            <el-slider
                v-model="controlConfig.thunderIntensity"
                :min="0"
                :max="10"
                :step="0.1"
                :marks="{ 0: '0', 10: '10' }"
            ></el-slider>
        </div>
        <div class="weather_setting_item">
            <div class="item_label">积雪覆盖</div>
            <el-slider
                v-model="controlConfig.snowCoverIntensity"
                :min="0"
                :max="10"
                :step="0.1"
                :marks="{ 0: '0', 10: '10' }"
            ></el-slider>
        </div>
    </div>
</template>
<style>
.el-tooltip {
    z-index: 3500 !important;
}
</style>
<style lang="scss" scoped>
.wea_container {
    width: 670px;
    height: 880px;
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

    .sec_title {
        color: #ffda91;
        font-size: 20px;
        text-align: left;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        padding-left: 15px;

        .bar {
            width: 9px;
            height: 9px;
            transform: rotate(45deg);
            background: #ffda91;
            margin-right: 10px;
            margin-top: 2px;
        }
    }
    .weather_con {
        width: 100%;
        border-radius: 4px;
        background: #e1bb820d;
        margin-bottom: 12px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .weather_item {
            cursor: pointer;
            .wea_name {
                color: #ffffff;
                text-align: center;
                font-size: 17px;
            }
            .wea_icon {
                width: 70px;
                height: 70px;
                margin-bottom: 5px;
                &.icon-1 {
                    background: url('@/assets/images/wea1.png') center center/ 100% 100% no-repeat;
                }
                &.icon-2 {
                    background: url('@/assets/images/wea2.png') center center/ 100% 100% no-repeat;
                }
                &.icon-3 {
                    background: url('@/assets/images/wea3.png') center center/ 100% 100% no-repeat;
                }
                &.icon-4 {
                    background: url('@/assets/images/wea4.png') center center/ 100% 100% no-repeat;
                }
                &.icon-5 {
                    background: url('@/assets/images/wea5.png') center center/ 100% 100% no-repeat;
                }
                &.icon-6 {
                    background: url('@/assets/images/wea6.png') center center/ 100% 100% no-repeat;
                }
                &.icon-7 {
                    background: url('@/assets/images/wea7.png') center center/ 100% 100% no-repeat;
                }
            }
        }

        .selected .wea_name {
            color: #ffda91;
        }
        .selected .wea_icon {
            filter: brightness(1.2);
        }
    }

    .weather_setting_item {
        width: 100%;
        border-radius: 4px;
        background: rgba(93, 231, 255, 0.05);
        margin-bottom: 12px;
        padding: 10px 30px 10px 10px;
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

    :deep(.el-switch__core) {
        width: 72px;
        height: 29px;
        border-radius: 15px;
        background: #e1bb8233;
        border: 1px solid #ffda91;
    }

    :deep(.el-switch__action) {
        width: 25px;
        height: 25px;
    }

    :deep(.el-switch.is-checked .el-switch__core .el-switch__action) {
        left: calc(100% - 26px);
    }

    :deep(.el-switch.is-checked .el-switch__core) {
        background: #ffda91;
        border-color: #ffda91;
        z-index: -1;
    }

    :deep(.el-switch__label span) {
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 18px;
    }

    :deep(.el-switch__label--left) {
        left: 31px;
        position: absolute;
        z-index: -2;
        color: #ffda91;
        display: none;
    }

    :deep(.el-switch__label--right) {
        margin-left: 8px;
        position: absolute;
        z-index: -1;
        color: #5f0d0b;
        display: none;
    }

    :deep(.is-active) {
        display: block;
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
