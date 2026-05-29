<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()
const form3 = ref({ delivery: 1, sewen: 20, yunying: false })
const form1 = ref({ delivery: false, aa: false })
const form2 = ref({ delivery: 1, ruihua: 1, xuanran: 100 })
</script>

<template>
    <div class="sys_container">
        <div class="title">系统设置</div>
        <div class="split_line"></div>
        <el-form ref="form" :model="form1" label-width="335px">
            <el-form-item label="声音">
                <el-switch
                    v-model="form1.aa"
                    active-text="ON"
                    inactive-text="OFF"
                    active-color="#E1BB82"
                ></el-switch>
            </el-form-item>
            <el-form-item label="沉浸化体验(关闭后将隐藏地图引导)">
                <el-switch
                    v-model="form1.delivery"
                    active-text="ON"
                    inactive-text="OFF"
                    active-color="#E1BB82"
                ></el-switch>
            </el-form-item>
            <el-form-item label="显示帧率">
                <el-switch
                    v-model="form1.delivery"
                    active-text="ON"
                    inactive-text="OFF"
                    active-color="#E1BB82"
                ></el-switch>
            </el-form-item>
        </el-form>
        <div class="sec_title">
            <div></div>
            画面设置
        </div>
        <el-form ref="form" :model="form2" label-width="175px">
            <el-form-item label="垂直同步">
                <el-switch
                    v-model="form2.delivery"
                    active-text="ON"
                    inactive-text="OFF"
                    style="margin-left: 160px"
                    active-color="#E1BB82"
                ></el-switch>
            </el-form-item>
            <el-form-item label="锐化" class="ruihua">
                <el-radio-group v-model="form2.ruihua" style="margin-left: 105px">
                    <el-radio-button :label="1">1</el-radio-button>
                    <el-radio-button :label="2">2</el-radio-button>
                    <el-radio-button :label="3">3</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="DLSS">
                <el-switch
                    v-model="form2.delivery"
                    active-text="ON"
                    inactive-text="OFF"
                    style="margin-left: 160px"
                    active-color="#E1BB82"
                ></el-switch>
            </el-form-item>
            <el-form-item label="渲染分辨率">
                <el-radio-group v-model="form2.xuanran">
                    <el-radio-button :label="100">100</el-radio-button>
                    <el-radio-button :label="125">125</el-radio-button>
                    <el-radio-button :label="150">150</el-radio-button>
                    <el-radio-button :label="200">200</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="sec_title">
            <div></div>
            后处理设置
        </div>
        <el-form ref="form" :model="form3" label-width="250px">
            <el-form-item label="LUT预设">
                <el-switch
                    v-model="form3.delivery"
                    active-text="ON"
                    inactive-text="OFF"
                    style="margin-left: 85px"
                    active-color="#E1BB82"
                ></el-switch>
            </el-form-item>
            <el-form-item label="LUT强度">
                <el-radio-group v-model="form3.ruihua" style="margin-left: 70px">
                    <el-radio-button :label="1">1</el-radio-button>
                    <el-radio-button :label="2">2</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="色温" class="sewen">
                <el-slider
                    v-model="form3.sewen"
                    style="margin-left: -15px; margin-top: -20px"
                    :marks="{ 0: '1500', 100: '15000' }"
                ></el-slider>
            </el-form-item>
            <el-form-item label="晕映强度">
                <el-slider
                    v-model="form3.yunying"
                    style="margin-left: -15px; margin-top: -20px"
                    :marks="{ 0: '0', 100: '1' }"
                ></el-slider>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.sys_container {
    width: 440px;
    height: 820px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 0.5px solid #e1bb82;
    background: #21201dcc;
    backdrop-filter: blur(4px);
    position: absolute;
    top: 62px;
    right: 119px;
    padding: 10px;
    z-index: 2;

    .title {
        align-self: stretch;
        color: #e1bb82;
        text-align: center;
        font-family: 'Source Han Serif CN';
        font-size: 24px;
        font-style: normal;
        line-height: normal;
        letter-spacing: 9.6px;
        margin-top: 15px;
    }

    .split_line {
        background-image: url('/src/assets/images/hl.png');
        background-size: 100% 100%;
        height: 12px;
        width: 180px;
        margin: auto;
        margin-top: 15px;
        margin-bottom: 20px;
    }

    :deep(.el-form-item__label) {
        justify-content: flex-start;
        color: #ffffff;
        font-family: 'Source Han Sans CN';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 40px;
        padding-left: 15px;
    }

    :deep(.el-form-item) {
        width: 410px;
        height: 40px;
        flex-shrink: 0;
        background: #e1bb820d;
        border-radius: 3px;
        margin-left: 15px;
    }

    .sec_title {
        color: #e1bb82;
        font-family: 'Source Han Sans CN';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: left;
        padding-left: 52px;
        padding-bottom: 15px;

        div {
            width: 5.17px;
            height: 5.17px;
            transform: rotate(45deg);
            flex-shrink: 0;
            background: #e1bb82;
            position: absolute;
            margin-left: -15px;
            margin-top: 9px;
        }
    }

    :deep(.el-switch__core) {
        width: 64px;
        height: 28px;
        border-radius: 20px;
        background: #e1bb8233;
        border: 0.2px solid #e1bb82;
    }

    :deep(.el-switch__action) {
        width: 20px;
        height: 20px;
    }

    :deep(.el-switch.is-checked .el-switch__core .el-switch__action) {
        left: calc(100% - 21px);
    }

    :deep(.el-switch.is-checked .el-switch__core) {
        background: #e1bb82;
        border-color: #e1bb82;
        z-index: -1;
    }

    :deep(.el-switch__label--left) {
        left: 30px;
        position: absolute;
        z-index: -2;
        color: #e1bb82;
        display: none;
    }

    :deep(.el-switch__label--right) {
        margin-left: 10px;
        position: absolute;
        z-index: -1;
        color: #5f0d0b;
        display: none;
    }

    :deep(.is-active) {
        display: block;
    }

    :deep(.ruihua .el-form-item__label) {
        width: 280px;
    }

    :deep(.el-radio-button__inner) {
        background: none;
        color: #e1bb82;
        border: none;
    }

    :deep(.el-radio-group) {
        border: 0.2px solid #e1bb82;
        border-radius: 5px;
    }

    :deep(.el-radio-button:first-child .el-radio-button__inner) {
        border: none;
    }

    :deep(
        .el-radio-button.is-active
            .el-radio-button__original-radio:not(:disabled)
            + .el-radio-button__inner
    ) {
        border-radius: 4px;
        background: #e1bb82;
        color: #5f0d0b;
        box-shadow: none;
    }

    :deep(.el-slider__button) {
        width: 30px;
        height: 18px;
        border: none;
        background: none;
        border-color: inherit;
        background-image: url('/src/assets/images/slider.png');
        background-size: 100% 100%;
    }

    :deep(.el-slider__bar) {
        height: 4px;
        background: #e1bb82;
    }

    :deep(.el-slider__runway) {
        height: 4px;
        background: #e1bb8233;
    }

    :deep(.el-slider__marks-text) {
        color: #e1bb82;
        font-family: 'Source Han Sans CN';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
    }

    :deep(.sewen .el-slider__marks-text:first-child) {
        margin-left: 12px;
    }

    :deep(.sewen .el-slider__marks-text:last-child) {
        margin-left: -15px;
    }

    :deep(.el-slider__stop) {
        background: none;
    }
}
</style>
