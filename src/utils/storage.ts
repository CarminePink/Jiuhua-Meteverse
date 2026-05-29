import Cookies from 'js-cookie'

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
    // 查看 v2.4.3版本更新日志
    setKey(key: string) {
        return `jiuhua:${key}`
    },
    // 设置永久缓存
    set<T>(key: string, val: T) {
        window.localStorage.setItem(Local.setKey(key), JSON.stringify(val))
    },
    // 获取永久缓存
    get(key: string) {
        const json = <string>window.localStorage.getItem(Local.setKey(key))
        return JSON.parse(json)
    },
    // 移除永久缓存
    remove(key: string) {
        window.localStorage.removeItem(Local.setKey(key))
    },
    // 移除全部永久缓存
    clear() {
        window.localStorage.clear()
    }
}

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
    // 设置临时缓存
    set(key: string, val: any) {
        if (val === void 0 || val === null) {
            if (
                key === 'token' ||
                key === 'refresh_token' ||
                key === 'tenantId' ||
                key === 'basicAuth'
            ) {
                Cookies.remove(key)
            }
            window.sessionStorage.removeItem(key)
            return
        }

        if (
            key === 'token' ||
            key === 'refresh_token' ||
            key === 'tenantId' ||
            key === 'basicAuth'
        ) {
            Cookies.set(key, val)
        }
        window.sessionStorage.setItem(key, JSON.stringify(val))
    },
    // 获取临时缓存
    get(key: string) {
        if (key === 'token' || key === 'refresh_token' || key === 'tenantId') {
            const cookieValue = Cookies.get(key)

            if (cookieValue !== void 0 && cookieValue !== 'undefined' && cookieValue !== 'null') {
                return cookieValue
            }

            const json = window.sessionStorage.getItem(key)
            if (json === null || json === 'undefined' || json === 'null') return void 0

            return JSON.parse(json)
        }
        const json = <string>window.sessionStorage.getItem(key)
        if (json === null || json === 'undefined' || json === 'null') return void 0
        return JSON.parse(json)
    },
    // 移除临时缓存
    remove(key: string) {
        if (key === 'token' || key === 'refresh_token' || key === 'tenantId')
            return Cookies.remove(key)
        window.sessionStorage.removeItem(key)
    },
    // 移除全部临时缓存
    clear() {
        Cookies.remove('token')
        Cookies.remove('refresh_token')
        Cookies.remove('tenantId')
        window.sessionStorage.clear()
    },
    // 获取当前存储的 token
    getToken() {
        return this.get('token')
    },
    // 获取当前的租户
    getTenant() {
        return Local.get('tenantId') ? Local.get('tenantId') : 1
    }
}
