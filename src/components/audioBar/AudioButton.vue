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
        <div class="control-btn">
            <img
                class="icon-control"
                @click="startPlayOrPause"
                v-if="audio.playing"
                :src="props.iconPaused"
            />
            <img class="icon-control" @click="startPlayOrPause" v-else :src="props.iconPlaying" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import iconBtnPaused from '@/assets/images/common/btn_paused.png'
import iconBtnPlaying from '@/assets/images/common/btn_playing.png'

const props = defineProps({
    audioSrc: {
        type: String,
        default: ''
    },
    iconPaused: {
        type: String,
        default: iconBtnPaused
    },
    iconPlaying: {
        type: String,
        default: iconBtnPlaying
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
</script>
<style lang="scss" scoped>
.audio-wrap {
    width: 100%;
    height: 100%;
}
.control-btn {
    .icon-control {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
}
</style>
