<template>
    <div class="menu-bar">
        <div
            class="menu-item menu-item-home"
            :class="{ active: currentRoute === '/home' }"
            @click="goPage('home')"
        >
            <div class="menu-title" v-show="currentRoute === '/home'">武当文脉</div>
        </div>
        <div
            class="menu-item menu-item-resource"
            :class="{ active: currentRoute === '/resource' }"
            @click="goPage('resource')"
        >
            <div class="menu-title" v-show="currentRoute === '/resource'">数字武当</div>
        </div>
        <!-- <div
            class="menu-item menu-item-application"
            :class="{ active: currentRoute === '/application' }"
            @click="goPage('application')"
        ></div> -->
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useNavStore } from '@/stores/nav'
import { resolveRetainedQueryFromRoute } from '@/router/query'
const router = useRouter()

const currentRoute = computed(() => {
    return router.currentRoute.value.path
})
const goPage = (type: string) => {
    useNavStore().setMenuType(type)
    const path = `/${type}`
    if (currentRoute.value === path) return
    router.push({
        path,
        query: resolveRetainedQueryFromRoute(router.currentRoute.value)
    })
}
</script>

<style lang="scss" scoped>
.menu-bar {
    position: fixed;
    left: 150px;
    top: 50%;
    z-index: 1001;
    transform: translateY(-55%);
    .menu-item {
        width: 200px;
        height: 200px;
        margin-bottom: 110px;
        cursor: pointer;
        position: relative;
        @keyframes menuTitle {
            0% {
                width: 0;
                opacity: 0;
                left: 0;
            }
            100% {
                width: 590px;
                opacity: 1;
                left: 170px;
            }
        }
        .menu-title {
            padding-right: 100px;
            z-index: -1;
            position: absolute;
            top: 50%;
            left: 170px;
            transform: translateY(-50%);
            background: linear-gradient(90deg, #b19f7f 15.21%, rgba(177, 159, 127, 0) 100%);
            color: #fff;
            font-size: 50px;
            width: 590px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            letter-spacing: 10px;
            animation: menuTitle 0.3s ease-in-out;
            white-space: nowrap;
        }
    }
    .menu-item-home {
        background: url('@/assets/images/tool/menu_home.png') center center / 100% no-repeat;
        &.active {
            background: url('@/assets/images/tool/menu_home_select.png') center center / 100%
                no-repeat;
        }
    }
    .menu-item-resource {
        background: url('@/assets/images/tool/menu_resource.png') center center / 100% no-repeat;
        &.active {
            background: url('@/assets/images/tool/menu_resource_select.png') center center / 100%
                no-repeat;
        }
    }
    .menu-item-application {
        background: url('@/assets/images/tool/menu_application.png') center center / 100% no-repeat;
        &.active {
            background: url('@/assets/images/tool/menu_application_active.png') center center / 100%
                no-repeat;
        }
    }
}
</style>
