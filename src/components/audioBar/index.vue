<template>
    <div class="audio-wrap">
        <audio
            ref="audioRef"
            class="audio-raw"
            :src="url"
            :preload="audio.preload"
            @play="onPlay"
            @error="onError"
            @pause="onPause"
            @timeupdate="onTimeupdate"
            @loadedmetadata="onLoadedmetadata"
        ></audio>
        <div class="control-bar">
            <div class="control-info">
                <div class="control-info-left">
                    <img
                        class="icon-control"
                        @click="startPlayOrPause"
                        v-if="audio.playing"
                        src="@/assets/images/tool/icon_playing.png"
                    />
                    <img
                        class="icon-control"
                        @click="startPlayOrPause"
                        v-else
                        src="@/assets/images/tool/icon_paused.png"
                    />
                    <span
                        >{{ formatTime(audio.currentTime) }} / {{ formatTime(audio.maxTime) }}</span
                    >
                </div>
                <img class="icon-volume" src="@/assets/images/tool/icon_volume.png" />
            </div>
            <div class="progress-bar">
                <div
                    class="current-time"
                    :style="{ width: (audio.currentTime / audio.maxTime) * 100 + '%' }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    audioSrc: {
        type: String,
        default: ''
    }
})

let audioRef = ref()
let audio = ref({
    currentTime: 0,
    maxTime: 0,
    playing: false,
    muted: false,
    speed: 1,
    waiting: true,
    preload: 'auto'
})
let url = ref(props.audioSrc)

const startPlayOrPause = event => {
    event.stopPropagation()
    return audio.value.playing ? pausePlay() : startPlay()
}
// 开始播放
const startPlay = () => {
    audioRef.value.play()
}
// 暂停
const pausePlay = () => {
    audioRef.value.pause()
}
// 当音频暂停
const onPause = () => {
    audio.value.playing = false
}
// 当发生错误
const onError = () => {
    audio.value.waiting = true
}
// 当音频开始播放
const onPlay = () => {
    audio.value.playing = true
}

// 时间更新
const onTimeupdate = res => {
    // console.log(res.target.currentTime)
    audio.value.currentTime = res.target.currentTime
}
const onLoadedmetadata = res => {
    audio.value.waiting = false
    audio.value.maxTime = parseInt(res.target.duration)
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}
</script>
<style lang="scss" scoped>
.audio-wrap {
    width: 100%;
}
.control-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    .control-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #e1bb82;
        font-size: 24px;
        margin-bottom: 20px;
        .control-info-left {
            display: flex;
            align-items: center;
        }
        .icon-control {
            width: 20px;
            height: 28px;
            cursor: pointer;
            margin-right: 20px;
        }
        .icon-volume {
            width: 30px;
        }
    }
    .progress-bar {
        width: 100%;
        height: 14px;
        background: #e1bb821a;
        border-radius: 7px;
        margin: 0 20px 0 10px;
        overflow: hidden;
        .current-time {
            height: 100%;
            background: #e1bb82;
        }
    }
}
</style>
