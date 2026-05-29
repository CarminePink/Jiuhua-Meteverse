import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const loadingRoute: RouteRecordRaw = {
    path: '',
    name: 'RootLoading',
    component: () => import('@/layout/LoadingPage.vue')
}

const businessRoutes: RouteRecordRaw[] = [
    {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home/index.vue'),
        meta: { permission: 'home' }
    },
    {
        path: 'select',
        name: 'select',
        component: () => import('@/views/Select/index.vue'),
        meta: { permission: 'select' }
    }
]

// 1. 基础路由（无需权限，如登录页）
const baseRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404/NotFound.vue')
    }
]

// 2. 权限路由（需动态过滤，嵌套在 Layout 下）
const permissionRoutes: RouteRecordRaw = {
    path: '/',
    name: 'RootLayout',
    component: () => import('@/layout/index.vue'),
    children: [loadingRoute]
}

// 3. 创建路由器实例（初始仅包含基础路由）
const router = createRouter({
    history: createWebHistory(),
    routes: baseRoutes
})

const resolveAllowedBusinessRoutes = (permissions: string[] = []) => {
    if (!permissions.length) {
        return businessRoutes
    }

    return businessRoutes.filter(route => {
        const permission = route.meta?.permission
        return typeof permission === 'string' ? permissions.includes(permission) : true
    })
}

// 4. 动态添加权限路由的函数
export function addPermissionRoutes(permissions: string[] = []) {
    if (router.hasRoute('RootLayout')) {
        return resolveAllowedBusinessRoutes(permissions)
    }

    const allowedBusinessRoutes = resolveAllowedBusinessRoutes(permissions)

    router.addRoute({
        ...permissionRoutes,
        children: [loadingRoute, ...allowedBusinessRoutes]
    })

    return allowedBusinessRoutes
}

export function hasPermissionRoutesLoaded() {
    return router.hasRoute('RootLayout')
}

export function getProtectedBusinessPaths() {
    return businessRoutes.map(route => `/${route.path}`)
}

export function getDefaultAuthorizedPath(permissions: string[] = []) {
    const allowedRoutes = resolveAllowedBusinessRoutes(permissions)
    const firstRoute = allowedRoutes[0]

    return firstRoute ? `/${firstRoute.path}` : '/'
}

export default router
