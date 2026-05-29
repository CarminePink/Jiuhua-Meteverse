import { defineStore } from 'pinia'

export const useRoamStore = defineStore('roam', {
    state: () => ({
        isRoaming: false,
        isPaused: false
    }),
    actions: {
        setRoamingStatus(status: boolean) {
            this.isRoaming = status
        },
        setPausedStatus(status: boolean) {
            this.isPaused = status
        }
    }
})
