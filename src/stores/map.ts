import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
    state: () => ({
        isShowMap: false,
        activeMarker: '化城寺', // 当前激活的地图标记
        pendingJumpMarker: '' // 待跳转的地图点位
    }),
    actions: {
        setShowMap(isShow: boolean) {
            this.isShowMap = isShow
        },
        setActiveMarker(markerName: string) {
            this.activeMarker = markerName
        },
        requestChapterJump(markerName: string) {
            this.activeMarker = markerName
            this.pendingJumpMarker = markerName
        },
        clearPendingChapterJump() {
            this.pendingJumpMarker = ''
        }
    }
})
