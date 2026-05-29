import router, {
    addPermissionRoutes,
    getDefaultAuthorizedPath,
    getProtectedBusinessPaths,
    hasPermissionRoutesLoaded
} from '.'
import { buildLoginRedirectQuery, mergeRetainedQuery, resolveRetainedQueryFromRoute } from './query'
import pinia from '@/stores'
import { useUserInfo } from '@/stores/userInfo'
import { Session } from '@/utils/storage'

const WHITE_LIST = new Set(['/login'])

router.beforeEach(async to => {
    const hasToken = Boolean(Session.getToken())
    const retainedQuery = resolveRetainedQueryFromRoute(to)

    if (WHITE_LIST.has(to.path)) {
        if (hasToken) {
            const userStore = useUserInfo(pinia)
            const defaultPath = getDefaultAuthorizedPath(userStore.permissions)
            return to.query.redirect
                ? true
                : {
                      path: defaultPath === '/' ? '/' : defaultPath,
                      query: mergeRetainedQuery(retainedQuery),
                      replace: true
                  }
        }

        return true
    }

    if (!hasToken) {
        return {
            path: '/login',
            query: buildLoginRedirectQuery(to)
        }
    }

    const userStore = useUserInfo(pinia)

    try {
        if (!userStore.isInitialized || !hasPermissionRoutesLoaded()) {
            await userStore.ensureInitialized()
            addPermissionRoutes(userStore.permissions)

            return {
                path: to.path,
                query: mergeRetainedQuery(retainedQuery, to.query),
                hash: to.hash,
                replace: true
            }
        }
    } catch {
        userStore.resetAuthState()
        return {
            path: '/login',
            query: buildLoginRedirectQuery(to)
        }
    }

    if (
        to.name === 'NotFound' &&
        getProtectedBusinessPaths().includes(to.path) &&
        hasPermissionRoutesLoaded()
    ) {
        return {
            path: getDefaultAuthorizedPath(userStore.permissions),
            query: mergeRetainedQuery(retainedQuery),
            replace: true
        }
    }

    if (
        typeof to.meta.permission === 'string' &&
        userStore.permissions.length &&
        !userStore.permissions.includes(to.meta.permission)
    ) {
        return {
            path: getDefaultAuthorizedPath(userStore.permissions),
            query: mergeRetainedQuery(retainedQuery),
            replace: true
        }
    }

    return true
})
