<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
import { startTokenCheck, stopTokenCheck } from '@/api/login'
import { startHeartbeat, stopHeartbeat } from '@/api/home'
import { Session } from '@/utils/storage'

onMounted(() => {
    startTokenCheck()
    if (Session.getToken()) {
        startHeartbeat()
    }
})

onUnmounted(() => {
    stopTokenCheck()
    stopHeartbeat()
})
</script>

<style scoped lang="scss"></style>
