<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import BeginText from './beginText.vue'
import ChapterText from './chapterText.vue'
defineProps<{ msg: string }>()

const onMessage = inject('onMessage')
const showIntroText = ref(false) // 首页介绍显隐
const showChapterText = ref(false) // 章节标题显隐

const currentStep = ref(0)
watch(
    () => currentStep.value,
    newValue => {
        let sequenceKey = 'YZG_V1'
        let isStaticView = false
        showIntroText.value = newValue === 1 // 显示启动页介绍文字的节点
        showChapterText.value = [2, 4, 7, 9].includes(newValue) // 显示章节标题的节点
        onMessage({ action: 'ShowDetailDialog', data: '' }) // 切换其他节点，关闭详情
        switch (newValue) {
            case 1:
                sequenceKey = 'YZG_V1'
                break
            case 2:
                sequenceKey = 'YZG_V2'
                break
            case 201:
                sequenceKey = 'YZG_P2_1'
                isStaticView = true
                break
            case 202:
                sequenceKey = 'YZG_P2_2'
                isStaticView = true
                break
            case 203:
                sequenceKey = 'YZG_P2_3'
                isStaticView = true
                break
            case 3:
            case 8:
                sequenceKey = 'YZG_V3'
                break
            case 4:
                sequenceKey = 'YZG_V4'
                break
            case 4011:
                sequenceKey = 'YZG_P1'
                isStaticView = true
                break
            case 4012:
                sequenceKey = 'YZG_P4_1'
                isStaticView = true
                break
            case 402:
                sequenceKey = 'YZG_P4_2'
                isStaticView = true
                break
            case 5:
                sequenceKey = 'YZG_V5'
                break
            case 6:
                sequenceKey = 'YZG_V6'
                break
            case 6011:
                sequenceKey = 'YZG_P6_1'
                isStaticView = true
                break
            case 6012:
                sequenceKey = 'YZG_P2'
                isStaticView = true
                break
            case 6021:
                sequenceKey = 'YZG_P6_2'
                isStaticView = true
                break
            case 6022:
                sequenceKey = 'YZG_P3'
                isStaticView = true
                break
            case 6031:
                sequenceKey = 'YZG_P6_3'
                isStaticView = true
                break
            case 6032:
                sequenceKey = 'YZG_P4'
                isStaticView = true
                break
            case 6041:
                sequenceKey = 'YZG_P6_4'
                isStaticView = true
                break
            case 6042:
                sequenceKey = 'YZG_P5'
                isStaticView = true
                break
            case 7:
                sequenceKey = 'YZG_V7'
                break
            case 9:
                sequenceKey = 'YZG_P7_1'
                isStaticView = true
                break
            case 902:
                sequenceKey = 'YZG_P7_2'
                isStaticView = true
                break
            case 10:
                sequenceKey = 'YZG_P7_3'
                isStaticView = true
                break
            case 1002:
                sequenceKey = 'YZG_P7_4'
                isStaticView = true
                break
            case 11:
                sequenceKey = 'YZG_P6'
                isStaticView = true
                break
            case 1101:
                sequenceKey = 'YZG_P2_3'
                isStaticView = true
                onMessage({ action: 'ShowDetailDialog', data: sequenceKey })
                return
        }

        if (isStaticView) {
            onMessage({ action: 'SetPresetView', data: sequenceKey })
        } else {
            onMessage({ action: 'PlaySequence', data: sequenceKey })
        }
    }
)

const closeIntroText = () => {
    showIntroText.value = false
    currentStep.value = 2
}
</script>

