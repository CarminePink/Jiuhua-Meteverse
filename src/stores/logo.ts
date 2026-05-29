import { defineStore } from 'pinia'

export const useLogoStore = defineStore('logo', {
    state: () => ({
        isShowLogo: true
    }),
    actions: {
        setShowLogo(isShow) {
            this.isShowLogo = isShow
        }
    }
})
