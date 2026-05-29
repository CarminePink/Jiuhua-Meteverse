import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
    state: () => ({
        isShowMenu: true
    }),
    actions: {
        setShowMenu(isShow) {
            this.isShowMenu = isShow
        }
    }
})