<template>
    <div class="step_container">
        <div class="step-back-filter"></div>
        <div class="hor_line"></div>
        <ul class="horizontal-list">
            <li>
                <img
                    class="zhangjie"
                    :class="{ active: currentStep <= 3 }"
                    src="/src/assets/images/diyizhang.png"
                />
            </li>
            <li>
                <div class="step_item" @click="currentStep = 1">
                    <div class="icon">
                        <img v-if="currentStep != 1" src="/src/assets/images/step_icon.png" />
                        <img
                            v-else
                            :class="{ icon_rotate: currentStep == 1 }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div class="name" :style="{ color: currentStep == 1 ? '#FFE6A7' : '' }">
                        启示
                    </div>
                </div>
            </li>
            <li>
                <div class="step_item" @click="currentStep = 2">
                    <div
                        class="child"
                        v-show="currentStep == 2 || (currentStep + '').substring(0, 1) == '2'"
                        @click.stop
                    >
                        <ul>
                            <li @click="currentStep = 201">青石须弥座</li>
                            <li @click="currentStep = 202">八字琉璃照壁</li>
                        </ul>
                        <div class="child_line" style="margin-left: 22px"></div>
                    </div>
                    <div class="icon">
                        <img
                            v-if="currentStep != 2 && (currentStep + '').substring(0, 1) != '2'"
                            src="/src/assets/images/step_icon.png"
                        />
                        <img
                            v-else
                            :class="{
                                icon_rotate:
                                    currentStep == 2 || (currentStep + '').substring(0, 1) == '2'
                            }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div
                        class="name"
                        :style="{
                            color:
                                currentStep == 2 || (currentStep + '').substring(0, 1) == '2'
                                    ? '#FFE6A7'
                                    : ''
                        }"
                    >
                        山门
                    </div>
                </div>
            </li>
            <li>
                <div class="step_item" @click="currentStep = 3">
                    <div class="icon">
                        <img v-if="currentStep != 3" src="/src/assets/images/step_icon.png" />
                        <img
                            v-else
                            :class="{ icon_rotate: currentStep == 3 }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div class="name" :style="{ color: currentStep == 3 ? '#FFE6A7' : '' }">
                        前院
                    </div>
                </div>
            </li>
            <li>
                <img class="zhangjie" src="/src/assets/images/dierzhang.png" />
            </li>
            <li>
                <div class="step_item" @click="currentStep = 4">
                    <div
                        class="child"
                        v-show="currentStep == 4 || (currentStep + '').substring(0, 1) == '4'"
                        @click.stop
                    >
                        <ul>
                            <li @click="currentStep = 4011">龙虎殿内（一）</li>
                            <li @click="currentStep = 4012">龙虎殿内（二）</li>
                            <li @click="currentStep = 402">石碾玉旋子彩画</li>
                        </ul>
                        <div class="child_line" style="margin-left: 49px"></div>
                    </div>
                    <div class="icon">
                        <img
                            v-if="currentStep != 4 && (currentStep + '').substring(0, 1) != '4'"
                            src="/src/assets/images/step_icon.png"
                        />
                        <img
                            v-else
                            :class="{
                                icon_rotate:
                                    currentStep == 4 || (currentStep + '').substring(0, 1) == '4'
                            }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div
                        class="name"
                        :style="{
                            color:
                                currentStep == 4 || (currentStep + '').substring(0, 1) == '4'
                                    ? '#FFE6A7'
                                    : ''
                        }"
                    >
                        龙虎殿
                    </div>
                </div>
            </li>
            <li>
                <div class="step_item" @click="currentStep = 5">
                    <div class="icon">
                        <img v-if="currentStep != 5" src="/src/assets/images/step_icon.png" />
                        <img
                            v-else
                            :class="{ icon_rotate: currentStep == 5 }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div class="name" :style="{ color: currentStep == 5 ? '#FFE6A7' : '' }">
                        真仙殿
                    </div>
                </div>
            </li>
            <li>
                <div class="step_item" @click="currentStep = 6">
                    <div
                        class="child"
                        style="margin-top: -250px"
                        v-show="currentStep == 6 || (currentStep + '').substring(0, 1) == '6'"
                        @click.stop
                    >
                        <ul>
                            <li @click="currentStep = 6011" style="height: 180px">
                                张三丰铜铸鎏金像
                            </li>
                            <li @click="currentStep = 6012" style="height: 180px">
                                张三丰铜铸鎏金像（二）
                            </li>
                            <li @click="currentStep = 6021" style="height: 180px">石雕须弥座</li>
                            <li @click="currentStep = 6022" style="height: 180px">
                                石雕须弥座（二）
                            </li>
                            <li @click="currentStep = 6031" style="height: 180px">
                                五踩重昂溜金斗拱
                            </li>
                            <li @click="currentStep = 6032" style="height: 180px">
                                五踩重昂溜金斗拱（二）
                            </li>
                            <li @click="currentStep = 6041" style="height: 180px">
                                石碾玉旋子彩画
                            </li>
                            <li @click="currentStep = 6042" style="height: 180px">
                                石碾玉旋子彩画（二）
                            </li>
                        </ul>
                        <div class="child_line" style="margin-left: 173px"></div>
                    </div>
                    <div class="icon">
                        <img
                            v-if="currentStep != 6 && (currentStep + '').substring(0, 1) != '6'"
                            src="/src/assets/images/step_icon.png"
                        />
                        <img
                            v-else
                            :class="{
                                icon_rotate:
                                    currentStep == 6 || (currentStep + '').substring(0, 1) == '6'
                            }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div
                        class="name"
                        :style="{
                            color:
                                currentStep == 6 || (currentStep + '').substring(0, 1) == '6'
                                    ? '#FFE6A7'
                                    : ''
                        }"
                    >
                        真仙殿内
                    </div>
                </div>
            </li>
            <li>
                <img class="zhangjie" src="/src/assets/images/disanzhang.png" />
            </li>
            <li>
                <div class="step_item" @click="currentStep = 7">
                    <div class="icon">
                        <img v-if="currentStep != 7" src="/src/assets/images/step_icon.png" />
                        <img
                            v-else
                            :class="{ icon_rotate: currentStep == 7 }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div class="name" :style="{ color: currentStep == 7 ? '#FFE6A7' : '' }">
                        中宫院内
                    </div>
                </div>
            </li>
            <li>
                <img class="zhangjie" src="/src/assets/images/disizhang.png" />
            </li>
            <!-- <li>
                <div class="step_item" @click="currentStep = 8">
                    <div class="icon"><img v-if="currentStep != 8" src="/src/assets/images/step_icon.png" />
                        <img v-else :class="{ icon_rotate: currentStep == 8 }"
                            src="/src/assets/images/step_icon_sel.png" />
                    </div>
                    <div class="name" :style="{ 'color': currentStep == 8?'#FFE6A7':'' }">前院</div>
                </div>
            </li> -->
            <li>
                <div class="step_item" @click="currentStep = 9">
                    <div
                        class="child"
                        v-show="currentStep == 9 || (currentStep + '').substring(0, 1) == '9'"
                        @click.stop
                    >
                        <ul>
                            <!-- <li @click="currentStep = 901">东宫宫门</li> -->
                            <li @click="currentStep = 902">东宫出土遗珍</li>
                        </ul>
                        <div class="child_line" style="margin-left: -2px"></div>
                    </div>
                    <div class="icon">
                        <img
                            v-if="currentStep != 9 && (currentStep + '').substring(0, 1) != '9'"
                            src="/src/assets/images/step_icon.png"
                        />
                        <img
                            v-else
                            :class="{ icon_rotate: currentStep == 9 }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div
                        class="name"
                        :style="{
                            color:
                                currentStep == 9 || (currentStep + '').substring(0, 1) == '9'
                                    ? '#FFE6A7'
                                    : ''
                        }"
                    >
                        东宫
                    </div>
                </div>
            </li>
            <li>
                <div class="step_item" @click="currentStep = 10">
                    <div
                        class="child"
                        v-show="currentStep == 10 || (currentStep + '').substring(0, 2) == '10'"
                        @click.stop
                    >
                        <ul>
                            <!-- <li @click="currentStep = 1001">西宫宫门</li> -->
                            <li @click="currentStep = 1002">西宫出土遗珍</li>
                        </ul>
                        <div class="child_line" style="margin-left: -2px"></div>
                    </div>
                    <div class="icon">
                        <img
                            v-if="currentStep != 10 && (currentStep + '').substring(0, 2) != '10'"
                            src="/src/assets/images/step_icon.png"
                        />
                        <img
                            v-else
                            :class="{ icon_rotate: currentStep == 10 }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div
                        class="name"
                        :style="{
                            color:
                                currentStep == 10 || (currentStep + '').substring(0, 2) == '10'
                                    ? '#FFE6A7'
                                    : ''
                        }"
                    >
                        西宫
                    </div>
                </div>
            </li>
            <li>
                <div class="step_item" @click="currentStep = 11">
                    <div
                        class="child"
                        v-show="currentStep == 11 || (currentStep + '').substring(0, 2) == '11'"
                        @click.stop
                    >
                        <ul>
                            <li @click="currentStep = 1101">遇真宫垫高保护工程</li>
                        </ul>
                        <div class="child_line" style="margin-left: -2px"></div>
                    </div>
                    <div class="icon">
                        <img
                            v-if="currentStep != 11 && (currentStep + '').substring(0, 2) != '11'"
                            src="/src/assets/images/step_icon.png"
                        />
                        <img
                            v-else
                            :class="{ icon_rotate: currentStep == 11 }"
                            src="/src/assets/images/step_icon_sel.png"
                        />
                    </div>
                    <div
                        class="name"
                        :style="{
                            color:
                                currentStep == 11 || (currentStep + '').substring(0, 2) == '11'
                                    ? '#FFE6A7'
                                    : ''
                        }"
                    >
                        山门
                    </div>
                </div>
            </li>
        </ul>
        <BeginText v-if="showIntroText" @close="closeIntroText" />
        <ChapterText
            v-if="showChapterText"
            :key="currentStep"
            :currentStep="currentStep"
            @close="showChapterText = false"
        />
    </div>
