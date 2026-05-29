import { defineStore } from 'pinia'

export const usePlotInfoStore = defineStore('plotInfo', {
    state: () => ({
        isShowPlotInfo: false
    }),
    actions: {
        setShowPlotInfo(isShow: boolean) {
            this.isShowPlotInfo = isShow
        }
    }
})
