<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDasUE } from '@/hooks/useDasUEHook'
let ueManager = null
onMounted(() => {
    const { dasUE } = useDasUE()
    ueManager = dasUE
})

const selectedWeather = ref(null)
const weathers = ref([
    { imgSrc: '/src/assets/images/wea1.png', name: '晴' },
    { imgSrc: '/src/assets/images/wea2.png', name: '多云' },
    { imgSrc: '/src/assets/images/wea3.png', name: '雾' },
    { imgSrc: '/src/assets/images/wea4.png', name: '雨' },
    { imgSrc: '/src/assets/images/wea5.png', name: '雷雨' },
    { imgSrc: '/src/assets/images/wea6.png', name: '雪' },
    { imgSrc: '/src/assets/images/wea7.png', name: '暴风雪' }
])
const setWeather = index => {
    selectedWeather.value = index
    const weather = weathers.value[index].name
    ueManager.dasScene.setWeather('SetWeatherType', weather)
}

const wind = ref({
    direction: 0,
    intensity: 0
})

watch(
    () => wind.value.direction,
    newValue => {
        ueManager.dasScene.setWeather('SetWindDirection', newValue * 3.6)
    }
)

watch(
    () => wind.value.intensity,
    newValue => {
        ueManager.dasScene.setWeather('SetWindIntensity', newValue * 0.05)
    }
)

const controlWeather = ref(false)
const controlConfig = ref({
    cloud: false,
    cloudIntensity: 0,
    rain: false,
    rainIntensity: 0,
    snow: false,
    snowIntensity: 0,
    fog: false,
    fogIntensity: 0,
    thunder: false,
    thunderIntensity: 0,
    snowCover: false,
    snowCoverIntensity: 0
})

watch(
    () => controlWeather.value,
    () => {}
)

watch(
    () => controlConfig.value.cloud,
    newValue => {
        if (newValue) {
            ueManager.dasScene.setWeather('SetWeatherType', '云')
        }
    }
)

watch(
    () => controlConfig.value.rain,
    newValue => {
        if (newValue) {
            ueManager.dasScene.setWeather('SetWeatherType', '雨')
        }
    }
)

watch(
    () => controlConfig.value.snow,
    () => {
        ueManager.dasScene.setWeather('SetWeatherType', '雪')
    }
)

watch(
    () => controlConfig.value.fog,
    () => {
        ueManager.dasScene.setWeather('SetWeatherType', '雾')
    }
)

watch(
    () => controlConfig.value.thunder,
    () => {
        ueManager.dasScene.setWeather('SetWeatherType', '雷雨')
    }
)

watch(
    () => controlConfig.value.snowCover,
    () => {}
)

watch(
    () => controlConfig.value.cloudIntensity,
    newValue => {
        if (controlConfig.value.cloud) {
            ueManager.dasScene.setWeather('SetControlCloudIntensity', newValue * 0.1)
        }
    }
)

watch(
    () => controlConfig.value.rainIntensity,
    newValue => {
        if (controlConfig.value.rain) {
            ueManager.dasScene.setWeather('SetControlRainIntensity', 1000 + newValue * 490)
        }
    }
)

watch(
    () => controlConfig.value.snowIntensity,
    newValue => {
        if (controlConfig.value.snow) {
            ueManager.dasScene.setWeather('SetControlSnowIntensity', 1000 + newValue * 490)
        }
    }
)

watch(
    () => controlConfig.value.fogIntensity,
    newValue => {
        if (controlConfig.value.fog) {
            ueManager.dasScene.setWeather('SetControlFogIntensity', newValue * 0.1)
        }
    }
)

watch(
    () => controlConfig.value.thunderIntensity,
    newValue => {
        if (controlConfig.value.thunder) {
            ueManager.dasScene.setWeather('SetControlThunderIntensity', newValue * 0.2)
        }
    }
)

watch(
    () => controlConfig.value.snowCoverIntensity,
    newValue => {
        if (controlConfig.value.snowCover) {
            ueManager.dasScene.setWeather('SetControlSnowOverlapIntensity', newValue * 0.01)
        }
    }
)
</script>

