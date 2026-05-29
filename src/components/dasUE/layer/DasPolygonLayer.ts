import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasPolygonLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasPolygonLayer'
    }

    /**
     * 使用LLH（经度、纬度、高度）坐标设置点位
     * @param {Array} points - [经度, 纬度, 高度]数组的数组
     * @returns {Promise<boolean>} - 成功结果
     */
    setPointsLLH = async points => {
        const param = { points: points }
        return await this.excuteUEClassFunction('setPointsLLH', param)
    }

    /**
     * 获取LLH（经度、纬度、高度）格式的点位
     * @returns {Promise<Array>} - [经度, 纬度, 高度]数组的数组
     */
    getPointsLLH = async () => {
        let points = []
        await this.excuteUEClassFunction('getPointsLLH', {}, json => {
            points = json.points
        })
        return points
    }

    /**
     * 设置多边形颜色
     * @param {Array<number>} color - 颜色值 [r, g, b, a]，每个值范围0-1
     * @returns {Promise<boolean>} - 成功结果
     */
    setColor = async color => {
        const param = { color: color }
        return await this.excuteUEClassFunction('setColor', param)
    }

    /**
     * 启用或禁用多边形的深度测试
     * @param {boolean} enableDepthTest - 是否启用深度测试
     * @returns {Promise<boolean>} - 成功结果
     */
    setDepthTest = async enableDepthTest => {
        const param = { enableDepthTest: enableDepthTest }
        return await this.excuteUEClassFunction('setDepthTest', param)
    }

    /**
     * 设置多边形纹理
     * @param {string} texturePath - 纹理资产路径
     * @returns {Promise<boolean>} - 成功结果
     */
    setTexture = async texturePath => {
        const param = { texturePath: texturePath }
        return await this.excuteUEClassFunction('setTexture', param)
    }

    /**
     * 设置光照强度
     * @param {number} lightIntensity - 光照强度值
     * @returns {Promise<boolean>} - 成功结果
     */
    setLightIntensity = async lightIntensity => {
        const param = { lightIntensity: lightIntensity }
        return await this.excuteUEClassFunction('setLightIntensity', param)
    }

    /**
     * 更新带状材质参数
     * @param {Object} config - 带状配置对象，可包含以下属性：
     * @param {number} [config.bandHeightRatio] - 带状高度比例值 (0.0-1.0)
     * @param {number} [config.bandWidthScale] - 带状宽度缩放值
     * @param {number} [config.bandUVScale] - 带状UV缩放值
     * @param {number} [config.bandRotateAngle] - 旋转角度（弧度）
     * @param {number} [config.bandScale] - 带状缩放值
     * @param {number} [config.bandTextureStripWidthRatio] - 纹理条带宽度比例 (0.0-1.0)
     * @returns {Promise<boolean>} - 成功结果
     */
    UpdateBandMaterial = async config => {
        return await this.excuteUEClassFunction('UpdateBandMaterial', config)
    }

    /**
     * 一次性更新所有属性
     * @param {Object} config - 组合配置对象，可包含以下属性：
     * @param {Array} [config.points] - [经度, 纬度, 高度]数组的数组
     * @param {Array<number>} [config.color] - 颜色值 [r, g, b, a]，每个值范围0-1
     * @param {boolean} [config.enableDepthTest] - 是否启用深度测试
     * @param {string} [config.texturePath] - 纹理资产路径
     * @param {number} [config.lightIntensity] - 光照强度值
     * @param {string} [config.bandMaterialPath] - 带状材质资产路径
     * @param {number} [config.bandHeightRatio] - 带状高度比例值 (0.0-1.0)
     * @param {number} [config.bandWidthScale] - 带状宽度缩放值
     * @param {number} [config.bandUVScale] - 带状UV缩放值
     * @param {number} [config.bandRotateAngle] - 旋转角度（弧度）
     * @param {number} [config.bandScale] - 带状缩放值
     * @param {number} [config.bandTextureStripWidthRatio] - 纹理条带宽度比例 (0.0-1.0)
     * @returns {Promise<boolean>} - 成功结果
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * 创建新的多边形图层实例
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 图层的初始配置
     * @param {Array} [param.param.points] - [经度, 纬度, 高度]数组的数组
     * @param {Array<number>} [param.param.color] - 颜色值 [r, g, b, a]，每个值范围0-1
     * @param {number} [param.param.bandHeightRatio] - 带状高度比例值 (0.0-1.0)
     * @param {Object} [param.param.bandConfig] - 带状配置
     * @returns {Promise<DasPolygonLayer>} - 新的多边形图层实例
     */
    async createInstance(param) {
        let polygonLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasPolygonLayer',
            'createInstance',
            param,
            function (json) {
                polygonLayer = new DasPolygonLayer()
                polygonLayer.readObjectInfo(json.object)
            }
        )

        return polygonLayer
    }

    /**
     * 批量创建多个DasPolygonLayer实例
     * @param {Object} param - 参数对象，应包含'params'数组
     * @returns {Promise<Array>} - 创建的图层对象数组
     */
    async batchCreateInstance(param) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            'DasPolygonLayer',
            'batchCreateInstance',
            { params: param },
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasPolygonLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }
}
