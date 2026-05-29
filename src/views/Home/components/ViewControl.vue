<template>
    <div class="view-control-container">
        <img
            v-for="(value, index) in viewControlList"
            :key="value.type"
            :src="currentViewType === value.type ? value.activeImg : value.defaultImg"
            :alt="value.type"
            :class="['view-control-item', `index${index}`]"
            @click="handleViewChange(value.type)"
        />
        <img
            class="icon_arrow"
            :class="[
                `rotate${currentViewType === 'Pawn_Universal' ? 0 : currentViewType === 'Pawn_FreeFlight' ? 90 : -90}`
            ]"
            src="@/assets/images/tool/view_arrow.png"
            alt=""
        />
        <span class="view-title">视角切换</span>
    </div>
</template>

<script setup lang="ts">
const viewControlList = ref([
    {
        defaultImg: new URL('@/assets/images/tool/view_first.png', import.meta.url).href,
        activeImg: new URL('@/assets/images/tool/view_first_active.png', import.meta.url).href,
        type: 'Pawn_FreeFlight'
    },
    {
        defaultImg: new URL('@/assets/images/tool/view_freedom.png', import.meta.url).href,
        activeImg: new URL('@/assets/images/tool/view_freedom_active.png', import.meta.url).href,
        type: 'Pawn_Universal'
    },
    {
        defaultImg: new URL('@/assets/images/tool/view_third.png', import.meta.url).href,
        activeImg: new URL('@/assets/images/tool/view_third_active.png', import.meta.url).href,
        type: 'Pawn_ThirdPerson'
    }
])
const currentViewType = ref('Pawn_ThirdPerson')

const handleViewChange = (type: string) => {
    currentViewType.value = type

    emit('viewChange', type)
}

const emit = defineEmits<{
    (e: 'viewChange', type: string): void
}>()
</script>

<style scoped lang="scss">
.view-control-container {
    position: absolute;
    bottom: 50px;
    right: 54px;
    width: 183px;
    height: 135px;
    z-index: 2000;

    .view-control-item {
        cursor: pointer;
        &.index0 {
            position: absolute;
            top: 0;
            left: 27px;
            width: 84px;
            height: 64px;
        }

        &.index1 {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 69px;
            height: 89px;
        }

        &.index2 {
            position: absolute;
            bottom: 0;
            left: 27px;
            width: 84px;
            height: 64px;
        }
    }

    .icon_arrow {
        position: absolute;
        top: 50%;
        left: 42px;
        transform: translateY(-50%);
        width: 49px;
        height: 49px;
        transition: transform 0.3s ease;

        &.rotate0 {
            transform: translateY(-50%) rotate(0deg);
        }
        &.rotate90 {
            transform: translateY(-50%) rotate(90deg);
        }
        &.rotate-90 {
            transform: translateY(-50%) rotate(-90deg);
        }
    }

    .view-title {
        position: absolute;
        top: 50%;
        left: 107px;
        transform: translateY(-50%);
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
    }
}
</style>
