<template>
    <div
        class="home-menu-container"
        :class="{ collapsed: isCollapsed }"
        @mousemove="handleMenuInteraction"
        @click="handleMenuInteraction"
    >
        <div class="compass-shell" :class="{ collapsed: isCollapsed }">
            <div
                class="compass-wrapper"
                :class="{ 'no-transition': disableTransition }"
                :style="{ transform: `rotate(${rotation}deg)` }"
            >
                <img class="home-menu-bg" src="@/assets/images/home/menu_bg.png" alt="" />
                <div
                    v-for="(item, index) in menuList"
                    :key="item.label"
                    class="menu-btn"
                    :style="getBtnStyle(index)"
                    @click="handleClick(index)"
                >
                    <div class="menu-btn-inner" :style="{ transform: `rotate(${-rotation}deg)` }">
                        <div class="menu-icon-wrapper">
                            <img
                                class="menu-icon"
                                :src="item.icon"
                                :alt="item.label"
                                :style="{ opacity: activeIndex === index ? 0 : 1 }"
                            />
                            <img
                                class="menu-icon"
                                :src="item.activeIcon"
                                :alt="item.label"
                                :style="{ opacity: activeIndex === index ? 1 : 0 }"
                            />
                        </div>
                        <div v-show="activeIndex === index" class="menu-label">
                            <img
                                class="menu-label-bg"
                                src="@/assets/images/home/active_title_bg.png"
                                alt=""
                            />
                            <span class="menu-label-text">{{ item.label }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button class="menu-toggle-btn" type="button" @click.stop="toggleMenu">
            <img
                class="menu-toggle-icon"
                :src="isCollapsed ? menuExpandIcon : menuFoldIcon"
                :alt="isCollapsed ? '展开菜单' : '收起菜单'"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
import menuExpandIcon from '@/assets/images/home/icon_expand.png'
import menuFoldIcon from '@/assets/images/home/icon_fold.png'
import menuIcon1 from '@/assets/images/home/menu_icon_1.png'
import menuIcon1Active from '@/assets/images/home/menu_icon_1_active.png'
import menuIcon2 from '@/assets/images/home/menu_icon_2.png'
import menuIcon2Active from '@/assets/images/home/menu_icon_2_active.png'
import menuIcon3 from '@/assets/images/home/menu_icon_3.png'
import menuIcon3Active from '@/assets/images/home/menu_icon_3_active.png'
import { useMissionStore } from '@/stores/mission'
import { HomeVisitMode, useHomeModeStore } from '@/stores/homeMode'
import { completeDailyTask } from '@/api/home/index'

const missionStore = useMissionStore()
const homeModeStore = useHomeModeStore()
const AUTO_COLLAPSE_DELAY = 6000
const STEP = 45 // 相邻按钮间隔45°
const RADIUS = 202 // 罗盘半径(px)
const CENTER = 370 // 圆心坐标(px)

const menuList = [
    {
        mode: HomeVisitMode.Roam,
        label: '漫游模式',
        icon: menuIcon1,
        activeIcon: menuIcon1Active,
        taskCode: 'AUTO_ROAM'
    },
    {
        mode: HomeVisitMode.Treasure,
        label: '探秘寻宝',
        icon: menuIcon2,
        activeIcon: menuIcon2Active
    },
    {
        mode: HomeVisitMode.Free,
        label: '自由模式',
        icon: menuIcon3,
        activeIcon: menuIcon3Active,
        taskCode: 'FREE_MODE'
    }
]

// 每个按钮在罗盘坐标系中的角度（0°=3点钟方向，正值顺时针）
// 漫游模式=-45°(右上), 探秘寻宝=0°(正右), 自由模式=+45°(右下)
const btnAngles = reactive([-STEP, 0, STEP])
const activeIndex = computed(() => homeModeStore.currentModeIndex)
const isCollapsed = ref(false)
const rotation = ref(0) // 罗盘旋转角度
const disableTransition = ref(false)
let autoCollapseTimer: ReturnType<typeof window.setTimeout> | null = null

function clearAutoCollapseTimer() {
    if (autoCollapseTimer) {
        window.clearTimeout(autoCollapseTimer)
        autoCollapseTimer = null
    }
}

function scheduleAutoCollapse() {
    clearAutoCollapseTimer()

    if (isCollapsed.value) {
        return
    }

    autoCollapseTimer = window.setTimeout(() => {
        isCollapsed.value = true
        autoCollapseTimer = null
    }, AUTO_COLLAPSE_DELAY)
}

function setMenuCollapsed(collapsed: boolean) {
    isCollapsed.value = collapsed

    if (collapsed) {
        clearAutoCollapseTimer()
        return
    }

    scheduleAutoCollapse()
}

function toggleMenu() {
    setMenuCollapsed(!isCollapsed.value)
}

function handleMenuInteraction() {
    if (isCollapsed.value) {
        return
    }

    scheduleAutoCollapse()
}

// 根据按钮在罗盘上的角度，计算其left/top像素位置
function getBtnStyle(index: number) {
    const angle = btnAngles[index]
    const rad = (angle * Math.PI) / 180
    return {
        left: `${CENTER + RADIUS * Math.cos(rad)}px`,
        top: `${CENTER + RADIUS * Math.sin(rad)}px`
    }
}

function handleClick(index: number) {
    handleMenuInteraction()

    const targetMenu = menuList[index]

    if (!targetMenu) {
        return
    }

    if (index === activeIndex.value) {
        // 再次点击当前选中项，若是"探秘寻宝"则重新打开任务指引
        if (targetMenu.mode === HomeVisitMode.Treasure) {
            missionStore.setShowMission(true)
        }
        return
    }

    // 上报模式切换任务
    if (targetMenu.taskCode) {
        completeDailyTask(targetMenu.taskCode).catch(() => {})
    }

    // 被点击按钮当前在罗盘上的角度
    const targetAngle = btnAngles[index]
    // 屏幕角度 = btnAngle + rotation，要让它等于0°
    // 所以 rotation 应该变为 -btnAngle
    rotation.value = -targetAngle
    homeModeStore.setCurrentMode(targetMenu.mode)

    // 旋转后检查：哪个按钮的屏幕角度超出了±90°，需要瞬移到对面
    // 等旋转动画结束后执行瞬移
    setTimeout(() => {
        relocateOverflowBtns()
    }, 0)
}

// 检查每个按钮旋转后的屏幕角度，超出±90°的瞬移到对面
function relocateOverflowBtns() {
    for (let i = 0; i < btnAngles.length; i++) {
        const screenAngle = btnAngles[i] + rotation.value
        if (screenAngle >= 90) {
            // 从下方消失，瞬移到上方 -45°位置（罗盘坐标）
            disableTransition.value = true
            btnAngles[i] = -STEP - rotation.value
        } else if (screenAngle <= -90) {
            // 从上方消失，瞬移到下方 +45°位置（罗盘坐标）
            disableTransition.value = true
            btnAngles[i] = STEP - rotation.value
        }
    }
    if (disableTransition.value) {
        // 下一帧恢复transition
        requestAnimationFrame(() => {
            disableTransition.value = false
        })
    }
}

onMounted(() => {
    scheduleAutoCollapse()
})

onBeforeUnmount(() => {
    clearAutoCollapseTimer()
})
</script>

<style scoped lang="scss">
.home-menu-container {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%);
    z-index: 2000;

    &.collapsed {
        pointer-events: none;
    }

    &.collapsed .menu-toggle-btn {
        pointer-events: auto;
    }
}

