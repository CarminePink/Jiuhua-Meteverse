import request from '@/utils/request'

// 保存角色性别
export function saveRoleGender(obj: object) {
    return request({
        url: '/metaverseBiz/meta/user/profile/character-gender',
        method: 'put',
        data: obj
    })
}
