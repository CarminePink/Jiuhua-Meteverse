import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudioStore = defineStore('audio', () => {
    const isMuted = ref(false)

    function toggleMute() {
        isMuted.value = !isMuted.value
    }

    /** 根据当前静音状态设置 audio 实例 */
    function applyMute(audio: HTMLAudioElement) {
        audio.muted = isMuted.value
    }

    return { isMuted, toggleMute, applyMute }
})
