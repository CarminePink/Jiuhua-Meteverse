<template>
    <Teleport to=".app-wrapper">
        <div v-if="visible" class="my-bag-popup">
            <div class="my-bag-container">
                <button class="close-btn" type="button" @click="handleClose">
                    <img src="@/assets/images/tool/icon_close.png" alt="关闭我的背包" />
                </button>

                <h3 class="my-bag-title">我的背包</h3>

                <div class="bag-grid">
                    <div v-for="item in cardList" :key="item.code" class="bag-card-item">
                        <img
                            v-if="item.collected"
                            class="bag-card-image"
                            :src="item.image"
                            :alt="item.name"
                        />
                        <div v-else class="bag-card-placeholder">
                            <span class="placeholder-mark">?</span>
                            <span class="placeholder-scene">{{ item.name }}</span>
                            <span class="placeholder-tip">待收集宝藏卡牌</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { getCardList, getObtainedCards } from '@/api/home/index'
import bagBSG from '@/assets/images/tool/bag_BSG.png'
import bagHCS from '@/assets/images/tool/bag_HCS.png'
import bagQYS from '@/assets/images/tool/bag_QYS.png'
import bagYSD from '@/assets/images/tool/bag_YSD.png'

interface CardItem {
    code: string
    name: string
    image: string
    collected: boolean
}

interface ApiCardItem {
    cardCode?: string
}

const visible = defineModel<boolean>('visible', { default: false })

const defaultCardList: Omit<CardItem, 'collected'>[] = [
    {
        code: 'BP_YSD_BaoZang',
        name: '月身殿',
        image: bagYSD
    },
    {
        code: 'QYS_BaoZang',
        name: '祇园寺',
        image: bagQYS
    },
    {
        code: 'HCS_BaoZang',
        name: '化城寺',
        image: bagHCS
    },
    {
        code: 'BSG_BaoZang',
        name: '百岁宫',
        image: bagBSG
    }
]

const validCardCodeSet = new Set(defaultCardList.map(item => item.code))

const cardList = ref<CardItem[]>(defaultCardList.map(item => ({ ...item, collected: false })))

const handleClose = () => {
    visible.value = false
}

const normalizeCardCodes = (list: ApiCardItem[]) => {
    return new Set(
        list
            .map(item => String(item.cardCode ?? '').trim())
            .filter(code => validCardCodeSet.has(code))
    )
}

const buildCardList = (allCards: ApiCardItem[], obtainedCards: ApiCardItem[]) => {
    const allCardCodes = normalizeCardCodes(allCards)
    const obtainedCardCodes = normalizeCardCodes(obtainedCards)
    const displayList = defaultCardList.filter(
        item => allCardCodes.size === 0 || allCardCodes.has(item.code)
    )

    return displayList.map(item => ({
        ...item,
        collected: obtainedCardCodes.has(item.code)
    }))
}

const initMyBag = async () => {
    try {
        const [cardListRes, obtainedCardsRes] = await Promise.all([
            getCardList(),
            getObtainedCards()
        ])
        const allCards = Array.isArray(cardListRes?.data) ? (cardListRes.data as ApiCardItem[]) : []
        const obtainedCards = Array.isArray(obtainedCardsRes?.data)
            ? (obtainedCardsRes.data as ApiCardItem[])
            : []

        cardList.value = buildCardList(allCards, obtainedCards)
    } catch (error) {
        console.error('获取我的背包数据失败:', error)
        cardList.value = buildCardList([], [])
    }
}

watch(visible, value => {
    if (value) {
        initMyBag()
    }
})
</script>

<style lang="scss" scoped>
.my-bag-popup {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    pointer-events: none;
}

.my-bag-container {
    position: relative;
    width: 680px;
    height: 650px;
    padding: 20px 40px 30px;
    border-radius: 10px;
    border: none;
    background: url('@/assets/images/tool/bag_bg.png') center / 100% 100% no-repeat;

    pointer-events: auto;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.my-bag-title {
    margin: 0 0 28px;
    color: #fff;
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    line-height: 1;
}

.bag-grid {
    display: grid;
    grid-template-columns: repeat(3, 175px);
    justify-content: center;
    gap: 24px 22px;
}

.bag-card-item {
    width: 175px;
    height: 253px;
}

.bag-card-image,
.bag-card-placeholder {
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 2px;
}

.bag-card-image {
    object-fit: cover;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}

.bag-card-placeholder {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 18px;
    border: 1px dashed rgba(207, 226, 244, 0.45);
    background: linear-gradient(
        180deg,
        rgba(224, 238, 249, 0.1) 0%,
        rgba(121, 151, 177, 0.16) 100%
    );
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.placeholder-mark {
    color: rgba(255, 255, 255, 0.9);
    font-size: 86px;
    font-weight: 300;
    line-height: 1;
}

.placeholder-scene {
    margin-top: 16px;
    color: #fff;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.2;
}

.placeholder-tip {
    margin-top: 12px;
    color: rgba(222, 235, 247, 0.88);
    font-size: 16px;
    line-height: 1.5;
    text-align: center;
}

@media (max-width: 768px) {
    .my-bag-container {
        width: calc(100vw - 24px);
        padding: 48px 18px 24px;
    }

    .my-bag-title {
        margin-bottom: 24px;
        font-size: 28px;
    }

    .bag-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
    }

    .bag-card-item {
        width: 100%;
        height: auto;
        aspect-ratio: 190 / 275;
    }

    .placeholder-mark {
        font-size: 56px;
    }

    .placeholder-scene {
        font-size: 22px;
    }

    .placeholder-tip {
        font-size: 14px;
    }
}
</style>
