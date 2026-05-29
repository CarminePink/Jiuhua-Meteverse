<template>
    <div class="system-tool-container">
        <SettingTool v-if="showSetting" />
        <img
            class="system-tool-btn pointer"
            src="@/assets/images/tool/btn_weather.png"
            alt="Weather"
            @click="handleWeatherSetting"
        />
        <img
            class="system-tool-btn pointer"
            :src="audioStore.isMuted ? mutedIcon : voiceIcon"
            alt="Voice"
            @click="handleToggleMute"
        />
        <div class="user-info">
            <img class="user-avatar" src="@/assets/images/tool/icon_avatar.png" alt="User Avatar" />
            <span class="user-name">{{ userName }}</span>
            <img
                class="sign-out-btn pointer"
                src="@/assets/images/tool/btn_sign_out.png"
                alt="Sign Out"
                @click="handleLogOut"
            />
            <div class="split-line"></div>
            <img
                class="quit-btn pointer"
                src="@/assets/images/tool/icon_quit.png"
                alt="Quit"
                @click="handleQuit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '@/stores/userInfo'
import { useAudioStore } from '@/stores/audio'
import { logout } from '@/api/login/index'
import { useDasUE } from '@/hooks/useDasUEHook'
import voiceIcon from '@/assets/images/tool/btn_voice.png'
import mutedIcon from '@/assets/images/tool/btn_mute.png'
import { resolveRetainedQueryFromRoute } from '@/router/query'

const SettingTool = defineAsyncComponent(() => import('./SettingTool.vue'))

let ueManager: any = null
const userStore = useUserInfo()
const audioStore = useAudioStore()
const router = useRouter()
const route = useRoute()
const showSetting = ref(false)

const handleToggleMute = () => {
    audioStore.toggleMute()
}

const userName = computed(() => {
    return userStore.userInfos?.nickName || '游客1'
})

const handleWeatherSetting = () => {
    showSetting.value = !showSetting.value
}

const handleLogOut = () => {
    try {
        ElMessageBox.confirm('确认退出登录吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                const retainedQuery = resolveRetainedQueryFromRoute(route)

                await logout()
                userStore.resetAuthState()
                router.push({
                    path: '/login',
                    query: retainedQuery
                })
            })
            .catch(() => {
                // 用户取消退出登录
            })
    } catch (error) {
        console.error('退出登录失败:', error)
    }
}

const handleQuit = () => {
    try {
        ElMessageBox.confirm('确认退出应用吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
                ueManager.dasElectron.closeUEApplication()
            })
            .catch(() => {
                // 用户取消退出应用
            })
    } catch (error) {
        console.error('退出游戏失败:', error)
    }
}

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()

    onViewerReady(async () => {
        ueManager = dasUE
    })
})
</script>

<style lang="scss" scoped>
.system-tool-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0 15px 48px 0;

    .pointer {
        cursor: pointer;
    }

    .user-info {
        width: 187px;
        height: 48px;
        display: flex;
        padding: 12px 14px;
        align-items: center;
        gap: 11px;
        background: url('@/assets/images/tool/info_bg.png') no-repeat center;

        .user-avatar,
        .sign-out-btn,
        .quit-btn,
        .split-line {
            flex-shrink: 0;
        }

        .user-name {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            color: #fff;
            display: block;
            text-align: center;
            text-overflow: ellipsis;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            white-space: nowrap;
        }

        .split-line {
            width: 1px;
            height: 19px;
            opacity: 0.4;
            background-color: #ffffff;
        }
    }
}
</style>
