<template>
    <Teleport to=".app-wrapper">
        <div v-if="visible" class="standings-mask">
            <div class="standings-container">
                <h3 class="standings-title">积分榜</h3>

                <button class="close-btn" type="button" @click="handleClose">
                    <img src="@/assets/images/tool/icon_close.png" alt="关闭积分榜" />
                </button>

                <div class="standings-table">
                    <div class="table-header">
                        <span>排名</span>
                        <span>用户</span>
                        <span>积分</span>
                    </div>

                    <div class="table-body">
                        <div
                            v-for="item in displayRankingList"
                            :key="`${item.rank}-${item.nickName}`"
                            class="table-row"
                        >
                            <span class="rank-cell">
                                <img
                                    v-if="getRankIcon(item.rank)"
                                    :src="getRankIcon(item.rank)!"
                                    :alt="`第${item.rank}名`"
                                    class="rank-icon"
                                />
                                <span v-else class="rank-text">{{ item.rank }}</span>
                            </span>
                            <span class="user-cell">{{ item.nickName }}</span>
                            <span class="score-cell" :class="{ 'score-highlight': item.rank <= 3 }">
                                {{ item.totalScore }}
                            </span>
                        </div>
                    </div>

                    <div v-if="fixedMyRanking" class="table-row table-row-fixed">
                        <span class="rank-cell">
                            <span class="rank-text">{{ fixedMyRanking.rank }}</span>
                        </span>
                        <span class="user-cell">{{ fixedMyRanking.nickName }}</span>
                        <span
                            class="score-cell"
                            :class="{ 'score-highlight': fixedMyRanking.rank <= 3 }"
                        >
                            {{ fixedMyRanking.totalScore }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { getDailyTaskRank, getMyDailyTaskRank } from '@/api/home/index'
import rankFirst from '@/assets/images/tool/first.png'
import rankSecond from '@/assets/images/tool/second.png'
import rankThird from '@/assets/images/tool/third.png'
import rankFourth from '@/assets/images/tool/fourth.png'
import rankFifth from '@/assets/images/tool/fifth.png'

interface RankingItem {
    nickName: string
    totalScore: number
    rank: number
}

const visible = defineModel<boolean>('visible', { default: false })
const TOP_RANK_LIMIT = 10

const rankIcons = [rankFirst, rankSecond, rankThird, rankFourth, rankFifth]

const rankingList = ref<RankingItem[]>([])
const myRanking = ref<RankingItem | null>(null)

const handleClose = () => {
    visible.value = false
}

const getRankValue = (item: Record<string, unknown>, fallbackRank: number) => {
    const rankFields = ['rank', 'ranking', 'rankNo', 'rankNum', 'rowNum', 'sort', 'orderNum']

    for (const field of rankFields) {
        const rank = Number(item[field])
        if (Number.isFinite(rank) && rank > 0) {
            return rank
        }
    }

    return fallbackRank
}

const normalizeRankingItem = (
    item: Record<string, unknown>,
    fallbackRank: number
): RankingItem => ({
    nickName: String(item.nickName ?? '--'),
    totalScore: Number(item.totalScore ?? 0),
    rank: getRankValue(item, fallbackRank)
})

const isSameUser = (first: RankingItem, second: RankingItem) => {
    return first.rank === second.rank && first.nickName === second.nickName
}

const isMyRankingInTopTen = computed(() => {
    if (!myRanking.value) {
        return false
    }

    return myRanking.value.rank <= TOP_RANK_LIMIT
})

const fixedMyRanking = computed(() => {
    if (!myRanking.value || isMyRankingInTopTen.value) {
        return null
    }

    return myRanking.value
})

const displayRankingList = computed(() => {
    if (!fixedMyRanking.value) {
        return rankingList.value
    }

    return rankingList.value.filter(item => !isSameUser(item, fixedMyRanking.value!))
})

const getRankIcon = (rank: number) => {
    return rankIcons[rank - 1] || ''
}

const initRankings = async () => {
    try {
        const [rankRes, myRankRes] = await Promise.all([getDailyTaskRank(), getMyDailyTaskRank()])
        if (rankRes && myRankRes) {
            const rankData = Array.isArray(rankRes.data) ? rankRes.data : []
            rankingList.value = rankData.map((item, index) =>
                normalizeRankingItem(item as Record<string, unknown>, index + 1)
            )

            myRanking.value = myRankRes.data
                ? normalizeRankingItem(
                      myRankRes.data as Record<string, unknown>,
                      rankingList.value.length + 1
                  )
                : null
        }
    } catch (error) {
        console.error('获取排行榜数据失败:', error)
    }
}

watch(visible, val => {
    if (val) {
        initRankings()
    }
})
</script>

<style lang="scss" scoped>
.standings-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    background: rgba(0, 0, 0, 0.28);
}

.standings-container {
    position: relative;
    width: 680px;
    height: 485px;
    padding: 20px;
    border-radius: 10px;
    border: none;
    background: url('@/assets/images/tool/tool_bg.png') center / 100% 100% no-repeat;
    display: flex;
    flex-direction: column;
}

.close-btn {
    position: absolute;
    top: 31px;
    right: 20px;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.standings-title {
    margin: 0 0 18px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    line-height: normal;
}

.standings-table {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    .table-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        flex: 0 0 36px;
        height: 36px;
        padding: 0 8px;
        color: #fff;
        font-size: 20px;
        font-weight: 400;
        text-align: center;

        span:last-child {
            text-align: right;
        }
        span:first-child {
            text-align: left;
        }
    }

    .table-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-right: 4px;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }
    }

    .table-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        flex: 0 0 52px;
        height: 52px;
        min-height: 52px;
        padding: 0 8px;
        border-bottom: 1px solid rgba(141, 202, 255, 0.1);
    }

    .table-row-fixed {
        flex-shrink: 0;
        margin-top: 8px;
        border-top: 1px solid rgba(141, 202, 255, 0.24);
        border-bottom: 0;
        background: rgba(9, 133, 244, 0.14);
    }

    .rank-cell {
        display: flex;
        align-items: center;
    }

    .rank-text {
        color: #fff;
        font-size: 20px;
        font-weight: 600;
        line-height: 1;
    }

    .rank-icon {
        width: 36px;
        height: 36px;
        object-fit: contain;
    }

    .user-cell {
        color: #fff;
        font-size: 20px;
        font-weight: 400;
        text-align: center;
    }

    .score-cell {
        text-align: right;
        color: #ffd37b;
        font-size: 20px;
        font-weight: 600;
    }

    .score-highlight {
        color: #f0c060;
    }
}

@media (max-width: 768px) {
    .standings-container {
        width: calc(100% - 28px);
        max-height: calc(100vh - 28px);
        padding: 20px 14px 18px;
    }

    .standings-title {
        font-size: 28px;
    }

    .standings-table {
        .table-header {
            font-size: 18px;
        }

        .table-row {
            height: 48px;
        }

        .user-cell,
        .score-cell {
            font-size: 20px;
        }

        .rank-icon {
            width: 32px;
            height: 32px;
        }
    }
}
</style>
