import * as CryptoJS from 'crypto-js'
import { validateNull } from './validate'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

/**
 *加密处理
 */
export function encryption(src: string, keyWord: string) {
    const key = CryptoJS.enc.Utf8.parse(keyWord)
    // 加密
    const encrypted = CryptoJS.AES.encrypt(src, key, {
        iv: key,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
    })
    return encrypted.toString()
}

/**
 *  解密
 * @param {*} params 参数列表
 * @returns 明文
 */
export function decryption(src: string, keyWord: string) {
    const key = CryptoJS.enc.Utf8.parse(keyWord)
    // 解密逻辑
    const decryptd = CryptoJS.AES.decrypt(src, key, {
        iv: key,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
    })

    return decryptd.toString(CryptoJS.enc.Utf8)
}

/**
 * 自动适配不同的后端架构
 * 1. 例如 /act/oa/task ,在微服务架构保持不变,在单体架构编程 /admin/oa/task
 * 2. 特殊 /gen/xxx ,在微服务架构、单体架构编程 都需保持不变
 *
 * @param originUrl 原始路径
 */
const adaptationUrl = (originUrl?: string) => {
    // 微服务架构 不做路径转换,为空不做路径转换
    const isMicro = import.meta.env.VITE_IS_MICRO
    if (validateNull(isMicro) || isMicro === 'true') {
        return originUrl
    }

    // 验证码服务
    if (originUrl?.startsWith('/code/')) {
        return `/admin${originUrl}`
    }

    // 如果是代码生成服务，不做路径转换
    if (originUrl?.startsWith('/gen')) {
        return originUrl
    }
    // 转为 /admin 路由前缀的请求
    return `/admin/${originUrl?.split('/').splice(2).join('/')}`
}

export function getQueryString(url: string, paraName: string) {
    const arrObj = url.split('?')
    if (arrObj.length > 1) {
        const arrPara = arrObj[1].split('&')
        let arr
        for (let i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split('=')
            // eslint-disable-next-line eqeqeq
            if (arr != null && arr[0] == paraName) {
                return arr[1]
            }
        }
        return ''
    } else {
        return ''
    }
}

/**
 * 打开小窗口
 */
export const openWindow = (url: string, title: string, w: number, h: number) => {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : screen.width
    const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : screen.height

    const left = width / 2 - w / 2 + dualScreenLeft
    const top = height / 2 - h / 2 + dualScreenTop
    return window.open(
        url,
        title,
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
            w +
            ', height=' +
            h +
            ', top=' +
            top +
            ', left=' +
            left
    )
}

/**
 * @description 生成唯一 uuid
 * @return string
 */
export function generateUUID() {
    if (typeof crypto === 'object') {
        if (typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID()
        }
        if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
            const callback = (c: any) => {
                const num = Number(c)
                return (
                    num ^
                    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))
                ).toString(16)
            }
            return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
        }
    }
    let timestamp = new Date().getTime()
    let performanceNow =
        (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let random = Math.random() * 16
        if (timestamp > 0) {
            random = ((timestamp + random) % 16) | 0
            timestamp = Math.floor(timestamp / 16)
        } else {
            random = ((performanceNow + random) % 16) | 0
            performanceNow = Math.floor(performanceNow / 16)
        }
        return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
    })
}

/**
 * 统一批量导出
 * @method elSvg 导出全局注册 element plus svg 图标
 * @method useTitle 设置浏览器标题国际化
 * @method setTagsViewNameI18n 设置 自定义 tagsView 名称、 自定义 tagsView 名称国际化
 * @method lazyImg 图片懒加载
 * @method globalComponentSize() element plus 全局组件大小
 * @method deepClone 对象深克隆
 * @method isMobile 判断是否是移动端
 * @method handleEmpty 判断数组对象中所有属性是否为空，为空则删除当前行对象
 * @method handleOpenLink 打开外部链接
 */
const other = {
    encryption: (src: string, keyWord: string) => {
        return encryption(src, keyWord)
    },
    decryption: (src: string, keyWord: string) => {
        return decryption(src, keyWord)
    },
    validateNull: (value: any) => {
        return validateNull(value)
    },
    adaptationUrl: (url?: string) => {
        return adaptationUrl(url)
    },
    getQueryString: (url: string, paraName: string) => {
        return getQueryString(url, paraName)
    },
    openWindow: (url: string, title: string, w: number, h: number) => {
        return openWindow(url, title, w, h)
    },
    downBlobFile: (url: any, query: any, fileName: string) => {
        return downBlobFile(url, query, fileName)
    }
}
/**
 *
 * @param url 目标下载接口
 * @param query 查询参数
 * @param fileName 文件名称
 * @returns {*}
 */

export function downBlobFile(url: any, query: any, fileName: string) {
    return request({
        url: url,
        method: 'get',
        responseType: 'blob',
        params: query
    }).then(response => {
        handleBlobFile(response, fileName)
    })
}
/**
 * blob 文件刘处理
 * @param response 响应结果
 * @returns
 */
export function handleBlobFile(response: any, fileName: string) {
    // 处理返回的文件流
    const blob = response
    if (blob && blob.size === 0) {
        ElMessage.error('内容为空，无法下载')
        return
    }
    const link = document.createElement('a')

    // 兼容一下 入参不是 File Blob 类型情况
    const binaryData = [] as any
    binaryData.push(response)
    link.href = window.URL.createObjectURL(new Blob(binaryData))
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function () {
        // @ts-ignore
        URL.revokeObjectURL(blob)
        document.body.removeChild(link)
    }, 0)
}
// 统一批量导出
export default other
