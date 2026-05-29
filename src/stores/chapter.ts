import { defineStore } from 'pinia'
import { ChapterInfo, ChapterEnum } from '@/config/ChapterAll'

export const useChapterStore = defineStore('chapter', {
    state: () => ({
        currentChapter: ChapterEnum.HuaChengSi, // 当前章节，默认为“化城寺”
        chapterPlotInfo: [] as string[], // 当前章节剧情信息
        chapterMissionTarget: '', // 当前章节任务目标
        chapterMissionClue: '' // 当前章节任务线索
    }),
    actions: {
        setCurrentChapter(chapter: ChapterEnum) {
            this.currentChapter = chapter
            this.chapterMissionTarget = ChapterInfo[chapter].missionTarget
            this.chapterMissionClue = ChapterInfo[chapter].missionClue
        },
        setChapterPlotInfo(plotInfo: string[]) {
            this.chapterPlotInfo = plotInfo
        }
    }
})
