import type { LocationQueryRaw, LocationQueryValueRaw } from 'vue-router'

const LOGIN_REDIRECT_QUERY_KEYS = new Set(['redirect', 'params'])

// 只把普通对象当作 query 容器处理，避免把其它复杂类型误并入路由参数。
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return Object.prototype.toString.call(value) === '[object Object]'
}

// 把业务侧传入的 query 值收敛成 vue-router 可接受的基础类型。
const normalizeQueryValue = (
    value: unknown
): LocationQueryValueRaw | LocationQueryValueRaw[] | undefined => {
    if (value === void 0) {
        return void 0
    }

    if (Array.isArray(value)) {
        const normalizedValues = value
            .map(item => normalizeQueryValue(item))
            .flatMap(item => (Array.isArray(item) ? item : item === void 0 ? [] : [item]))

        return normalizedValues.length ? normalizedValues : void 0
    }

    if (value === null || typeof value === 'string' || typeof value === 'number') {
        return value
    }

    if (typeof value === 'boolean') {
        return String(value)
    }

    return String(value)
}

// 统一归一化 route.query / route.params，保证后续合并逻辑只处理 plain object。
export const normalizeRouteQuery = (source: unknown): LocationQueryRaw => {
    if (!isPlainObject(source)) {
        return {}
    }

    return Object.entries(source).reduce<LocationQueryRaw>((result, [key, value]) => {
        const normalizedValue = normalizeQueryValue(value)

        if (normalizedValue !== void 0) {
            result[key] = normalizedValue
        }

        return result
    }, {})
}

// 登录页自身使用的 redirect / params 只是控制字段，不应继续透传到业务页面。
export const omitLoginRedirectQuery = (query: unknown): LocationQueryRaw => {
    const normalizedQuery = normalizeRouteQuery(query)

    return Object.entries(normalizedQuery).reduce<LocationQueryRaw>((result, [key, value]) => {
        if (!LOGIN_REDIRECT_QUERY_KEYS.has(key)) {
            result[key] = value
        }

        return result
    }, {})
}

// params 在不同场景下可能是单值或数组，这里只提取可反序列化的字符串载荷。
const resolveParamsPayload = (params: unknown) => {
    if (typeof params === 'string') {
        return params
    }

    if (Array.isArray(params)) {
        return params.find(item => typeof item === 'string')
    }

    return void 0
}

// 从登录页 params 中恢复最初访问时携带的 query；解析失败时安全降级为空对象。
export const parseRetainedQuery = (params: unknown): LocationQueryRaw => {
    const payload = resolveParamsPayload(params)

    if (!payload) {
        return {}
    }

    try {
        return normalizeRouteQuery(JSON.parse(payload))
    } catch {
        return {}
    }
}

// 登录页优先消费 redirect + params，其它页面则直接使用当前地址栏 query。
export const resolveRetainedQueryFromRoute = (route: {
    path?: string
    query?: unknown
}): LocationQueryRaw => {
    const normalizedQuery = normalizeRouteQuery(route.query)

    if (route.path !== '/login') {
        return normalizedQuery
    }

    const retainedQuery = parseRetainedQuery(normalizedQuery.params)

    if (Object.keys(retainedQuery).length) {
        return retainedQuery
    }

    return omitLoginRedirectQuery(normalizedQuery)
}

// 生成跳转到 /login 时使用的 redirect 信息，并把当前 query 编码进 params。
export const buildLoginRedirectQuery = (to: { path: string; query: unknown; params: unknown }) => {
    const routeQuery = normalizeRouteQuery(to.query)
    const retainedQuery = Object.keys(routeQuery).length
        ? routeQuery
        : normalizeRouteQuery(to.params)

    return {
        redirect: to.path,
        params: JSON.stringify(retainedQuery)
    }
}

// 导航时以已保留的入口 query 为底，再叠加目标页面显式传入的 query。
export const mergeRetainedQuery = (
    retainedQuery: LocationQueryRaw,
    nextQuery?: unknown
): LocationQueryRaw => {
    return {
        ...retainedQuery,
        ...normalizeRouteQuery(nextQuery)
    }
}
