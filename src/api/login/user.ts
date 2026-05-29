import request from '@/utils/request'
import other from '@/utils/other'

const encryptPasswordFields = (payload: Record<string, any>, fields: string[]) => {
    const encryptedPayload = { ...payload }

    fields.forEach(field => {
        if (typeof encryptedPayload[field] === 'string' && encryptedPayload[field]) {
            encryptedPayload[field] = other.encryption(
                encryptedPayload[field],
                import.meta.env.VITE_PWD_ENC_KEY
            )
        }
    })

    return encryptedPayload
}

export const pageList = (params?: object) => {
    return request({
        url: '/admin/user/page',
        method: 'get',
        params
    })
}

export const addObj = (obj: object) => {
    return request({
        url: '/admin/user',
        method: 'post',
        data: obj
    })
}

export const getObj = (id: string) => {
    return request({
        url: '/admin/user/details/' + id,
        method: 'get'
    })
}

export const delObj = (ids: object) => {
    return request({
        url: '/admin/user',
        method: 'delete',
        data: ids
    })
}

export const putObj = (obj: object) => {
    return request({
        url: '/admin/user',
        method: 'put',
        data: obj
    })
}

export function getDetails(obj: object) {
    return request({
        url: '/admin/user/details',
        method: 'get',
        params: obj
    })
}

// 更改个人信息
export function editInfo(obj: object) {
    return request({
        url: '/admin/user/personal/edit',
        method: 'put',
        data: obj
    })
}

// 更改个人密码
export function password(obj: object) {
    return request({
        url: '/admin/user/personal/password',
        method: 'put',
        data: obj
    })
}

export function unbindingUser(type: string) {
    return request({
        url: '/admin/user/unbinding',
        method: 'post',
        params: {
            type
        }
    })
}

export function checkPassword(password: string) {
    return request({
        url: '/admin/user/check',
        method: 'post',
        params: {
            password
        }
    })
}

/**
 * 注册用户
 */
export const registerUser = (userInfo: object) => {
    const encryptedUserInfo = encryptPasswordFields(userInfo as Record<string, any>, [
        'password',
        'newpassword1'
    ])

    return request({
        url: '/metaverseBiz/open/register/registerUser',
        method: 'post',
        data: encryptedUserInfo
    })
}

export function validateUsername(_rule: any, value: any, callback: any, isEdit: boolean) {
    const flag = /^[\u4e00-\u9fa5a-z\d]+$/.test(value)
    if (!flag) {
        return callback(new Error('用户名支持中文、小写英文、数字'))
    }

    if (isEdit) {
        return callback()
    }

    getDetails({ username: value }).then(response => {
        const result = response.data
        if (result !== null) {
            callback(new Error('用户名已经存在'))
        } else {
            callback()
        }
    })
}

export function validatePhone(_rule: any, value: any, callback: any, isEdit: boolean) {
    if (isEdit) {
        return callback()
    }
    getDetails({ phone: value }).then(response => {
        const result = response.data
        if (result !== null) {
            callback(new Error('手机号已经存在'))
        } else {
            callback()
        }
    })
}
