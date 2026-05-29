<template>
    <div v-show="visible" class="plot-info-panel">
        <div class="plot-info-backdrop">
            <Transition name="slide" mode="out-in">
                <p :key="currentIndex" class="plot-text">
                    {{ currentText }}
                </p>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChapterEnum } from '@/config/ChapterAll'
import { chapter1IntroOne, chapter1IntroThree, chapter1IntroTwo } from '@/config/Chapter1'
import { chapter2IntroOne } from '@/config/Chapter2'
import { useChapterStore } from '@/stores/chapter'
import { usePlotInfoStore } from '@/stores/plotInfo'
import { useAudioStore } from '@/stores/audio'
import { useHomeModeStore } from '@/stores/homeMode'
import { storeToRefs } from 'pinia'

interface PlotSegment {
    text: string
    audio?: string
    duration?: number
}

const props = defineProps<{
    texts: string[]
}>()

const chapterStore = useChapterStore()
const plotInfoStore = usePlotInfoStore()
const audioStore = useAudioStore()
const homeModeStore = useHomeModeStore()
const { isMuted } = storeToRefs(audioStore)
const currentIndex = ref(0)
const audioRef = shallowRef<HTMLAudioElement | null>(null)

let playbackToken = 0
let stopCurrentPlayback: (() => void) | null = null

const visible = computed(() => plotInfoStore.isShowPlotInfo)
const chapterPlotMap: Record<number, PlotSegment[]> = {
    [ChapterEnum.HuaChengSi]: [...chapter1IntroOne, ...chapter1IntroTwo, ...chapter1IntroThree],
    [ChapterEnum.YueShenDian]: [...chapter2IntroOne],
    [ChapterEnum.BaiSuiGong]: [],
    [ChapterEnum.QiYuanSi]: []
}

const plotSegments = computed<PlotSegment[]>(() => {
    const chapterPlots = chapterPlotMap[chapterStore.currentChapter] || []
    const segmentMap = new Map(chapterPlots.map(item => [item.text, item]))

    return props.texts.map(text => {
        const segment = segmentMap.get(text)

        return {
            text,
            audio: segment?.audio,
            duration: segment?.duration
        }
    })
})

const currentText = computed(() => plotSegments.value[currentIndex.value]?.text || '')

const stopPlayback = () => {
    playbackToken++
    stopCurrentPlayback?.()
    stopCurrentPlayback = null

    if (audioRef.value) {
        audioRef.value.pause()
        audioRef.value.currentTime = 0
        audioRef.value = null
    }
}

const waitForAudio = (audio: HTMLAudioElement, segment: PlotSegment) => {
    return new Promise<'ended' | 'fallback' | 'stopped'>(resolve => {
        let finished = false
        let fallbackTimer: number | null = null

        const cleanup = () => {
            audio.onended = null
            audio.onerror = null
            if (fallbackTimer !== null) {
                window.clearTimeout(fallbackTimer)
            }
            if (stopCurrentPlayback === stopHandler) {
                stopCurrentPlayback = null
            }
        }

        const done = (result: 'ended' | 'fallback' | 'stopped') => {
            if (finished) return
            finished = true
            cleanup()
            resolve(result)
        }

        const stopHandler = () => done('stopped')
        stopCurrentPlayback = stopHandler

        audio.onended = () => done('ended')
        audio.onerror = () => {
            fallbackTimer = window.setTimeout(
                () => {
                    done('fallback')
                },
                (segment.duration || 0) * 1000 + 1000
            )
        }

        audio.play().catch(() => {
            fallbackTimer = window.setTimeout(
                () => {
                    done('fallback')
                },
                (segment.duration || 0) * 1000 + 1000
            )
        })
    })
}

const playSequence = async () => {
    stopPlayback()

    // 剧情播放期间暂停自动漫游
    homeModeStore.pauseRoam()

    const token = playbackToken
    currentIndex.value = 0

    while (
        token === playbackToken &&
        visible.value &&
        currentIndex.value < plotSegments.value.length
    ) {
        const segment = plotSegments.value[currentIndex.value]

        if (!segment) {
            break
        }

        if (!segment.audio) {
            break
        }

        const audio = new Audio(segment.audio)
        audio.muted = isMuted.value
        audioRef.value = audio

        const result = await waitForAudio(audio, segment)

        if (token !== playbackToken || !visible.value || result === 'stopped') {
            break
        }

        audioRef.value = null

        if (currentIndex.value < plotSegments.value.length - 1) {
            await new Promise(resolve => {
                window.setTimeout(resolve, 1000)
            })
            currentIndex.value++
            continue
        }

        break
    }

    if (token === playbackToken && plotSegments.value.length > 0) {
        currentIndex.value = Math.min(currentIndex.value, plotSegments.value.length - 1)
    }

    // 所有剧情播放完毕，自动隐藏
    if (token === playbackToken && visible.value) {
        plotInfoStore.setShowPlotInfo(false)
    }

    // 剧情播放结束，恢复自动漫游
    if (token === playbackToken && homeModeStore.isRoamMode) {
        homeModeStore.resumeRoam()
    }
}

watch(isMuted, muted => {
    if (audioRef.value) {
        audioRef.value.muted = muted
    }
})

watch(
    [visible, () => chapterStore.currentChapter, () => props.texts.slice()],
    ([isVisible, , texts]) => {
        if (isVisible && texts.length > 0) {
            playSequence()
            return
        }

        stopPlayback()
        currentIndex.value = 0
    },
    { immediate: true }
)

onBeforeUnmount(() => {
    stopPlayback()
})
</script>

<style scoped lang="scss">
.plot-info-panel {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    max-width: 1050px;
    z-index: 9999;
    pointer-events: auto;
}

.plot-info-backdrop {
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
    overflow: hidden;
}

.plot-text {
    margin: 0;
    color: #fff;
    text-align: justify;
    font-family: 'Source Han Serif CN', serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.8;
    letter-spacing: 1px;
    text-indent: 2em;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.4s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
