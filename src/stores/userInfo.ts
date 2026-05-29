import { Session } from '@/utils/storage'
import {
    checkToken,
    getUserInfo,
    login,
    loginByMobile,
    loginBySocial,
    refreshTokenApi
} from '@/api/login/index'
import { stopHeartbeat } from '@/api/home'
import { useMessage } from '@/hooks/message'

const resolveAuthInfo = (response: any) => {
    const payload = response?.data ?? response ?? {}

    const accessToken =
        payload.access_token ??
        payload.token ??
        payload.accessToken ??
        payload.authorization ??
        payload.Authorization

    const refreshToken =
        payload.refresh_token ??
        payload.refreshToken ??
        payload.data?.refresh_token ??
        payload.data?.refreshToken

    return {
        accessToken:
            typeof accessToken === 'string' ? accessToken.replace(/^Bearer\s+/i, '') : accessToken,
        refreshToken
    }
}

const persistAuthInfo = (response: any) => {
    const { accessToken, refreshToken } = resolveAuthInfo(response)

    if (!accessToken) {
        throw new Error('登录成功但未获取到有效 token')
    }

    Session.set('token', accessToken)
    Session.set('refresh_token', refreshToken)

    return response
}

const DEFAULT_PERMISSIONS = ['home', 'select']
let initializePromise: Promise<any> | null = null

const normalizePermissions = (userInfo: Record<string, any>) => {
    const candidates = [
        userInfo.permissions,
        userInfo.permissionList,
        userInfo.routes,
        userInfo.menus,
        userInfo.authBtnList
    ]

    for (const candidate of candidates) {
        if (Array.isArray(candidate) && candidate.length) {
            return candidate
                .map(item => {
                    if (typeof item === 'string') return item
                    if (typeof item?.permission === 'string') return item.permission
                    if (typeof item?.code === 'string') return item.code
                    if (typeof item?.path === 'string') return item.path.replace(/^\//, '')
                    return ''
                })
                .filter(Boolean)
        }
    }

    return DEFAULT_PERMISSIONS
}

/**
 * @function useUserInfo
 * @returns {UserInfosStore}
 */
export const useUserInfo = defineStore('userInfo', {
    state: () => ({
        userInfos: {} as Record<string, any>,
        permissions: [] as string[],
        isInitialized: false
    }),

    actions: {
        /**
         * 登录方法
         * @function login
         * @async
         * @param {Object} data - 登录数据
         * @returns {Promise<Object>}
         */
        async login(data: any) {
            data.grant_type = 'password'
            data.scope = 'server'

            return new Promise((resolve, reject) => {
                login(data)
                    .then((res: any) => {
                        resolve(persistAuthInfo(res))
                    })
                    .catch(err => {
                        useMessage().error(err?.msg || '系统异常请联系管理员')
                        reject(err)
                    })
            })
        },

        /**
         * 手机登录方法
         * @function loginByMobile
         * @async
         * @param {Object} data - 登录数据
         * @returns {Promise<Object>}
         */
        async loginByMobile(data: any) {
            return new Promise((resolve, reject) => {
                loginByMobile(data.mobile, data.code)
                    .then((res: any) => {
                        resolve(persistAuthInfo(res))
                    })
                    .catch(err => {
                        useMessage().error(err?.msg || '系统异常请联系管理员')
                        reject(err)
                    })
            })
        },

        /**
         * 社交账号登录方法
         * @function loginBySocial
         * @async
         * @param {string} state - 状态
         * @param {string} code - 代码
         * @returns {Promise<Object>}
         */
        async loginBySocial(state: string, code: string) {
            return new Promise((resolve, reject) => {
                loginBySocial(state, code)
                    .then((res: any) => {
                        resolve(persistAuthInfo(res))
                    })
                    .catch(err => {
                        useMessage().error(err?.msg || '系统异常请联系管理员')
                        reject(err)
                    })
            })
        },

        /**
         * 刷新token方法
         * @function refreshToken
         * @async
         * @returns {Promise<any>}
         */
        async refreshToken() {
            return new Promise((resolve, reject) => {
                const refreshToken = Session.get('refresh_token')
                refreshTokenApi(refreshToken)
                    .then((res: any) => {
                        resolve(persistAuthInfo(res))
                    })
                    .catch(err => {
                        useMessage().error(err.msg)
                        reject(err)
                    })
            })
        },

        /**
         * 获取用户信息方法
         * @function setUserInfos
         * @async
         */
        async setUserInfos() {
            await getUserInfo().then(res => {
                if (res && res.data) {
                    const userInfo: any = {
                        ...res.data
                    }
                    this.userInfos = userInfo
                    this.permissions = normalizePermissions(userInfo)
                    this.isInitialized = true
                }
            })
        },

        async ensureInitialized() {
            if (this.isInitialized) {
                return this.userInfos
            }

            if (!Session.getToken()) {
                throw new Error('当前无有效登录态')
            }

            if (!initializePromise) {
                initializePromise = this.setUserInfos().finally(() => {
                    initializePromise = null
                })
            }

            await initializePromise
            return this.userInfos
        },

        resetAuthState() {
            Session.clear()
            stopHeartbeat()
            this.userInfos = {}
            this.permissions = []
            this.isInitialized = false
        },

        async checkAndRefreshToken() {
            if (!Session.getToken()) return
            await checkToken()
        }
    }
})
