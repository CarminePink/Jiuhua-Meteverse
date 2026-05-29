<template>
    <div v-show="visible && rewardList.length > 0" class="collect-info-panel">
        <div v-for="item in rewardList" :key="item.key" class="reward-item">
            <img class="reward-icon" :src="item.icon" :alt="item.alt" />
            <div class="reward-text-bg" :style="{ backgroundImage: `url(${textBg})` }">
                <span class="reward-text">{{ item.text }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import coinIcon from '@/assets/images/tool/coin.png'
import textBg from '@/assets/images/tool/text_bg.png'
import treasureIcon from '@/assets/images/tool/treasure.png'
import { useCollectStore } from '@/stores/collect'
import { useDialogueStore } from '@/stores/dialogue'

const collectStore = useCollectStore()
const dialogueStore = useDialogueStore()

const visible = computed(() => collectStore.isShowCollectInfo)
const coins = computed(() => collectStore.collectCoins)
const treasureName = computed(() => collectStore.collectName)
const collectDescSignature = computed(() => {
    return collectStore.collectDesc.map(item => `${item.id}-${item.text}`).join('|')
})

const rewardList = computed(() => {
    const list: Array<{ key: string; icon: string; text: string; alt: string }> = []

    if (coins.value > 0) {
        list.push({
            key: 'coins',
            icon: coinIcon,
            text: `获得心愿币*${coins.value}`,
            alt: '心愿币'
        })
    }

    if (treasureName.value) {
        list.push({
            key: 'treasure',
            icon: treasureIcon,
            text: `获得“${treasureName.value}”`,
            alt: treasureName.value
        })
    }

    return list
})

watch(
    () => [visible.value, collectDescSignature.value] as const,
    ([isVisible, signature], previousValue) => {
        const [wasVisible, prevSignature] = previousValue ?? [false, '']

        if (!isVisible || !signature) {
            return
        }

        if (signature !== prevSignature || !wasVisible) {
            dialogueStore.setDialogueList([...collectStore.collectDesc])
            collectStore.clearCollectDesc()
        }
    },
    { immediate: true }
)
</script>

<style scoped lang="scss">
.collect-info-panel {
    position: fixed;
    right: 40px;
    bottom: 52px;
    z-index: 1990;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    width: min(360px, calc(100vw - 32px));
    pointer-events: none;
}

.reward-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 18px;
}

.reward-icon {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(0, 87, 161, 0.28));
}

.reward-text-bg {
    flex: 1;
    min-width: 0;
    height: 40px;
    padding: 0 26px;
    display: flex;
    align-items: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

.reward-text {
    color: #fff;
    font-size: 18px;
    line-height: 1.4;
    letter-spacing: 1px;
    white-space: nowrap;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    font-family: 'Source Han Serif CN', serif;
}

@media (max-width: 768px) {
    .collect-info-panel {
        right: 16px;
        bottom: 24px;
        gap: 14px;
        width: min(320px, calc(100vw - 24px));
    }

    .reward-item {
        gap: 12px;
    }

    .reward-icon {
        width: 64px;
        height: 64px;
    }

    .reward-text-bg {
        height: 34px;
        padding: 0 20px;
    }

    .reward-text {
        font-size: 15px;
    }
}
</style>
