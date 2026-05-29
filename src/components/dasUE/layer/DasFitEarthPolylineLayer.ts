import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

/**
 * DasFitEarthPolylineLayer - 贴地折线图层类
 *
 * 默认参数值：
 * @property {Array<Array<number>>} points - 点集合 (默认: [])
 *   每个点为 [经度, 纬度, 高度] 格式
 * @property {Array<number>} color - 颜色 [r, g, b, a] (默认: [1.0, 1.0, 1.0, 1.0])
 *   范围: 每个分量 0.0-1.0
 * @property {number} thickness - 线条粗细 (默认: 1.0)
 *   单位: 像素（屏幕空间）或米（世界空间）
 * @property {boolean} screenSpace - 是否屏幕固定 (默认: true)
 *   true: 线条粗细为屏幕像素
 *   false: 线条粗细为世界空间米
 * @property {boolean} fixScreen - 是否屏幕固定 (默认: false)
 *   true: 线条固定在屏幕空间
 *   false: 线条在世界空间
 * @property {boolean} fitEarth - 是否贴地 (默认: false)
 *   true: 折线贴合地形
 *   false: 折线不贴地
 * @property {number} fitEarthHeight - 贴地高度，单位米 (默认: 20000.0)
 *   向下贴地的最大距离
 */
