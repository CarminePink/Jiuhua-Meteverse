import request from '@/utils/request'
import { Session } from '@/utils/storage'
import { validateNull } from '@/utils/validate'
import pinia from '@/stores'
import { useUserInfo } from '@/stores/userInfo'
import other from '@/utils/other'

/**
 * https://www.ietf.org/rfc/rfc6749.txt
 * OAuth 协议 4.3.1 要求格式为 form 而不是 JSON 注意！
 */
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded'

// 登录方式
export enum LoginTypeEnum {
    PASSWORD,
    MOBILE,
    REGISTER,
    RESETPASSWORD,
    WXLOGIN
}

/**
 * 登录
 * @param data
 */
export const login = (data: any) => {
    const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT)
    Session.set('basicAuth', basicAuth)
    // 密码加密
    const encPassword = other.encryption(data.password, import.meta.env.VITE_PWD_ENC_KEY)
    const { username } = data
    return request({
        url: '/metaverseBiz/open/register/login',
        method: 'post',
        // params: { username, randomStr, code, grant_type, scope },
        data: { username, password: encPassword },
        headers: {
            skipToken: true,
            Authorization: basicAuth,
            'Content-Type': 'application/json'
        }
    })
}

export const loginByMobile = (mobile: any, code: any) => {
    const grant_type = 'mobile'
    const scope = 'server'
    const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_MOBILE_CLIENT)
    Session.set('basicAuth', basicAuth)

    return request({
        url: '/auth/oauth2/token',
        headers: {
            skipToken: true,
            Authorization: basicAuth,
            'Content-Type': FORM_CONTENT_TYPE
        },
        method: 'post',
        params: { mobile: 'SMS@' + mobile, code: code, grant_type, scope }
    })
}

export const loginBySocial = (state: string, code: string) => {
    const grant_type = 'mobile'
    const scope = 'server'
    const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_SOCIAL_CLIENT)
    Session.set('basicAuth', basicAuth)
    return request({
        url: '/auth/oauth2/token',
        headers: {
            skipToken: true,
            Authorization: basicAuth,
            'Content-Type': FORM_CONTENT_TYPE
        },
        method: 'post',
        params: { mobile: state + '@' + code, code: code, grant_type, scope }
    })
}

export const sendMobileCode = (mobile: any, type = 0) => {
    let url = '/admin/mobile/' + mobile
    if (type) {
        url += '?type=' + type
    }
    return request({
        url,
        method: 'get'
    })
}

export const refreshTokenApi = (refresh_token: string) => {
    const grant_type = 'refresh_token'
    const scope = 'server'
    // 获取当前选中的 basic 认证信息
    const basicAuth = Session.get('basicAuth')

    return request({
        url: '/auth/oauth2/token',
        headers: {
            skipToken: true,
            Authorization: basicAuth,
            'Content-Type': FORM_CONTENT_TYPE
        },
        method: 'post',
        params: { refresh_token, grant_type, scope }
    })
}

let refreshLock = false
let tokenCheckTimer: ReturnType<typeof setInterval> | null = null

/**
 * 校验令牌，若有效期小于半小时自动续期
 */
export const checkToken = async () => {
    const basicAuth = Session.get('basicAuth')
    const token = Session.getToken()

    if (!basicAuth || !token) return

    try {
        const response: any = await request({
            url: '/auth/token/check_token',
            headers: {
                skipToken: true,
                Authorization: basicAuth,
                'Content-Type': FORM_CONTENT_TYPE
            },
            method: 'get',
            params: { token }
        })

        if (validateNull(response) || response.code === 1) {
            return
        }

        const expire = Date.parse(response.data.expiresAt)
        if (!expire) return

        const expiredPeriod = expire - new Date().getTime()
        if (expiredPeriod <= 30 * 60 * 1000 && !refreshLock) {
            refreshLock = true
            try {
                await useUserInfo(pinia).refreshToken()
            } finally {
                refreshLock = false
            }
        }
    } catch {
        stopTokenCheck()
    }
}

export const startTokenCheck = (interval = 60 * 1000) => {
    if (tokenCheckTimer) {
        return
    }

    checkToken()
    tokenCheckTimer = setInterval(() => {
        checkToken()
    }, interval)
}

export const stopTokenCheck = () => {
    if (tokenCheckTimer) {
        clearInterval(tokenCheckTimer)
        tokenCheckTimer = null
    }

    refreshLock = false
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    return request({
        url: '/metaverseBiz/meta/user/profile',
        method: 'get'
    })
}

export const logout = () => {
    return request({
        url: '/metaverseBiz/open/register/logout',
        method: 'delete'
    })
}

export const resetPassword = (data: any) => {
    const encryptedData = { ...data }

    if (typeof encryptedData.newPassword === 'string' && encryptedData.newPassword) {
        encryptedData.newPassword = other.encryption(
            encryptedData.newPassword,
            import.meta.env.VITE_PWD_ENC_KEY
        )
    }

    return request({
        url: '/metaverseBiz/open/register/resetPassword',
        method: 'post',
        data: encryptedData
    })
}
