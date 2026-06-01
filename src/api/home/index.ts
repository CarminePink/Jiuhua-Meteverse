import request from '@/utils/request'

// 获取当日任务列表
export function getDailyTaskList() {
    return request({
        url: '/metaverseBiz/meta/client/daily-task/list',
        method: 'get'
    })
}

// 完成指定任务
export function completeDailyTask(taskCode: string) {
    return request({
        url: `/metaverseBiz/meta/client/daily-task/complete/${taskCode}`,
        method: 'post'
    })
}

// 领取积分
export function receiveDailyTaskReward(id: string) {
    return request({
        url: `/metaverseBiz/meta/client/daily-task/claim/${id}`,
        method: 'post'
    })
}

// 积分排行榜
export function getDailyTaskRank() {
    return request({
        url: '/metaverseBiz/meta/client/daily-task/score-rank',
        method: 'get'
    })
}

// 我的积分排行
export function getMyDailyTaskRank() {
    return request({
        url: '/metaverseBiz/meta/client/daily-task/my-score-rank',
        method: 'get'
    })
}

// 皮肤列表
export function getSkinList() {
    return request({
        url: '/metaverseBiz/meta/client/skin/list',
        method: 'get'
    })
}

// 积分兑换皮肤
export function exchangeSkin(skinCode: string) {
    return request({
        url: `/metaverseBiz/meta/client/skin/exchange/${skinCode}`,
        method: 'post'
    })
}

// 已兑换的皮肤列表
export function getExchangedSkins() {
    return request({
        url: '/metaverseBiz/meta/client/skin/my',
        method: 'get'
    })
}

// 佩戴皮肤
export function wearSkin(skinCode: string) {
    return request({
        url: `/metaverseBiz/meta/client/skin/wear/${skinCode}`,
        method: 'put'
    })
}

// 卡牌列表
export function getCardList() {
    return request({
        url: '/metaverseBiz/meta/client/card/list',
        method: 'get'
    })
}

// 保存获得的卡牌
export function saveCard(cardCode: string) {
    return request({
        url: `/metaverseBiz/meta/client/card/obtain/${cardCode}`,
        method: 'post'
    })
}

// 获得的卡牌列表
export function getObtainedCards() {
    return request({
        url: '/metaverseBiz/meta/client/card/my',
        method: 'get'
    })
}

// 闯关答题列表
export function getChallengeList() {
    return request({
        url: '/metaverseBiz/meta/client/question/list',
        method: 'get'
    })
}

// 心跳
export function heartbeat() {
    return request({
        url: '/metaverseBiz/meta/client/daily-task/heartbeat',
        method: 'post'
    })
}

let heartbeatTimer: ReturnType<typeof setInterval> | null = null

export const startHeartbeat = (interval = 30 * 1000) => {
    if (heartbeatTimer) return
    heartbeat()
    heartbeatTimer = setInterval(() => {
        heartbeat()
    }, interval)
}

export const stopHeartbeat = () => {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer)
        heartbeatTimer = null
    }
}
