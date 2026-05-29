import { defineStore } from 'pinia'

export enum HomeVisitMode {
    Roam = 'roam',
    Treasure = 'treasure',
    Free = 'free'
}

export const HOME_VISIT_MODE_LIST = [
    {
        mode: HomeVisitMode.Roam,
        label: '漫游模式',
        taskCode: 'AUTO_ROAM'
    },
    {
        mode: HomeVisitMode.Treasure,
        label: '探秘寻宝'
    },
    {
        mode: HomeVisitMode.Free,
        label: '自由模式',
        taskCode: 'FREE_MODE'
    }
] as const

export const DEFAULT_HOME_VISIT_MODE = HomeVisitMode.Treasure

export const useHomeModeStore = defineStore('homeMode', {
    state: () => ({
        currentMode: DEFAULT_HOME_VISIT_MODE as HomeVisitMode,
        isRoamPaused: false // 自动漫游是否因剧情/对白暂停
    }),
    getters: {
        currentModeIndex: state => {
            const index = HOME_VISIT_MODE_LIST.findIndex(item => item.mode === state.currentMode)
            return index === -1 ? 1 : index
        },
        currentModeLabel: state => {
            return (
                HOME_VISIT_MODE_LIST.find(item => item.mode === state.currentMode)?.label ??
                '探秘寻宝'
            )
        },
        isRoamMode: state => state.currentMode === HomeVisitMode.Roam
    },
    actions: {
        setCurrentMode(mode: HomeVisitMode) {
            this.currentMode = mode
        },
        setCurrentModeByIndex(index: number) {
            const targetMode = HOME_VISIT_MODE_LIST[index]

            if (!targetMode) {
                return
            }

            this.currentMode = targetMode.mode
        },
        resetCurrentMode() {
            this.currentMode = DEFAULT_HOME_VISIT_MODE
        },
        pauseRoam() {
            if (this.currentMode === HomeVisitMode.Roam) {
                this.isRoamPaused = true
            }
        },
        resumeRoam() {
            this.isRoamPaused = false
        }
    }
})