.compass-shell {
    position: relative;
    width: 740px;
    height: 740px;
    opacity: 1;
    transform: scale(1);
    transform-origin: center;
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;

    &.collapsed {
        opacity: 0;
        transform: scale(0.92);
        pointer-events: none;
    }
}

.compass-wrapper {
    position: relative;
    width: 740px;
    height: 740px;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    &.no-transition,
    &.no-transition .menu-btn,
    &.no-transition .menu-btn-inner {
        transition: none !important;
    }
}

.home-menu-bg {
    display: block;
    width: 100%;
    height: 100%;
}

.menu-btn {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition:
        left 0.6s cubic-bezier(0.4, 0, 0.2, 1),
        top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-btn-inner {
    display: flex;
    align-items: center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-icon-wrapper {
    position: relative;
    width: 73px;
    height: 73px;
    flex-shrink: 0;
    z-index: 1;
}

.menu-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity 0.15s ease;
}

.menu-label {
    position: absolute;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;

    .menu-label-bg {
        display: block;
        height: 48px;
        width: auto;
    }

    .menu-label-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 18px;
        font-weight: 500;
        white-space: nowrap;
        line-height: 1;
    }
}

.menu-toggle-btn {
    position: absolute;
    top: 50%;
    left: 51%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 27px;
    height: 36px;
    padding: 0;
    border: 0;
    background: transparent;
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 2;
}

.menu-toggle-icon {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>
