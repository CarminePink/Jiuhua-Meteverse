import { defineStore } from 'pinia'

export interface CollectDialogueItem {
    id: number
    text: string
    audio: string
    duration: number
    type?: string
}

interface CollectPayload {
    name?: string
    desc?: CollectDialogueItem[]
    coins?: number
}

const DEFAULT_DURATION = 6000
let hideTimer: ReturnType<typeof setTimeout> | null = null

export const useCollectStore = defineStore('collect', {
    state: () => ({
        isShowCollectInfo: false,
        collectName: '',
        collectDesc: [] as CollectDialogueItem[],
        collectCoins: 0
    }),
    actions: {
        showCollectInfo(payload: CollectPayload, duration = DEFAULT_DURATION) {
            if (hideTimer) {
                clearTimeout(hideTimer)
                hideTimer = null
            }

            this.isShowCollectInfo = true
            this.collectName = payload.name ?? ''
            this.collectDesc = payload.desc ?? []
            this.collectCoins = payload.coins ?? 0

            if (duration > 0) {
                hideTimer = setTimeout(() => {
                    this.hideCollectInfo()
                }, duration)
            }
        },
        hideCollectInfo() {
            this.isShowCollectInfo = false

            if (hideTimer) {
                clearTimeout(hideTimer)
                hideTimer = null
            }
        },
        clearCollectDesc() {
            this.collectDesc = []
        },
        resetCollectInfo() {
            this.hideCollectInfo()
            this.collectName = ''
            this.collectDesc = []
            this.collectCoins = 0
        }
    }
})
