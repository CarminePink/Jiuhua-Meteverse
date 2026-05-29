<template>
    <div class="relative w-full social-btns">
        <div @click="handleClick('cp')" class="">
            <img
                class="w-[26px] h-[26px] cursor-pointer"
                src="@/assets/login/icon_qiyeweixin.png"
                alt=""
            />
        </div>
        <div @click="handleClick('dingding')" style="margin-left: 40px">
            <img
                class="w-[26px] h-[26px] cursor-pointer"
                src="@/assets/login/icon_dingding.png"
                alt=""
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="loginSocial">
import Cookies from 'js-cookie'
import other from '@/utils/other'

/**
 * 执行跳转事件的函数。
 * @event signInSuccess
 */
const emit = defineEmits(['signInSuccess'])

/**
 * 存储弹出窗口实例的 Ref 对象。
 */
const winOpen = ref()

/**
 * 计时器对象，用于检查弹出窗口是否关闭。
 */
const timer = ref()

/**
 * 点击按钮触发事件的回调函数，用于打开第三方登录授权页面。
 * @param thirdpart - 第三方平台名称。
 */
const handleClick = (thirdpart: string) => {
    let url: string = ''

    // 获取授权地址
    const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect')
    if (thirdpart === 'cp') {
        const appid = import.meta.env.VITE_CP_LOGIN_APPID
        const agentId = import.meta.env.VITE_CP_LOGIN_AGENTID
        url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${appid}&agentid=${agentId}&redirect_uri=${redirect_uri}&state=CP-LOGIN`
    } else if (thirdpart === 'dingding') {
        const clientId = import.meta.env.VITE_DINGDING_APPID
        url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${clientId}&scope=openid&state=DINGTALK-LOGIN&prompt=consent`
    }

    // 打开授权窗口并存储实例
    winOpen.value = other.openWindow(url, thirdpart, 540, 540)
}

/**
 * 页面加载后执行的函数，用于检查窗口是否关闭。
 */
onMounted(() => {
    timer.value = window.setInterval(() => {
        // 检查弹出窗口是否已关闭
        if (winOpen.value && winOpen.value.closed == true) {
            // 停止计时器
            window.clearInterval(timer.value)
            // 如果已获取到 token，则触发跳转事件
            console.log(Cookies.get('token'))
            if (Cookies.get('token')) {
                emit('signInSuccess')
            }
        }
    }, 500)
})
</script>
<style scoped lang="scss">
.social-btns {
    display: flex;
    justify-content: center;
}
</style>
