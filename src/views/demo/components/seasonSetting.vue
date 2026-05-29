<script setup lang="ts">
import { ref } from 'vue'

const form1 = ref<unknown>({ chunxia: 'chunxia', qiuji: '', dongji: '' })

const selectSeason = (season: string) => {
    form1.value[season] = season
    for (const key in form1.value) {
        form1.value[key] = key === season ? season : ''
    }
    switch (season) {
        case 'chunxia':
            break
        case 'qiuji':
            break
        case 'dongji':
            break
    }
}
</script>

<template>
    <div class="season_container">
        <div class="title">季节预设</div>
        <div class="split_line"></div>
        <el-form ref="form" :model="form1" label-width="180px">
            <el-form-item label="春夏">
                <img src="/src/assets/images/chunxia.png" />
                <el-switch
                    v-model="form1.chunxia"
                    :active-value="'chunxia'"
                    :inactive-value="''"
                    active-text="ON"
                    inactive-text="OFF"
                    style="margin-left: 150px"
                    active-color="#E1BB82"
                    @change="selectSeason('chunxia')"
                ></el-switch>
            </el-form-item>
            <el-form-item label="秋季">
                <img src="/src/assets/images/qiuji.png" />
                <el-switch
                    v-model="form1.qiuji"
                    :active-value="'qiuji'"
                    :inactive-value="''"
                    active-text="ON"
                    inactive-text="OFF"
                    style="margin-left: 150px"
                    active-color="#E1BB82"
                    @change="selectSeason('qiuji')"
                ></el-switch>
            </el-form-item>
            <el-form-item label="冬季">
                <img src="/src/assets/images/dongji.png" />
                <el-switch
                    v-model="form1.dongji"
                    :active-value="'dongji'"
                    :inactive-value="''"
                    active-text="ON"
                    inactive-text="OFF"
                    style="margin-left: 150px"
                    active-color="#E1BB82"
                    @change="selectSeason('dongji')"
                ></el-switch>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.season_container {
    width: 440px;
    height: 520px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 0.5px solid #e1bb82;
    background: #21201dcc;
    backdrop-filter: blur(4px);
    position: absolute;
    top: 62px;
    right: 119px;
    padding: 10px;
    z-index: 1;

    img {
        position: absolute;
        width: 110px;
        height: 64px;
        left: -170px;
    }

    .title {
        align-self: stretch;
        color: #e1bb82;
        text-align: center;
        font-family: 'Source Han Serif CN';
        font-size: 20px;
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
        justify-content: flex-end;
        color: #ffffff;
        font-family: 'Source Han Sans CN';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 40px;
        padding-left: 0px;
        padding-top: 20px;
    }

    :deep(.el-form-item) {
        width: 410px;
        height: 40px;
        flex-shrink: 0;
        background: #e1bb820d;
        border-radius: 3px;
        margin-left: 15px;
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

    :deep(.el-form-item) {
        height: 80px;
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

    :deep(.el-slider__marks-text:first-child) {
        margin-left: 5px;
    }

    :deep(.sewen .el-slider__marks-text:last-child) {
        margin-left: -15px;
    }

    :deep(.sun_angle .el-slider__marks-text:last-child) {
        margin-left: -12px;
    }

    :deep(.sun_power .el-slider__marks-text:last-child) {
        margin-left: -8px;
    }

    :deep(.wu_level .el-slider__marks-text:last-child) {
        margin-left: -3px;
    }

    :deep(.el-slider__stop) {
        background: none;
    }
}
</style>
