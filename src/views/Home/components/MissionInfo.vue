<template>
    <div v-show="visible" class="mission-panel">
        <div class="mission-content">
            <div class="mission-target"><span class="label">任务目标：</span>{{ target }}</div>
            <div class="mission-clue">线索提示:{{ clue }}</div>
        </div>
        <div class="mission-actions">
            <!-- <button class="action-btn btn-guide" type="button" @click="handleGuide">
                寻宝指引
            </button> -->
            <button class="action-btn btn-close" type="button" @click="handleClose">关闭</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMissionStore } from '@/stores/mission'
import { useHomeModeStore } from '@/stores/homeMode'

defineProps<{
    target: string
    clue: string
}>()

const emit = defineEmits<{
    guide: []
}>()

const missionStore = useMissionStore()
const homeModeStore = useHomeModeStore()

const visible = computed(() => missionStore.isShowMission && !homeModeStore.isRoamMode)

const handleClose = () => {
    missionStore.setShowMission(false)
}

const handleGuide = () => {
    emit('guide')
    handleClose()
}
</script>

<style scoped lang="scss">
.mission-panel {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    width: min(1020px, calc(100% - 80px));
    min-height: 170px;
    padding: 18px 36px 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    pointer-events: auto;
    border-radius: 10px;
    border-top: 1.5px solid rgba(252, 223, 165, 0);
    border-bottom: 1.5px solid rgba(252, 223, 165, 0);
    background: linear-gradient(
        90deg,
        rgba(7, 51, 91, 0) 0%,
        rgba(7, 51, 91, 0.7) 50%,
        rgba(7, 51, 91, 0) 100%
    );
    backdrop-filter: blur(2.5px);
}

.mission-content {
    width: 100%;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 18px;
}

.mission-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 18px;
}

.action-btn {
    width: 144px;
    height: 52px;
    padding: 0;
    border: 0;
    background-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #fff9e8;
    font-family: 'Source Han Serif CN', serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 2px;
    cursor: pointer;
    text-shadow: 0 1px 6px rgba(72, 46, 6, 0.35);
    transition:
        transform 0.2s ease,
        filter 0.2s ease;

    &:hover {
        transform: translateY(-1px) scale(1.03);
        filter: brightness(1.03);
    }

    &:active {
        transform: scale(0.97);
    }
}

.btn-guide {
    background-image: url('@/assets/images/tool/btn_guide.png');
}

.btn-close {
    background-image: url('@/assets/images/tool/btn_close.png');
}

.mission-target {
    color: #fff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.32);
    font-family: 'Source Han Serif CN', serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.9;

    .label {
        margin-right: 4px;
    }
}

.mission-clue {
    color: #fcdfa5;
    font-size: 16px;
    width: 100%;
    font-weight: 400;
    line-height: 1.9;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.28);
}

@media (max-width: 900px) {
    .mission-panel {
        width: calc(100% - 32px);
        min-height: auto;
        padding: 24px 20px;
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
    }

    .mission-actions {
        justify-content: flex-end;
    }
}

@media (max-width: 640px) {
    .mission-actions {
        gap: 12px;
    }

    .action-btn {
        width: 128px;
        height: 48px;
        font-size: 15px;
        letter-spacing: 1px;
    }
}
</style>
