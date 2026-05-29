<template>
    <div class="right-panel-container">
        <slot name="content"></slot>
        <div class="right-bottom-deco"></div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@keyframes panelContentShow {
    0% {
        margin-top: 80px;
        opacity: 0;
    }
    100% {
        margin-top: 0px;
        opacity: 1;
    }
}
.right-panel-container {
    width: 2250px;
    height: calc(100% - 240px);
    position: absolute;
    right: 0;
    top: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 150px 0 0;
    padding-right: 150px;
    .right-bottom-deco {
        position: absolute;
        z-index: 2000;
        bottom: 68px;
        right: 216px;
        width: 216px;
        height: 207px;
        background: url('@/assets/images/common/img_crane.png') center center / 100% no-repeat;
    }
    // 右侧面板信息公共样式，写在right-panel-content中
    :deep(.right-panel-content) {
        position: relative;
        z-index: 2000;
        animation: panelContentShow 0.5s ease-in-out;
        .scene-control-btns {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 70px;
            display: flex;
            align-items: center;
            .skip-btn {
                width: 353px;
                height: 131px;
                cursor: pointer;
                & + .skip-btn {
                    margin-left: 70px;
                }
            }
        }
        .info-title {
            font-size: 100px;
            font-weight: 600;
            letter-spacing: 10px;
            display: inline-block;
        }
        .info-subtitle {
            font-size: 70px;
            color: #fff;
            letter-spacing: 7px;
            margin: 60px 0;
        }
        .info-introduce {
            font-size: 50px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 80px;
        }
        .info-content-title {
            width: 675px;
            height: 122px;
            background: url('@/assets/images/common/bg_info_title.png') center center / 100%
                no-repeat;
            text-align: center;
            display: inline-flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: 4px;
            margin: 60px 0 40px 0;

            .info-content-title-text {
                font-size: 50px;
                letter-spacing: 25px;
                font-weight: 700;
                background: linear-gradient(
                    90deg,
                    #d8d4a3 8.48%,
                    #fbf7c3 25.45%,
                    #e7d9a2 46.06%,
                    #ccb38e 81.21%,
                    #af9a6a 100%
                );
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .info-items {
            .info-items-row {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 60px;
            }
            .info-item {
                text-align: right;
                letter-spacing: 2px;

                .info-item-value {
                    margin-bottom: 8px;

                    .value-number {
                        font-size: 70px;
                        font-weight: bold;
                        color: #fff6e8;
                        margin: 0 15px;
                        font-family: 'Source Han Sans CN';
                    }

                    .value-unit {
                        font-size: 40px;
                        color: #fff6e8;
                        margin-left: 4px;
                    }

                    .value-name {
                        font-size: 60px;
                        font-weight: bold;
                        color: #fff6e8;
                    }
                }

                .info-item-label {
                    font-size: 50px;
                    color: #ffe2b4;
                }
            }
        }

        .info-content-list {
            margin-top: 40px;

            .card-list-container {
                position: relative;
                padding: 0 120px;

                .card-list {
                    .card-row {
                        display: flex;
                        // justify-content: space-between;
                        margin-bottom: 40px;
                        gap: 90px;

                        &:last-child {
                            margin-bottom: 0;
                        }
                    }

                    .card-item {
                        color: #fff;
                        text-align: center;
                        cursor: pointer;
                        flex-shrink: 0;

                        .card-item-cover {
                            width: 300px;
                            height: 200px;
                            border-radius: 8px;
                            overflow: hidden;
                            img {
                                height: 100%;
                                width: 100%;
                                object-fit: cover;
                                transition: all 0.3s ease-in-out;
                            }
                            &:hover {
                                img {
                                    transform: scale(1.15);
                                }
                            }
                        }

                        .card-item-name {
                            margin-top: 20px;
                            font-size: 40px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                }

                .prev-icon,
                .next-icon {
                    position: absolute;
                    cursor: pointer;
                    width: 58px;
                    height: 55px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    transition: opacity 0.3s ease;

                    &.disabled {
                        opacity: 0.8;
                        cursor: not-allowed;
                    }

                    &:not(.disabled):hover {
                        opacity: 0.8;
                    }
                }

                .prev-icon {
                    left: 0;
                }

                .next-icon {
                    right: 0;
                }
            }
        }

        .info-totals {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin: 40px 0;

            .total-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 100px;
                color: #ffe2b4;

                .total-circle {
                    width: 190px;
                    height: 190px;
                    background-image: url('@/assets/images/resource/bg_total.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 15px;

                    .total-value {
                        display: flex;
                        align-items: baseline;

                        .total-number {
                            font-size: 50px;
                            font-weight: bold;
                            line-height: 1;
                        }

                        .total-unit {
                            font-size: 24px;
                            margin-left: 5px;
                        }
                    }
                }

                .total-label {
                    font-size: 34px;
                    text-align: center;
                }
            }
        }

        .info-small-subtitle {
            font-size: 32px;
            color: #e1bb82;
            display: flex;
            align-items: center;
            img {
                width: 35px;
                height: 35px;
                margin-right: 17px;
            }
        }
    }
}
</style>