</template>

<style lang="scss" scoped>
.step_container {
    position: absolute;
    width: 100%;
    height: 150px;
    bottom: 0px;
    left: 0px;
    z-index: 1;
    // backdrop-filter: blur(8px);

    /* 额外添加一个元素控制模糊背景，避免子元素fixed样式失效 */
    .step-back-filter {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -2;
        backdrop-filter: blur(8px);
        background: rgba(33, 32, 29, 0.6) url(/src/assets/images/step_back.png) no-repeat center
            center / 100% 100%;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
            /* Start position */
        }

        100% {
            transform: rotate(360deg);
            /* End position */
        }
    }

    .hor_line {
        border: none;
        border-top: 2px solid rgba(169, 139, 82, 1);
        width: 100%;
        height: 1px;
        position: absolute;
        top: 46%;
        left: 0px;
        z-index: -1;
    }

    .horizontal-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        list-style-type: none;
        padding: 0;
        margin: 10px 50px 0 50px;
        height: 120px;

        li {
            flex: 1;
        }

        .zhangjie {
            width: 75px;
            margin-top: 0px;
        }

        .active {
            animation: enlarge 1s infinite alternate;
        }

        .step_item {
            cursor: pointer;
            margin-top: 23px;
            position: relative;

            img {
                width: 45px;
            }

            .icon_rotate {
                animation: rotate 10s linear infinite;
            }

            .name {
                font-family: Source Han Serif CN;
                font-size: 16px;
                font-weight: 700;
                line-height: 16.8px;
                text-align: center;
                text-underline-position: from-font;
                text-decoration-skip-ink: none;
                color: rgb(236, 231, 231);
            }

            .child {
                position: absolute;
                margin-top: -220px;
                left: 50%;
                transform: translateX(-50%);
                bottom: 78px;

                .child_line {
                    background: url(/src/assets/images/child_line.png);
                    background-repeat: no-repeat;
                    background-size: 24% 100%;
                    background-position: 100%;
                    width: 30px;
                    height: 40px;
                    position: absolute;
                    margin-top: -35px;
                    z-index: -1;
                }

                ul {
                    list-style-type: none;
                    /* Remove bullet points */
                    padding: 0;
                    /* Remove default padding */
                    margin: 0;
                    /* Remove default margin */
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    list-style-type: none;
                    padding: 0;
                }

                li {
                    writing-mode: vertical-rl;
                    /* Rotate text for vertical display */
                    margin: 35px 0 40px 0;
                    /* Optional: space between items */
                    width: 30px;
                    height: 150px;
                    padding-right: 20px;
                    background: url(/src/assets/images/child_back.png);
                    background-size: 100% 100%;
                    font-family: Source Han Serif CN;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 14.4px;
                    text-align: left;
                    text-indent: 1.2em;
                    text-underline-position: from-font;
                    text-decoration-skip-ink: none;
                    color: rgba(102, 74, 3, 1);
                }
            }
        }
    }
}
</style>
