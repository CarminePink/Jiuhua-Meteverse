<template>
    <div v-show="visible" class="dialogue-panel">
        <div class="dialogue-backdrop">
            <p class="dialogue-text">{{ currentText }}</p>
            <!-- 祝福语选择区域 -->
            <div v-if="showBlessOptions" class="bless-section">
                <span class="bless-hint">选择放孔明灯的祝福语</span>
                <div class="bless-options">
                    <button
                        v-for="item in blessOptions"
                        :key="item"
                        class="bless-btn"
                        @click="handleBlessSelect(item)"
                    >
                        {{ item }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDialogueStore } from '@/stores/dialogue'
import { useAudioStore } from '@/stores/audio'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
    (e: 'complete', id: string, blessing?: string): void
}>()

const dialogueStore = useDialogueStore()
const audioStore = useAudioStore()
const { isMuted } = storeToRefs(audioStore)
const currentIndex = ref(0)
const audioRef = shallowRef<HTMLAudioElement | null>(null)
const showBlessOptions = ref(false)

const blessOptions = ['愿父母安康', '愿平安顺遂', '愿财源滚滚']

const visible = computed(() => {
    return dialogueStore.isShowDialogue
})
const dialogues = computed(() => {
    return dialogueStore.dialogueList
})

const currentText = computed(() => {
    if (currentIndex.value < dialogues.value.length) {
        return dialogues.value[currentIndex.value].text
    }
    return ''
})

const handleBlessSelect = (blessing: string) => {
    showBlessOptions.value = false
    dialogueStore.setShowDialogue(false)
    emit('complete', 'bless', blessing)
}

const resetDialogueState = () => {
    currentIndex.value = 0
    showBlessOptions.value = false

    if (audioRef.value) {
        audioRef.value.pause()
        audioRef.value.currentTime = 0
        audioRef.value = null
    }
}

const playCurrentDialogue = () => {
    if (currentIndex.value >= dialogues.value.length) {
        const lastItem = dialogues.value[currentIndex.value - 1]
        // 最后一句对白 type 为 bless 时，显示祝福语选择
        if (lastItem?.type === 'bless') {
            showBlessOptions.value = true
            return
        }
        dialogueStore.setShowDialogue(false)
        emit('complete', lastItem?.type || '')
        return
    }

    const item = dialogues.value[currentIndex.value]

    if (audioRef.value) {
        audioRef.value.pause()
        audioRef.value = null
    }

    const audio = new Audio(item.audio)
    audio.muted = isMuted.value
    audioRef.value = audio

    audio.addEventListener('ended', () => {
        setTimeout(() => {
            currentIndex.value++
            playCurrentDialogue()
        }, 1000)
    })

    audio.play().catch(() => {
        // 音频播放失败时，使用 duration 兜底
        setTimeout(
            () => {
                currentIndex.value++
                playCurrentDialogue()
            },
            item.duration * 1000 + 1000
        )
    })
}

watch(isMuted, muted => {
    if (audioRef.value) {
        audioRef.value.muted = muted
    }
})

watch(
    () => dialogueStore.dialogueList,
    val => {
        if (val && val.length > 0) {
            resetDialogueState()
            dialogueStore.setShowDialogue(true)
            playCurrentDialogue()
            return
        }

        resetDialogueState()
    },
    { immediate: true }
)

watch(visible, isVisible => {
    if (!isVisible) {
        resetDialogueState()
    }
})

onBeforeUnmount(() => {
    resetDialogueState()
})
</script>

<style scoped lang="scss">
.dialogue-panel {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    max-width: 1050px;
    z-index: 9999;
    pointer-events: auto;

    .dialogue-backdrop {
        padding: 49px 54px 48px 53px;
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

    .dialogue-text {
        color: #fff;
        font-size: 18px;
        line-height: 1.8;
        text-align: justify;
        letter-spacing: 1px;
        font-family: 'Source Han Serif CN', serif;
        margin: 0;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    }

    .bless-section {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: 20px;

        .bless-hint {
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
            font-family: 'Source Han Serif CN', serif;
            letter-spacing: 1px;
            flex-shrink: 0;
        }

        .bless-options {
            display: flex;
            gap: 16px;

            .bless-btn {
                background: url('@/assets/images/tool/btn_guide.png') no-repeat center / 100% 100%;
                border: none;
                color: #fff;
                font-size: 15px;
                font-family: 'Source Han Serif CN', serif;
                letter-spacing: 1px;
                padding: 10px 24px;
                cursor: pointer;
                transition:
                    transform 0.2s,
                    filter 0.2s;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

                &:hover {
                    transform: scale(1.05);
                    filter: brightness(1.2);
                }
            }
        }
    }
}
</style>
