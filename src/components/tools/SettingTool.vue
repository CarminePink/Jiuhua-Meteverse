<template>
    <div class="setting-tool">
        <div class="setting-tool-btn-list">
            <div
                v-for="item in btnList"
                :key="item.type"
                class="setting-tool-btn"
                :class="{ active: activeType === item.type }"
                @click="changeType(item.type)"
            >
                {{ item.name }}
            </div>
        </div>
        <SkySetting v-show="activeType === 1" />
        <WeatherSetting v-show="activeType === 2" />
        <seasonSetting v-show="activeType === 3" />
    </div>
</template>

<script setup lang="ts">
import WeatherSetting from './WeatherSetting.vue'
import SkySetting from './SkySetting.vue'
import seasonSetting from './seasonSetting.vue'
let activeType = ref(0)
const btnList = [
    {
        name: '天空设置',
        type: 1
    },
    {
        name: '天气设置',
        type: 2
    },
    {
        name: '季节设置',
        type: 3
    }
]
const changeType = (type: number) => {
    activeType.value = type == activeType.value ? 0 : type
}
</script>

<style lang="scss" scoped>
.setting-tool {
    .setting-tool-btn-list {
        display: flex;
        align-items: center;
        .setting-tool-btn {
            margin-left: 10px;
            width: 92px;
            height: 44px;
            background: url('@/assets/images/tool/btn_setting.png') center center/ 100% 100%
                no-repeat;
            color: #fff;
            font-size: 16px;
            text-align: center;
            line-height: 44px;
            cursor: pointer;
            &.active {
                background: url('@/assets/images/tool/btn_setting_active.png') center center/ 100%
                    100% no-repeat;
            }
        }
    }
}
</style>
