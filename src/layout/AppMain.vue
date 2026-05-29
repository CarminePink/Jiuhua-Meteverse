<template>
    <section class="app-main">
        <router-view v-slot="{ Component }" :key="key">
            <transition name="router-fade" mode="out-in">
                <component :is="Component" :key="key" />
            </transition>
        </router-view>
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const key = computed(() => {
    return router.currentRoute.value.fullPath + Math.random()
})
</script>

<style scoped lang="scss">
.app-main {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
