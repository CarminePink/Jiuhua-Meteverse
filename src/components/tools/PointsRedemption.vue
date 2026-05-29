<template>
    <Teleport to=".app-wrapper">
        <div v-if="visible" class="points-redemption-mask">
            <div class="points-redemption-container">
                <button class="close-btn" type="button" @click="handleClose">
                    <img src="@/assets/images/tool/icon_close.png" alt="关闭积分兑换" />
                </button>

                <h3 class="points-redemption-title">积分兑换</h3>

                <div class="prizes-grid">
                    <div v-for="item in prizeList" :key="item.skinCode" class="prize-card">
                        <div class="prize-cover">
                            <img :src="item.skinImage" :alt="item.skinName" />
                            <span class="prize-points"
                                >{{ item.skinName }} | {{ item.scoreCost }}积分</span
                            >
                        </div>
                        <button
                            class="prize-btn"
                            type="button"
                            :disabled="isActionDisabled(item)"
                            @click="handleSkinAction(item)"
                        >
                            {{ getActionText(item) }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import {
    getSkinList,
    getExchangedSkins,
    exchangeSkin,
    wearSkin,
    getMyDailyTaskRank
} from '@/api/home/index'
import { useMessage } from '@/hooks/message'
import { useUserInfo } from '@/stores/userInfo'
import { useDasUE } from '@/hooks/useDasUEHook'
import { Skeletal } from '@/config/Skeletal'

const skeletalPreviewMap = new Map<string, string>(
    Object.values(Skeletal)
        .flat()
        .map(item => [item.code, item.preview])
)

interface Prize {
    skinCode: string
    skinName: string
    gender: number // 0-男 1-女 2-通用
    scoreCost: number
    skinImage: string
    skinStatus: number // 0-未兑换 1-已兑换待佩戴 2-已佩戴
}

interface SkinWearParams {
    feetName?: string
    hairName?: string
    handLName?: string
    handRName?: string
    bottomBodyName?: string
    upperBodyName?: string
    maskName?: string
}

let ueManager: any = null
const visible = defineModel<boolean>('visible', { default: false })
const userStore = useUserInfo()
const message = useMessage()
const prizeList = ref<Prize[]>([])
const actionLoadingCode = ref('')
const skinTypeToParamKey: Record<string, keyof SkinWearParams> = {
    Feet: 'feetName',
    Hair: 'hairName',
    HandL: 'handLName',
    HandR: 'handRName',
    BottomBody: 'bottomBodyName',
    UpperBody: 'upperBodyName',
    Mask: 'maskName'
}

const handleClose = () => {
    visible.value = false
}

const currentTotalScore = computed(() => Number(userStore.userInfos.totalScore ?? 0))

const getActionText = (item: Prize) => {
    if (item.skinStatus === 2) return '已佩戴'
    if (item.skinStatus === 1) return '佩戴'
    return '兑换'
}

const isActionDisabled = (item: Prize) => {
    return actionLoadingCode.value === item.skinCode || item.skinStatus === 2
}

const refreshUserTotalScore = async () => {
    const res = await getMyDailyTaskRank()
    const totalScore = Number(res?.data?.totalScore ?? userStore.userInfos.totalScore ?? 0)
    userStore.userInfos.totalScore = totalScore
}

const initSkinList = async () => {
    try {
        const gender = Number(userStore.userInfos.characterGender)
        const [skinListRes, exchangedSkinRes] = await Promise.all([
            getSkinList(),
            getExchangedSkins()
        ])
        const exchangedSkinMap = new Map<string, Prize>()

        ;(Array.isArray(exchangedSkinRes?.data) ? exchangedSkinRes.data : []).forEach(
            (item: Prize) => {
                exchangedSkinMap.set(item.skinCode, item)
            }
        )

        prizeList.value = (Array.isArray(skinListRes?.data) ? skinListRes.data : [])
            .filter((item: Prize) => item.gender === 2 || item.gender === gender)
            .map((item: Prize) => {
                const exchangedItem = exchangedSkinMap.get(item.skinCode)

                return {
                    ...item,
                    skinStatus: exchangedItem?.skinStatus ?? item.skinStatus ?? 0,
                    skinImage:
                        exchangedItem?.skinImage ||
                        item.skinImage ||
                        skeletalPreviewMap.get(item.skinCode) ||
                        ''
                }
            })
    } catch (error) {
        console.error('获取兑换奖品列表失败：', error)
        message.error('获取兑换奖品列表失败')
    }
}

const refreshSkinData = async () => {
    await Promise.all([refreshUserTotalScore(), initSkinList()])
}

const buildWearParams = (item: Prize): SkinWearParams | null => {
    const [skinType] = String(item.skinCode || '').split('_')
    const paramKey = skinTypeToParamKey[skinType]

    if (!paramKey) {
        return null
    }

    return {
        [paramKey]: item.skinName
    }
}

const handleSkinAction = async (item: Prize) => {
    if (actionLoadingCode.value) return

    if (item.skinStatus === 0 && currentTotalScore.value < Number(item.scoreCost ?? 0)) {
        message.warning('当前积分不足，无法兑换该皮肤')
        return
    }

    actionLoadingCode.value = item.skinCode

    try {
        if (item.skinStatus === 0) {
            await exchangeSkin(item.skinCode)
            message.success('兑换成功')
        }

        if (item.skinStatus === 1) {
            await wearSkin(item.skinCode)
            message.success('佩戴成功')
            if (ueManager) {
                const params = buildWearParams(item)

                if (params) {
                    await ueManager.dasThirdPersonCamera.updateAll(params)
                }
            }
        }

        await refreshSkinData()
    } catch (error) {
        console.error('皮肤操作失败：', error)
        message.error(item.skinStatus === 0 ? '兑换失败' : '佩戴失败')
    } finally {
        actionLoadingCode.value = ''
    }
}

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
    })
    initSkinList()
})
</script>

<style lang="scss" scoped>
.points-redemption-mask {
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

.points-redemption-container {
    position: relative;
    width: 680px;
    height: 485px;
    padding: 20px 24px 24px;
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
    z-index: 1;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.points-redemption-title {
    margin: 0 0 18px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    line-height: normal;
    flex-shrink: 0;
}

.prizes-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: min-content;
    gap: 14px;
    max-height: 480px;
    overflow-y: auto;
    padding-right: 4px;
    align-content: start;

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

.prize-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 6px 6px 10px;
}

.prize-cover {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 4px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.prize-points {
    position: absolute;
    top: 4px;
    left: 4px;
    padding: 2px 4px;
    border-radius: 3px;
    background: rgba(5, 20, 50, 0.65);
    color: #f4cf8c;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
}

.prize-btn {
    width: 72px;
    height: 30px;
    padding: 0;
    border: 0;
    background: url('@/assets/images/tool/btn_bg.png') center / contain no-repeat;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    cursor: pointer;
    flex-shrink: 0;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
}

@media (max-width: 768px) {
    .points-redemption-container {
        width: calc(100% - 28px);
        padding: 20px 14px 18px;
    }

    .points-redemption-title {
        font-size: 28px;
    }

    .prize-points {
        font-size: 10px;
    }
}
</style>
