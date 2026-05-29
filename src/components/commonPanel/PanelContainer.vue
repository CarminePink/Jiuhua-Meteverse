<template>
    <div class="panel-container common-modal-border">
        <div class="left-top-deco"></div>
        <div class="right-bottom-deco"></div>
        <div class="panel-title">
            {{ props.title }}
        </div>
        <slot name="content"></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped>
.panel-container {
    position: relative;
    background: linear-gradient(167.52deg, rgba(33, 32, 29, 0.8) 1.83%, rgba(33, 32, 29, 0) 90.94%);
    border-radius: 8px;
    padding: 35px 57px 30px 57px;
    width: 1200px;
    height: 1700px;
    backdrop-filter: blur(8px);
    z-index: 1000;

    .left-top-deco {
        position: absolute;
        top: -145px;
        left: 0;
        width: 340px;
        height: 340px;
        background: url('@/assets/images/common/img_mountain.png') center center / 100% no-repeat;
    }
    .right-bottom-deco {
        position: absolute;
        bottom: -100px;
        right: -80px;
        width: 216px;
        height: 207px;
        background: url('@/assets/images/common/img_crane.png') center center / 100% no-repeat;
    }

    .panel-title {
        color: #e1bb82;
        font-size: 55px;
        font-weight: 700;
        letter-spacing: 5px;
        padding: 0 250px 40px 250px;
        margin-bottom: 47px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        background: url('@/assets/images/common/underline_title.png') center bottom / 393px auto
            no-repeat;
    }
}
</style>
