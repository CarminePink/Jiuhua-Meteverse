import { defineStore } from 'pinia'

export const useMissionStore = defineStore('mission', {
    state: () => ({
        isShowMission: false
    }),
    actions: {
        setShowMission(isShow: boolean) {
            this.isShowMission = isShow
        }
    }
})
