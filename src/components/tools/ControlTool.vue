<template>
    <div class="control-tool-bar">
        <SettingTool v-show="isShowSetting" />
        <!-- <img class="control-icon" src="@/assets/images/tool/icon_voice.png" /> -->
        <img
            class="control-icon"
            src="@/assets/images/tool/icon_setting.png"
            @click="onShowSetting"
        />
    </div>
</template>

<script setup lang="ts">
import { useDasUE } from '@/hooks/useDasUEHook'
import SettingTool from './SettingTool.vue'
import { useRoamStore } from '@/stores/roam'

const roamStore = useRoamStore()

let ueManager = null
let isShowSetting = ref(false)
onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
    })
})

const onShowSetting = () => {
    isShowSetting.value = !isShowSetting.value
}
</script>

<style lang="scss" scoped>
.control-tool-bar {
    display: flex;
    align-items: center;

    .control-icon {
        width: 60px;
        height: 60px;
        margin-right: 50px;
        cursor: pointer;
        &:hover {
            filter: brightness(1.4);
        }
    }
}
</style>
