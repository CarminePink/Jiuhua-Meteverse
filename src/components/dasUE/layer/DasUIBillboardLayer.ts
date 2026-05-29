import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'
import { useDasUE } from '@/hooks/useDasUEHook'

export default class DasUIBillboardLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasUIBillboardLayer'
    }

    static smapID2Callback = new Map()
    static isInitListener = false

    /**
     * 设置网页URL
     * @param {string} url - 网页URL
     * @returns {Promise<boolean>} - 成功结果
     */
    setURL = async url => {
        const param = { url: url }
        return await this.excuteUEClassFunction('setURL', param)
    }

    /**
     * 获取当前URL
     * @returns {Promise<string>} - 当前URL
     */
    getURL = async () => {
        let url = ''
        await this.excuteUEClassFunction('getURL', {}, function (json) {
            url = json.url
        })
        return url
    }

    /**
     * 设置HTML内容
     * @param {string} fileData - HTML内容
     * @returns {Promise<boolean>} - 成功结果
     */
    setFileData = async fileData => {
        const param = { fileData: fileData }
        return await this.excuteUEClassFunction('setFileData', param)
    }

    /**
     * 设置标牌大小
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @returns {Promise<boolean>} - 成功结果
     */
    setSize = async (width, height) => {
        const param = { width: width, height: height }
        return await this.excuteUEClassFunction('setSize', param)
    }

    /**
     * 设置屏幕偏移量
     * @param {number} x - X偏移量
     * @param {number} y - Y偏移量
     * @returns {Promise<boolean>} - 成功结果
     */
    setScreenOffset = async (x, y) => {
        const param = { x: x, y: y }
        return await this.excuteUEClassFunction('setScreenOffset', param)
    }

    /**
     * 设置UI可见性
     * @param {boolean} visible - 是否可见
     * @returns {Promise<boolean>} - 成功结果
     */
    setUIVisible = async visible => {
        const param = { visible: visible }
        return await this.excuteUEClassFunction('setUIVisible', param)
    }
    /**
     * 设置是否只在点位可见时显示UI
     * @param {boolean} onlyWhenVisible - 是否只在点位可见时显示
     * @returns {Promise<boolean>} - 成功结果
     */
    setOnlyVisibleWhenPointVisible = async onlyWhenVisible => {
        const param = { onlyWhenVisible: onlyWhenVisible }
        return await this.excuteUEClassFunction('setOnlyVisibleWhenPointVisible', param)
    }

    /**
     * 设置地理位置
     * @param {Array<number>} posLLH - 经纬度高程坐标数组 [longitude, latitude, height]
     * @returns {Promise<boolean>} - 成功结果
     */
    setGeoPosition = async posLLH => {
        if (!Array.isArray(posLLH) || posLLH.length < 3) {
            return false
        }
        const param = { posLLH: posLLH }
        return await this.excuteUEClassFunction('setGeoPosition', param)
    }

    /**
     * 获取地理位置
     * @returns {Promise<Array<number>>} - 经纬度高程坐标数组 [longitude, latitude, height]
     */
    getGeoPosition = async () => {
        let result = null
        await this.excuteUEClassFunction('getGeoPosition', {}, json => {
            if (json.posLLH) {
                result = json.posLLH
            }
        })
        return result || [0, 0, 0]
    }

    /**
     * 执行JavaScript代码
     * @param {string} script - JavaScript代码
     * @returns {Promise<boolean>} - 成功结果
     */
    excuteJavaScript = async script => {
        const param = { script: script }
        return await this.excuteUEClassFunction('excuteJavaScript', param)
    }

    /**
     * 一次性更新所有属性
     * @param {Object} config - 配置对象，可包含以下属性：
     * @param {string} [config.url] - 网页URL
     * @param {string} [config.fileData] - HTML内容
     * @param {number} [config.width] - 宽度
     * @param {number} [config.height] - 高度
     * @param {Array<number>} [config.size] - 大小数组 [width, height]
     * @param {number} [config.x] - X偏移量
     * @param {number} [config.y] - Y偏移量
     * @param {Array<number>} [config.offset] - 偏移量数组 [x, y]
     * @param {boolean} [config.visible] - 是否可见
     * @param {boolean} [config.onlyWhenVisible] - 是否只在点位可见时显示
     * @param {Array<number>} [config.posLLH] - 经纬度高程坐标数组 [longitude, latitude, height]
     * @param {string} [config.script] - JavaScript代码
     * @returns {Promise<boolean>} - 成功结果
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * 创建UI标牌图层实例
     * @param {Object} param - 创建参数
     * @param {string} [param.url] - 网页URL
     * @param {string} [param.fileData] - HTML内容
     * @param {number} [param.width] - 宽度
     * @param {number} [param.height] - 高度
     * @param {Array<number>} [param.posLLH] - 经纬度高程坐标数组 [longitude, latitude, height]
     * @returns {Promise<DasUIBillboardLayer>} - 新创建的标牌图层实例
     */
    async createInstance(param) {
        let billboardLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasUIBillboardLayer',
            'createInstance',
            { param },
            json => {
                billboardLayer = new DasUIBillboardLayer()
                billboardLayer.readObjectInfo(json.object)
            }
        )

        return billboardLayer
    }

    async createInstanceWithListener(param) {
        let billboardLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasUIBillboardLayer',
            'createInstance',
            { param },
            json => {
                billboardLayer = new DasUIBillboardLayer()
                billboardLayer.readObjectInfo(json.object)
                billboardLayer.addWebConsoleMessageListener(param.onMessage)
            }
        )
        return billboardLayer
    }

    addWebConsoleMessageListener = callback => {
        if (!DasUIBillboardLayer.isInitListener) {
            const viewer = useDasUE().dasUE.viewer
            DasUIBillboardLayer.isInitListener = true
            viewer.addResponseEventListener(this.className, json => {
                const JsonObject = JSON.parse(json)
                if (
                    !JsonObject.message ||
                    JsonObject.class != this.className ||
                    JsonObject.messageName != 'consoleMessage'
                )
                    return

                const JsonObjectMessage = JSON.parse(JsonObject.message)
                const id = JsonObjectMessage.id
                const callback = DasUIBillboardLayer.smapID2Callback.get(id)
                if (callback) {
                    const layer = new DasUIBillboardLayer()
                    layer.id = id
                    callback(layer, JsonObjectMessage)
                }
            })
        }
        DasUIBillboardLayer.smapID2Callback.set(this.id, callback)
    }

    clearWebConsoleMessageListener = () => {
        DasUIBillboardLayer.smapID2Callback.clear()
    }

    /**
     * 批量创建多个UI标牌图层实例
     * @param {Object} param - 包含参数数组的对象
     * @returns {Promise<Array>} - 创建的图层对象数组
     */
    async batchCreateInstance(params) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            'DasUIBillboardLayer',
            'batchCreateInstance',
            { params },
            json => {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasUIBillboardLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }

    // 有bug
    // async batchCreateInstanceWithListener(params) {
    //     let layers = []
    //     await ExcuteUEFun.excuteUEFunction(
    //         'DasUIBillboardLayer',
    //         'batchCreateInstance',
    //         { params: params.data },
    //         json => {
    //             if (Array.isArray(json.layers)) {
    //                 layers = json.layers.map(obj => {
    //                     const layer = new DasUIBillboardLayer()
    //                     layer.readObjectInfo(obj)
    //                     // layer.addWebConsoleMessageListener(params.onMessage)
    //                     return layer
    //                 })
    //             }
    //         }
    //     )
    //     layers.forEach(layer => {
    //         layer.addWebConsoleMessageListener(params.onMessage)
    //     })
    //     return layers
    // }
}