export default class DasFitEarthPolylineLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasFitEarthPolylineLayer'
    }

    /**
     * 使用LLH（经度、纬度、高度）坐标设置点位
     * @param {Array} points - [经度, 纬度, 高度]数组的数组
     * @returns {Promise<boolean>} - 成功结果
     */
    setPointsLLH = async (points: number[][]) => {
        const param = { points: points }
        return await this.excuteUEClassFunction('setPointsLLH', param)
    }

    /**
     * 获取LLH（经度、纬度、高度）格式的点位
     * @returns {Promise<Array>} - [经度, 纬度, 高度]数组的数组
     */
    getPointsLLH = async () => {
        let points = []
        await this.excuteUEClassFunction('getPointsLLH', {}, function (json) {
            points = json.points
        })
        return points
    }

    /**
     * 设置折线颜色
     * @param {Array<number>} color - 颜色值 [r, g, b, a]，每个值范围0-1
     * @returns {Promise<boolean>} - 成功结果
     */
    setColor = async (color: number[]) => {
        const param = { color: color }
        return await this.excuteUEClassFunction('setColor', param)
    }

    /**
     * 获取折线颜色
     * @returns {Promise<Array<number>>} - 颜色值 [r, g, b, a]，每个值范围0-1
     */
    getColor = async () => {
        let color = []
        await this.excuteUEClassFunction('getColor', {}, function (json) {
            color = json.color
        })
        return color
    }

    /**
     * 设置线条粗细
     * @param {number} thickness - 线条粗细
     * @param {boolean} screenSpace - 是否屏幕固定 (默认: true)
     * @returns {Promise<boolean>} - 成功结果
     */
    setThickness = async (thickness: number, screenSpace = true) => {
        const param = { thickness: thickness, screenSpace: screenSpace }
        return await this.excuteUEClassFunction('setThickness', param)
    }

    /**
     * 获取线条粗细
     * @returns {Promise<number>} - 线条粗细
     */
    getThickness = async () => {
        let thickness = 1.0
        await this.excuteUEClassFunction('getThickness', {}, function (json) {
            thickness = json.thickness
        })
        return thickness
    }

    /**
     * 设置是否屏幕固定
     * @param {boolean} fixScreen - 是否屏幕固定 (默认: false)
     * @returns {Promise<boolean>} - 成功结果
     */
    setFixScreen = async fixScreen => {
        const param = { fixScreen: fixScreen }
        return await this.excuteUEClassFunction('setFixScreen', param)
    }

    /**
     * 获取是否屏幕固定
     * @returns {Promise<boolean>} - 是否屏幕固定
     */
    getFixScreen = async () => {
        let fixScreen = false
        await this.excuteUEClassFunction('getFixScreen', {}, function (json) {
            fixScreen = json.fixScreen
        })
        return fixScreen
    }

    /**
     * 设置是否贴地
     * @param {boolean} fitEarth - 是否贴地 (默认: false)
     * @returns {Promise<boolean>} - 成功结果
     */
    setFitEarth = async (fitEarth: boolean) => {
        const param = { fitEarth: fitEarth }
        return await this.excuteUEClassFunction('setFitEarth', param)
    }

    /**
     * 获取是否贴地
     * @returns {Promise<boolean>} - 是否贴地
     */
    isFitEarth = async () => {
        let fitEarth = false
        await this.excuteUEClassFunction('isFitEarth', {}, function (json) {
            fitEarth = json.fitEarth
        })
        return fitEarth
    }

    /**
     * 设置贴地高度
     * @param {number} fitEarthHeight - 贴地高度，单位米 (默认: 20000.0)
     * @returns {Promise<boolean>} - 成功结果
     */
    setFitEarthHeight = async (fitEarthHeight: number) => {
        const param = { fitEarthHeight: fitEarthHeight }
        return await this.excuteUEClassFunction('setFitEarthHeight', param)
    }

    /**
     * 获取贴地高度
     * @returns {Promise<number>} - 贴地高度，单位米
     */
    getFitEarthHeight = async () => {
        let fitEarthHeight = 0.0
        await this.excuteUEClassFunction('getFitEarthHeight', {}, function (json) {
            fitEarthHeight = json.fitEarthHeight
        })
        return fitEarthHeight
    }

    /**
     * 一次性更新所有属性
     * @param {Object} config - 组合配置对象，可包含以下属性：
     * @param {Array} [config.points] - [经度, 纬度, 高度]数组的数组
     * @param {Array<number>} [config.color] - 颜色值 [r, g, b, a]，每个值范围0-1
     * @param {number} [config.thickness] - 线条粗细
     * @param {boolean} [config.screenSpace] - 是否屏幕固定
     * @param {boolean} [config.fixScreen] - 是否屏幕固定 (默认: false)
     * @param {boolean} [config.fitEarth] - 是否贴地
     * @param {number} [config.fitEarthHeight] - 贴地高度，单位米
     * @returns {Promise<boolean>} - 成功结果
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * 获取所有属性
     * @returns {Promise<Object>} - 包含所有属性的对象：
     * @returns {Array} points - [经度, 纬度, 高度]数组的数组
     * @returns {Array<number>} color - 颜色值 [r, g, b, a]，每个值范围0-1
     * @returns {number} thickness - 线条粗细
     * @returns {boolean} fixScreen - 是否屏幕固定
     * @returns {boolean} fitEarth - 是否贴地
     * @returns {number} fitEarthHeight - 贴地高度，单位米
     */
    getAll = async () => {
        let result = {}
        await this.excuteUEClassFunction('getAll', {}, function (json) {
            result = {
                points: json.points,
                color: json.color,
                thickness: json.thickness,
                fixScreen: json.fixScreen,
                fitEarth: json.fitEarth,
                fitEarthHeight: json.fitEarthHeight
            }
        })
        return result
    }

    /**
     * 创建新的贴地折线图层实例
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 图层的初始配置（同updateAll的所有参数）
     * @param {Array} [param.param.points] - [经度, 纬度, 高度]数组的数组
     * @param {Array<number>} [param.param.color] - 颜色值 [r, g, b, a]，每个值范围0-1
     * @param {number} [param.param.thickness] - 线条粗细
     * @param {boolean} [param.param.screenSpace] - 是否屏幕固定 (默认: true)
     * @param {boolean} [param.param.fixScreen] - 是否屏幕固定 (默认: false)
     * @param {boolean} [param.param.fitEarth] - 是否贴地 (默认: false)
     * @param {number} [param.param.fitEarthHeight] - 贴地高度，单位米 (默认: 20000.0)
     * @returns {Promise<DasFitEarthPolylineLayer>} - 新的贴地折线图层实例
     */
    async createInstance(param) {
        let fitEarthPolylineLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasFitEarthPolylineLayer',
            'createInstance',
            param,
            function (json) {
                fitEarthPolylineLayer = new DasFitEarthPolylineLayer()
                fitEarthPolylineLayer.readObjectInfo(json.object)
            }
        )

        return fitEarthPolylineLayer
    }

    /**
     * 批量创建多个DasFitEarthPolylineLayer实例
     * @param {Object} param - 参数对象，应包含'params'数组
     * @returns {Promise<Array>} - 创建的图层对象数组
     */
    async batchCreateInstance(param) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            'DasFitEarthPolylineLayer',
            'batchCreateInstance',
            { params: param },
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasFitEarthPolylineLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }
}
