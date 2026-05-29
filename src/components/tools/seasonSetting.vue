<script setup lang="ts">
import { ref } from 'vue'
import { useDasUE } from '@/hooks/useDasUEHook'
let ueManager = null
onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE(true)
    onViewerReady(() => {
        ueManager = dasUE
    })
})
const seasonForm = ref<any>({
    spring: 'spring',
    summer: '',
    autumn: '',
    winter: ''
})

const selectSeason = (season: string) => {
    seasonForm.value[season] = season
    for (const key in seasonForm.value) {
        seasonForm.value[key] = key === season ? season : ''
    }
    switch (season) {
        case 'spring':
            ueManager.dasScene.setWeather('SetSeason', 0)
            break
        case 'summer':
            ueManager.dasScene.setWeather('SetSeason', 1)
            break
        case 'autumn':
            ueManager.dasScene.setWeather('SetSeason', 2)
            break
        case 'winter':
            ueManager.dasScene.setWeather('SetSeason', 3)
            break
    }
}
</script>

<template>
    <div class="season_container">
        <div class="title">季节预设</div>
        <div class="split_line"></div>
        <div class="weather_setting_item">
            <img class="item_img" src="@/assets/images/chunji.png" />
            <div class="item_label">春季</div>
            <el-switch
                v-model="seasonForm.spring"
                :active-value="'spring'"
                :inactive-value="''"
                active-text="ON"
                inactive-text="OFF"
                active-color="#E1BB82"
                @change="selectSeason('spring')"
            ></el-switch>
        </div>
        <div class="weather_setting_item">
            <img class="item_img" src="@/assets/images/xiaji.png" />
            <div class="item_label">夏季</div>
            <el-switch
                v-model="seasonForm.summer"
                :active-value="'summer'"
                :inactive-value="''"
                active-text="ON"
                inactive-text="OFF"
                active-color="#E1BB82"
                @change="selectSeason('summer')"
            ></el-switch>
        </div>
        <div class="weather_setting_item">
            <img class="item_img" src="@/assets/images/qiuji.png" />
            <div class="item_label">秋季</div>
            <el-switch
                v-model="seasonForm.autumn"
                :active-value="'autumn'"
                :inactive-value="''"
                active-text="ON"
                inactive-text="OFF"
                active-color="#E1BB82"
                @change="selectSeason('autumn')"
            ></el-switch>
        </div>
        <div class="weather_setting_item">
            <img class="item_img" src="@/assets/images/dongji.png" />
            <div class="item_label">冬季</div>
            <el-switch
                v-model="seasonForm.winter"
                :active-value="'winter'"
                :inactive-value="''"
                active-text="ON"
                inactive-text="OFF"
                active-color="#E1BB82"
                @change="selectSeason('winter')"
            ></el-switch>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.season_container {
    width: 440px;
    height: 730px;
    border-radius: 4px;
    border: none;
    background: url('@/assets/images/setting_bg.png') center / 100% 100% no-repeat;
    position: absolute;
    top: 60px;
    right: 120px;
    padding: 10px 20px;
    z-index: 2;

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
            width: 50%;
            color: #fff;
            margin-left: 11px;
        }
        .item_img {
            width: 130px;
            height: auto;
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
}
</style>
