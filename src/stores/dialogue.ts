import { defineStore } from 'pinia'

interface DialogueItem {
    id: number
    text: string
    audio: string
    duration: number
    type?: string
}

export const useDialogueStore = defineStore('dialogue', {
    state: () => ({
        isShowDialogue: false,
        dialogueList: [] as DialogueItem[] // 对话列表
    }),
    actions: {
        setShowDialogue(isShow: boolean) {
            this.isShowDialogue = isShow
        },
        setDialogueList(list: DialogueItem[]) {
            this.dialogueList = list
        },
        clearDialogueList() {
            this.dialogueList = []
        }
    }
})
