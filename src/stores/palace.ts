import { defineStore } from 'pinia'

export const usePalaceStore = defineStore('palace', {
    state: () => ({
        isShowPalaceModal: false
    }),
    actions: {
        setShowPalaceModal(isShow) {
            this.isShowPalaceModal = isShow
        }
    }
})
