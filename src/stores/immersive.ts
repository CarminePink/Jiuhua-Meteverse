import { defineStore } from 'pinia'

export const useImmersiveStore = defineStore('immersive', {
    state: () => ({
        activeSequenceCount: 0
    }),
    getters: {
        isImmersiveMode: state => state.activeSequenceCount > 0
    },
    actions: {
        enterImmersiveMode() {
            this.activeSequenceCount += 1
        },
        exitImmersiveMode() {
            this.activeSequenceCount = Math.max(0, this.activeSequenceCount - 1)
        },
        resetImmersiveMode() {
            this.activeSequenceCount = 0
        }
    }
})
