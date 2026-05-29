<template>
    <Teleport to=".app-wrapper">
        <div v-if="visible" class="daily-rewards-mask">
            <div class="daily-rewards-container">
                <h3 class="daily-rewards-title">每日奖励</h3>

                <button class="close-btn" type="button" @click="handleClose">
                    <img src="@/assets/images/tool/icon_close.png" alt="关闭每日奖励" />
                </button>

                <div class="rewards-list">
                    <div v-for="item in rewardList" :key="item.id" class="reward-item">
                        <span class="reward-task">{{ item.taskName }}</span>
                        <span class="reward-points">{{ item.score }}</span>
                        <button
                            class="reward-btn"
                            type="button"
                            :class="{
                                'is-incomplete': item.status === 0,
                                'is-received': item.status === 2
                            }"
                            @click="handleRewardBtn(item)"
                        >
                            {{ getRewardBtnText(item.status) }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { getDailyTaskList, receiveDailyTaskReward } from '@/api/home/index'

interface RewardItem {
    id: string
    taskCode: string
    taskName: string
    score: number
    status: number
    completed: boolean
}

const visible = defineModel<boolean>('visible', { default: false })

const rewardList = ref<RewardItem[]>([])

const handleClose = () => {
    visible.value = false
}

const getRewardBtnText = (status: number) => {
    switch (status) {
        case 0:
            return '未完成'
        case 1:
            return '领取奖励'
        case 2:
            return '已领取'
        default:
            return '未知状态'
    }
}

// 领取积分
const handleRewardBtn = async (item: RewardItem) => {
    if (item.status !== 1) {
        return
    }

    try {
        const response = await receiveDailyTaskReward(item.id)
        if (response && response.data) {
            ElMessage.success('奖励领取成功！')
            // 更新任务状态为已领取
            const reward = rewardList.value.find(reward => reward.id === item.id)
            if (reward) {
                reward.status = 2 // 领取后设置为已领取
            }
        }
    } catch (error) {
        console.error('领取奖励失败:', error)
        ElMessage.error('领取奖励失败，请稍后再试')
    }
}

const initDailyRewards = async () => {
    try {
        const response = await getDailyTaskList()
        if (response && response.data) {
            console.log(response)

            rewardList.value = response.data.map((task: any) => ({
                ...task,
                completed: task.status === 1 ? true : false
            }))
        }
    } catch (error) {
        console.error('获取每日任务列表失败:', error)
    }
}

watch(visible, val => {
    if (val) {
        initDailyRewards()
    }
})
</script>

<style lang="scss" scoped>
.daily-rewards-mask {
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

.daily-rewards-container {
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

.daily-rewards-title {
    margin: 0 0 18px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    line-height: normal;
}

.rewards-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
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

.reward-item {
    display: flex;
    flex: 0 0 56px;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    min-height: 56px;
    padding: 0 14px;
    border-radius: 2px;
    background: rgba(9, 133, 244, 0.2);

    .reward-task {
        flex: 1;
        color: #fff;
        font-size: 20px;
        font-weight: 400;
    }

    .reward-points {
        width: 190px;
        text-align: left;
        color: #ebf5ff;
        font-size: 20px;
        font-weight: 600;
        line-height: 1;
    }

    .reward-btn {
        width: 97px;
        height: 36px;
        padding: 0;
        border: 0;
        background: url('@/assets/images/tool/btn_bg.png') center / contain no-repeat;
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 2px;
        cursor: pointer;

        &.is-incomplete {
            background: url('@/assets/images/tool/btn_incomplete_bg.png') center / contain no-repeat;
            color: rgba(255, 255, 255, 0.6);
            cursor: default;
        }

        &.is-received {
            background: url('@/assets/images/tool/btn_received_bg.png') center / contain no-repeat;
            color: #fff;
            cursor: default;
        }
    }
}

@media (max-width: 768px) {
    .daily-rewards-container {
        width: calc(100% - 28px);
        padding: 20px 14px 18px;
    }

    .daily-rewards-title {
        font-size: 28px;
    }

    .reward-task {
        font-size: 20px;
    }

    .reward-points {
        font-size: 18px;
    }
}
</style>
