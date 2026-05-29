import { defineStore } from 'pinia'

export const useNavStore = defineStore('nav', {
    state: () => ({
        currentNav: '',
        menuType: 'home' // 当前菜单类型：home 或 resource
    }),
    actions: {
        setCurrentNav(nav: string) {
            this.currentNav = nav
        },
        setMenuType(type: string) {
            if (type !== this.menuType) {
                this.menuType = type
                this.currentNav = ''
            }
        },
        resetNav() {
            this.currentNav = ''
        }
    }
})
