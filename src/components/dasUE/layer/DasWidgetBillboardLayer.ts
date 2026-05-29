import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasWidgetBillboardLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasWidgetBillboardLayer'
    }

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
    setBillboardSize = async (width, height) => {
        const param = { width: width, height: height }
        return await this.excuteUEClassFunction('setBillboardSize', param)
    }

    /**
     * 设置自动缩放
     * @param {boolean} autoScale - 是否启用自动缩放
     * @returns {Promise<boolean>} - 成功结果
     */
    setAutoScale = async autoScale => {
        const param = { autoScale: autoScale }
        return await this.excuteUEClassFunction('setAutoScale', param)
    }

    /**
     * 设置深度偏移系数
     * @param {number} rate - 深度偏移系数
     * @returns {Promise<boolean>} - 成功结果
     */
    setDepthOffsetRate = async rate => {
        const param = { rate: rate }
        return await this.excuteUEClassFunction('setDepthOffsetRate', param)
    }

    /**
     * 设置混合模式
     * @param {number|string} blendMode - 混合模式，支持数字(0=Opaque, 1=Masked, 2=Transparent)或字符串("Opaque", "Masked", "Transparent")
     * @returns {Promise<boolean>} - 成功结果
     */
    setBlendMode = async blendMode => {
        const param = { blendMode: blendMode }
        return await this.excuteUEClassFunction('setBlendMode', param)
    }
    /**
     * 设置标牌位置
     * @param {Array<number>} posLLH - 经纬度高程坐标数组 [longitude, latitude, height]
     * @returns {Promise<boolean>} - 成功结果
     */
    setPosition = async posLLH => {
        if (!Array.isArray(posLLH) || posLLH.length < 3) {
            return false
        }
        const param = { posLLH: posLLH }
        return await this.excuteUEClassFunction('setPosition', param)
    }

    /**
     * 获取标牌位置
     * @returns {Promise<Array<number>>} - 经纬度高程坐标数组 [longitude, latitude, height]
     */
    getPosition = async () => {
        let result = null
        await this.excuteUEClassFunction('getPosition', {}, json => {
            if (json.posLLH) {
                result = json.posLLH
            }
        })
        return result || [0, 0, 0]
    }
    /**
     * 设置屏幕偏移量
     * @param {number} offsetX - X轴偏移量
     * @param {number} offsetY - Y轴偏移量
     * @returns {Promise<boolean>} - 成功结果
     */
    setScreenOffset = async (offsetX, offsetY) => {
        const param = { offsetX: offsetX, offsetY: offsetY }
        return await this.excuteUEClassFunction('setScreenOffset', param)
    }

    /**
     * 获取屏幕偏移量
     * @returns {Promise<Array<number>>} - 偏移量数组 [offsetX, offsetY]
     */
    getScreenOffset = async () => {
        let result = null
        await this.excuteUEClassFunction('getScreenOffset', {}, function (json) {
            if (json.offset) {
                result = json.offset
            }
        })
        return result || [0, 0]
    }
    /**
     * 一次性更新所有属性
     * @param {Object} config - 配置对象，可包含以下属性：
     * @param {string} [config.url] - 网页URL
     * @param {string} [config.fileData] - HTML内容
     * @param {number} [config.width] - 宽度
     * @param {number} [config.height] - 高度
     * @param {Array<number>} [config.size] - 大小数组 [width, height]
     * @param {boolean} [config.autoScale] - 是否启用自动缩放
     * @param {number} [config.rate] - 深度偏移系数
     * @param {number|string} [config.blendMode] - 混合模式，支持数字(0=Opaque, 1=Masked, 2=Transparent)或字符串
     * @param {Array<number>} [config.posLLH] - 经纬度高程坐标数组 [longitude, latitude, height]
     * @param {number} [config.offsetX] - X轴屏幕偏移量
     * @param {number} [config.offsetY] - Y轴屏幕偏移量
     * @param {Array<number>} [config.offset] - 偏移量数组 [offsetX, offsetY]
     * @returns {Promise<boolean>} - 成功结果
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * 创建标牌图层实例
     * @param {Object} param - 创建参数
     * @param {string} [param.url] - 网页URL
     * @param {string} [param.fileData] - HTML内容
     * @param {number} [param.width] - 宽度
     * @param {number} [param.height] - 高度
     * @param {boolean} [param.autoScale] - 是否启用自动缩放
     * @param {number|string} [param.param.blendMode] - 混合模式
     * @param {Array<number>} [param.posLLH] - 经纬度高程坐标数组 [longitude, latitude, height]
     * @param {number} [param.param.offsetX] - X轴屏幕偏移量
     * @param {number} [param.param.offsetY] - Y轴屏幕偏移量
     * @param {Array<number>} [param.param.offset] - 偏移量数组 [offsetX, offsetY]
     * @returns {Promise<DasWidgetBillboardLayer>} - 新创建的标牌图层实例
     */
    async createInstance(param) {
        let billboardLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasWidgetBillboardLayer',
            'createInstance',
            { param: param },
            function (json) {
                billboardLayer = new DasWidgetBillboardLayer()
                billboardLayer.readObjectInfo(json.object)
            }
        )

        return billboardLayer
    }

    /**
     * 批量创建多个标牌图层实例
     * @param {Object} param - 包含参数数组的对象
     * @returns {Promise<Array>} - 创建的图层对象数组
     */
    async batchCreateInstance(params) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            'DasWidgetBillboardLayer',
            'batchCreateInstance',
            { params },
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasWidgetBillboardLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }
}
