<template>
    <Teleport to=".app-wrapper">
        <div v-if="visible" class="operating-help-container">
            <!-- 左下角操作指引图片 -->
            <img
                class="guide-operate"
                src="@/assets/images/tool/icon_help_operate.png"
                alt="操作指引"
            />

            <!-- 中央确认按钮 -->
            <img
                class="guide-confirm"
                src="@/assets/images/tool/icon_help_confirm.png"
                alt="我知道了"
                @click="handleClose"
            />

            <!-- 中央偏下方向指引 -->
            <div class="guide-direction-wrapper">
                <img
                    class="guide-direction"
                    src="@/assets/images/tool/icon_help_direction.png"
                    alt="方向指引"
                />
                <span class="direction-text-right">鼠标左右滑动<br />控制角色方向</span>
                <span class="direction-text-bottom">鼠标上下滑动<br />控制角色俯仰</span>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>('visible', { default: false })

const handleClose = () => {
    visible.value = false
}
</script>

<style lang="scss" scoped>
.operating-help-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 3000;

    .guide-operate {
        position: absolute;
        left: 40px;
        bottom: 40px;
        width: 180px;
    }

    .guide-confirm {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 180px;
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
            transform: translate(-50%, -50%) scale(1.05);
        }
    }

    .guide-direction-wrapper {
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;

        .guide-direction {
            width: 141px;
        }

        .direction-text-right {
            position: absolute;
            top: 45px;
            right: -125px;
            color: #fcdfa5;
            font-size: 20px;
        }

        .direction-text-bottom {
            margin-top: 10px;
            color: #fcdfa5;
            font-size: 20px;
        }
    }
}
</style>
