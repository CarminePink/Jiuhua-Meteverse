<template>
    <div id="scene-viewer-container"></div>
</template>

<script setup lang="ts">
import { useDasUE } from '@/hooks/useDasUEHook'

onMounted(() => {
    useDasUE()
})
</script>

<style scoped lang="scss">
#scene-viewer-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
