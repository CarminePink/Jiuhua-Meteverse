<template>
    <div class="scroll-paint-modal-contanier">
        <div class="modal-mask"></div>
        <div class="scroll-paint-modal">
            <div class="modal-close-btn common-modal-border" @click="closeModal">
                <span>关闭</span>
                <img src="@/assets/images/common/icon_mist_right.png" />
            </div>
            <div class="modal-content">
                <div class="detail-left">
                    <el-image :src="props.detailData?.image" fit="contain" class="detail-image" />
                </div>
                <div class="detail-right">
                    <div class="detail-title">
                        <img src="@/assets/images/common/icon_title_deco.png" />
                        <span class="detail-title-text">{{ props.detailData?.title }}</span>
                        <img src="@/assets/images/common/icon_title_deco.png" />
                    </div>
                    <div class="detail-remark">{{ props.detailData?.remark }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['close'])
const props = defineProps({
    detailData: {
        type: Object,
        default: () => {}
    }
})
const closeModal = () => {
    emit('close')
}
</script>

<style scoped lang="scss">
.scroll-paint-modal-contanier {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 1002;
    .modal-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #00000099;
        backdrop-filter: blur(25px);
    }
}
.scroll-paint-modal {
    position: absolute;
    width: 3343px;
    height: 1597px;
    padding: 57px 85px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('@/assets/images/common/info_modal_bg.png') center center / 100% 100% no-repeat;
    .modal-close-btn {
        position: absolute;
        width: 236px;
        height: 99px;
        border-radius: 50px;
        line-height: 99px;
        text-align: center;
        background: rgba(33, 32, 29, 0.8);
        backdrop-filter: blur(4px);
        color: #f5e9d2;
        bottom: -140px;
        left: calc(50% - 118px);
        font-size: 50px;
        cursor: pointer;
        &::before {
            border-radius: 50px;
        }
        img {
            position: absolute;
            bottom: -8px;
            right: -52px;
            width: 136px;
        }
    }
    .modal-content {
        width: 100%;
        height: 100%;
        padding: 250px 220px 250px 250px;
        display: flex;
        justify-content: space-between;
        .detail-left {
            width: calc(100% - 1900px);
            height: 848px;
        }
        .detail-right {
            width: 1856px;
            height: 848px;
            padding-left: 100px;
            .detail-title {
                color: #6a3906;
                font-size: 100px;
                font-weight: 700;
                text-align: center;
                margin-bottom: 60px;
                background: linear-gradient(
                    90deg,
                    rgba(225, 187, 130, 0) 0%,
                    rgba(255, 222, 136, 0.44) 18.5%,
                    #d7c3a1 48%,
                    rgba(255, 222, 136, 0.44) 77%,
                    rgba(225, 187, 130, 0) 100%
                );
                img {
                    width: 77px;
                    height: 77px;
                }
                .detail-title-text {
                    margin: 0 60px;
                }
            }
            .detail-remark {
                padding-right: 30px;
                color: #1b1b1b;
                font-size: 50px;
                text-align: justify;
                line-height: 1.6;
                height: 840px;
                overflow-y: auto;
            }
        }
    }
}
</style>