<template>
    <div class="wea_container">
        <div class="title">天气预设</div>
        <div class="split_line"></div>
        <div class="sec_title">
            <div class="bar"></div>
            天气预设
        </div>
        <div class="weather_con">
            <ul>
                <li
                    v-for="(weather, index) in weathers"
                    :key="index"
                    :class="{ selected: selectedWeather === index }"
                    @click="setWeather(index)"
                >
                    <div style="display: flex; justify-content: center">
                        <img :src="weather.imgSrc" />
                    </div>
                    <div class="wea_name">{{ weather.name }}</div>
                </li>
            </ul>
        </div>
        <el-form label-width="175px">
            <el-form-item label="风向">
                <el-slider
                    v-model="wind.direction"
                    style="margin-left: -15px; margin-top: -20px"
                    :format-tooltip="value => parseFloat((value * 3.6).toFixed(1))"
                    :marks="{ 0: '0', 100: '360' }"
                ></el-slider>
            </el-form-item>
            <el-form-item label="风力大小" class="ruihua">
                <el-slider
                    v-model="wind.intensity"
                    style="margin-left: -15px; margin-top: -20px"
                    :format-tooltip="value => parseFloat((value * 0.05).toFixed(1))"
                    :marks="{ 0: '0', 100: '5' }"
                ></el-slider>
            </el-form-item>
        </el-form>
        <div class="sec_title">
            <div class="bar" style="margin-top: 12px"></div>
            自由天气控制
            <!-- <el-switch
                v-model="controlWeather"
                active-text="ON"
                inactive-text="OFF"
                style="margin-left: 195px"
                active-color="#E1BB82"
            ></el-switch> -->
        </div>
        <el-form ref="form" label-width="150px">
            <el-form-item label="云">
                <table>
                    <tr>
                        <td style="width: 240px">
                            <el-slider
                                v-model="controlConfig.cloudIntensity"
                                style="margin-top: -20px"
                                width="160px"
                                :format-tooltip="value => parseFloat((value * 0.1).toFixed(1))"
                                :marks="{ 0: '0', 100: '10' }"
                            ></el-slider>
                        </td>
                        <td style="width: 0px">
                            <el-switch
                                v-model="controlConfig.cloud"
                                active-text="ON"
                                inactive-text="OFF"
                                style="margin-left: 24px; margin-right: 10px"
                                active-color="#E1BB82"
                            ></el-switch>
                        </td>
                    </tr>
                </table>
            </el-form-item>
            <el-form-item label="雨">
                <table>
                    <tr>
                        <td style="width: 240px">
                            <el-slider
                                v-model="controlConfig.rainIntensity"
                                style="margin-top: -20px"
                                width="160px"
                                :format-tooltip="
                                    value => parseFloat((1000 + value * 490).toFixed(0))
                                "
                                :marks="{ 0: '1000', 100: '50000' }"
                            ></el-slider>
                        </td>
                        <td style="width: 0px">
                            <el-switch
                                v-model="controlConfig.rain"
                                active-text="ON"
                                inactive-text="OFF"
                                style="margin-left: 24px; margin-right: 10px"
                                active-color="#E1BB82"
                            ></el-switch>
                        </td>
                    </tr>
                </table>
            </el-form-item>
            <el-form-item label="雪" class="sewen">
                <table>
                    <tr>
                        <td style="width: 240px">
                            <el-slider
                                v-model="controlConfig.snowIntensity"
                                style="margin-top: -20px"
                                width="160px"
                                :format-tooltip="
                                    value => parseFloat((1000 + value * 490).toFixed(0))
                                "
                                :marks="{ 0: '1000', 100: '50000' }"
                            ></el-slider>
                        </td>
                        <td style="width: 0px">
                            <el-switch
                                v-model="controlConfig.snow"
                                active-text="ON"
                                inactive-text="OFF"
                                style="margin-left: 24px; margin-right: 10px"
                                active-color="#E1BB82"
                            ></el-switch>
                        </td>
                    </tr>
                </table>
            </el-form-item>
            <el-form-item label="雾">
                <table>
                    <tr>
                        <td style="width: 240px">
                            <el-slider
                                v-model="controlConfig.fogIntensity"
                                style="margin-top: -20px"
                                width="160px"
                                :format-tooltip="value => parseFloat((value * 0.1).toFixed(1))"
                                :marks="{ 0: '0', 100: '10' }"
                            ></el-slider>
                        </td>
                        <td style="width: 0px">
                            <el-switch
                                v-model="controlConfig.fog"
                                active-text="ON"
                                inactive-text="OFF"
                                style="margin-left: 24px; margin-right: 10px"
                                active-color="#E1BB82"
                            ></el-switch>
                        </td>
                    </tr>
                </table>
            </el-form-item>
            <el-form-item label="打雷闪电">
                <table>
                    <tr>
                        <td style="width: 240px">
                            <el-slider
                                v-model="controlConfig.thunderIntensity"
                                style="margin-top: -20px"
                                width="160px"
                                :format-tooltip="value => parseFloat((value * 0.2).toFixed(1))"
                                :marks="{ 0: '0', 100: '20' }"
                            ></el-slider>
                        </td>
                        <td style="width: 0px">
                            <el-switch
                                v-model="controlConfig.thunder"
                                active-text="ON"
                                inactive-text="OFF"
                                style="margin-left: 24px; margin-right: 10px"
                                active-color="#E1BB82"
                            ></el-switch>
                        </td>
                    </tr>
                </table>
            </el-form-item>
            <el-form-item label="积雪覆盖">
                <table>
                    <tr>
                        <td style="width: 240px">
                            <el-slider
                                v-model="controlConfig.snowCoverIntensity"
                                style="margin-top: -20px"
                                width="160px"
                                :format-tooltip="value => parseFloat((value * 0.01).toFixed(1))"
                                :marks="{ 0: '0', 100: '1' }"
                            ></el-slider>
                        </td>
                        <td style="width: 0px">
                            <el-switch
                                v-model="controlConfig.snowCover"
                                active-text="ON"
                                inactive-text="OFF"
                                style="margin-left: 24px; margin-right: 10px"
                                active-color="#E1BB82"
                            ></el-switch>
                        </td>
                    </tr>
                </table>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.wea_container {
    width: 440px;
    height: 820px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 0.5px solid #e1bb82;
    background: #21201dcc;
    backdrop-filter: blur(4px);
    position: absolute;
    top: 62px;
    right: 119px;
    padding: 10px;
    z-index: 2;

    .title {
        align-self: stretch;
        color: #e1bb82;
        text-align: center;
        font-family: 'Source Han Serif CN';
        font-size: 24px;
        font-style: normal;
        line-height: normal;
        letter-spacing: 9.6px;
        margin-top: 15px;
    }

    .split_line {
        background-image: url('/src/assets/images/hl.png');
        background-size: 100% 100%;
        height: 12px;
        width: 180px;
        margin: auto;
        margin-top: 15px;
        margin-bottom: 20px;
    }

    .weather_con {
        display: flex;
        flex-wrap: wrap;
        width: 410px;
        height: 100px;
        flex-shrink: 0;
        border-radius: 3px;
        background: #e1bb820d;
        margin-left: 15px;
        margin-bottom: 15px;

        .selected .wea_name {
            color: #e1bb82;
        }

        ul {
            list-style: none;
            display: flex;
            flex-direction: row;
            padding: 0;
            margin-left: 12px;
            padding-top: 5px;
        }

        li {
            margin-right: 6px;
            cursor: pointer;

            .wea_name {
                color: #ffffff;
                text-align: center;
                font-family: 'Source Han Sans CN';
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                width: 50px;
            }

            img {
                width: 40px;
                height: 40px;
            }
        }
    }

    :deep(.el-form-item__label) {
        justify-content: flex-start;
        color: #ffffff;
        font-family: 'Source Han Sans CN';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 40px;
        padding-left: 15px;
    }

    :deep(.el-form-item) {
        width: 410px;
        height: 40px;
        flex-shrink: 0;
        background: #e1bb820d;
        border-radius: 3px;
        margin-left: 15px;
    }

    .sec_title {
        color: #e1bb82;
        font-family: 'Source Han Sans CN';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: left;
        padding-left: 52px;
        padding-bottom: 15px;

        .bar {
            width: 5.17px;
            height: 5.17px;
            transform: rotate(45deg);
            flex-shrink: 0;
            background: #e1bb82;
            position: absolute;
            margin-left: -15px;
            margin-top: 9px;
        }
    }

    :deep(.el-switch__core) {
        width: 64px;
        height: 28px;
        border-radius: 20px;
        background: #e1bb8233;
        border: 0.2px solid #e1bb82;
    }

    :deep(.el-switch__action) {
        width: 20px;
        height: 20px;
    }

    :deep(.el-switch.is-checked .el-switch__core .el-switch__action) {
        left: calc(100% - 21px);
    }

    :deep(.el-switch.is-checked .el-switch__core) {
        background: #e1bb82;
        border-color: #e1bb82;
        z-index: -1;
    }

    :deep(.el-switch__label--left) {
        left: 30px;
        position: absolute;
        z-index: -2;
        color: #e1bb82;
        display: none;
    }

    :deep(.el-switch__label--right) {
        margin-left: 10px;
        position: absolute;
        z-index: -1;
        color: #5f0d0b;
        display: none;
    }

    :deep(.is-active) {
        display: block;
    }

    :deep(.ruihua .el-form-item__label) {
        width: 280px;
    }

    :deep(.el-radio-button__inner) {
        background: none;
        color: #e1bb82;
        border: none;
    }

    :deep(.el-radio-group) {
        border: 0.2px solid #e1bb82;
        border-radius: 5px;
    }

    :deep(.el-radio-button:first-child .el-radio-button__inner) {
        border: none;
    }

    :deep(
        .el-radio-button.is-active
            .el-radio-button__original-radio:not(:disabled)
            + .el-radio-button__inner
    ) {
        border-radius: 4px;
        background: #e1bb82;
        color: #5f0d0b;
        box-shadow: none;
    }

    :deep(.el-slider__button) {
        width: 30px;
        height: 18px;
        border: none;
        background: none;
        border-color: inherit;
        background-image: url('/src/assets/images/slider.png');
        background-size: 100% 100%;
    }

    :deep(.el-slider__bar) {
        height: 4px;
        background: #e1bb82;
    }

    :deep(.el-slider__runway) {
        height: 4px;
        background: #e1bb8233;
    }

    :deep(.el-slider__marks-text) {
        color: #e1bb82;
        font-family: 'Source Han Sans CN';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
    }

    :deep(.sewen .el-slider__marks-text:first-child) {
        // margin-left: 12px;
    }

    :deep(.sewen .el-slider__marks-text:last-child) {
        // margin-left: -15px;
    }

    :deep(.el-slider__stop) {
        background: none;
    }
}
</style>
