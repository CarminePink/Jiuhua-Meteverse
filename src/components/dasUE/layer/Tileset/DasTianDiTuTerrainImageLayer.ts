import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasTerrainImageLayerBase from './DasTerrainImageLayerBase'

/**
 * DasTianDiTuTerrainImageLayer - 天地图地形影像图层
 * 用于加载天地图WMTS服务的影像瓦片数据
 *
 * 天地图服务说明：
 * - 官网: https://www.tianditu.gov.cn/
 * - 需要申请开发者Token
 * - 支持多种图层类型
 *
 * 默认参数值：
 * @property {string} token - 天地图访问令牌(tk参数) (默认: "")
 *   需要在天地图官网申请
 * @property {string} layerType - 图层类型 (默认: "img_w")
 *   可选值:
 *   - "img_w": 影像底图(墨卡托投影)
 *   - "vec_w": 矢量底图(墨卡托投影)
 *   - "ter_w": 地形晕渲(墨卡托投影)
 *   - "cva_w": 矢量注记(墨卡托投影)
 *   - "cia_w": 影像注记(墨卡托投影)
 * @property {string} baseUrl - 天地图服务基础URL (默认: "http://t0.tianditu.gov.cn")
 *   也可以使用: t1, t2, t3, t4, t5, t6, t7 进行负载均衡
 */
export default class DasTianDiTuTerrainImageLayer extends DasTerrainImageLayerBase {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasTianDiTuTerrainImageLayer'
    }

    /**
     * 设置天地图访问令牌
     * @param {string} token - 天地图访问令牌(tk参数)
     * @returns {Promise<boolean>} - 设置是否成功
     *
     * @example
     * // 设置天地图Token
     * await layer.setToken("your_tianditu_token_here");
     */
    setToken = async token => {
        const param = { token: token }
        return await this.excuteUEClassFunction('setToken', param)
    }

    /**
     * 设置图层类型
     * @param {string} layerType - 图层类型
     * @returns {Promise<boolean>} - 设置是否成功
     *
     * @example
     * // 设置为影像底图
     * await layer.setLayerType("img_w");
     *
     * @example
     * // 设置为矢量底图
     * await layer.setLayerType("vec_w");
     *
     * @example
     * // 设置为地形晕渲
     * await layer.setLayerType("ter_w");
     */
    setLayerType = async layerType => {
        const param = { layerType: layerType }
        return await this.excuteUEClassFunction('setLayerType', param)
    }

    /**
     * 设置天地图服务基础URL
     * @param {string} baseUrl - 天地图服务基础URL
     * @returns {Promise<boolean>} - 设置是否成功
     *
     * @example
     * // 使用默认服务器
     * await layer.setBaseUrl("http://t0.tianditu.gov.cn");
     *
     * @example
     * // 使用其他服务器进行负载均衡
     * await layer.setBaseUrl("http://t3.tianditu.gov.cn");
     */
    setBaseUrl = async baseUrl => {
        const param = { baseUrl: baseUrl }
        return await this.excuteUEClassFunction('setBaseUrl', param)
    }

    /**
     * 一次性更新所有属性
     * @param {Object} config - 配置对象，可包含以下属性：
     * @param {string} [config.token] - 天地图访问令牌
     * @param {string} [config.layerType] - 图层类型
     * @param {string} [config.baseUrl] - 天地图服务基础URL
     * @returns {Promise<boolean>} - 更新是否成功
     *
     * @example
     * // 一次性配置天地图图层
     * await layer.updateAll({
     *     token: "your_tianditu_token",
     *     layerType: "img_w",
     *     baseUrl: "http://t0.tianditu.gov.cn"
     * });
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * 获取所有属性
     * @returns {Promise<Object>} - 包含所有属性的对象：
     * @returns {string} token - 天地图访问令牌
     * @returns {string} layerType - 图层类型
     * @returns {string} baseUrl - 天地图服务基础URL
     *
     * @example
     * const config = await layer.getAll();
     * console.log(`Token: ${config.token}`);
     * console.log(`Layer Type: ${config.layerType}`);
     * console.log(`Base URL: ${config.baseUrl}`);
     */
    getAll = async () => {
        let result = {}
        await this.excuteUEClassFunction('getAll', {}, function (json) {
            result = {
                token: json.token,
                layerType: json.layerType,
                baseUrl: json.baseUrl
            }
        })
        return result
    }

    /**
     * 创建新的天地图地形影像图层实例
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 图层的初始配置（同updateAll的所有参数）
     * @param {string} [param.param.token] - 天地图访问令牌
     * @param {string} [param.param.layerType] - 图层类型
     * @param {string} [param.param.baseUrl] - 天地图服务基础URL
     * @param {boolean} [param.param.attach] - 是否立即附加到地形
     * @returns {Promise<DasTianDiTuTerrainImageLayer>} - 新的天地图地形影像图层实例
     *
     * @example
     * // 创建天地图影像图层
     * const tianDiTuLayer = await DasTianDiTuTerrainImageLayer.createInstance({
     *     param: {
     *         token: "your_tianditu_token",
     *         layerType: "img_w",
     *         baseUrl: "http://t0.tianditu.gov.cn",
     *         attach: true
     *     }
     * });
     *
     * @example
     * // 创建天地图矢量图层
     * const vectorLayer = await DasTianDiTuTerrainImageLayer.createInstance({
     *     param: {
     *         token: "your_tianditu_token",
     *         layerType: "vec_w"
     *     }
     * });
     * await vectorLayer.setAttach(true);
     *
     * @example
     * // 创建天地图地形晕渲图层
     * const terrainLayer = await DasTianDiTuTerrainImageLayer.createInstance({
     *     param: {
     *         token: "your_tianditu_token",
     *         layerType: "ter_w"
     *     }
     * });
     */
    async createInstance(param) {
        let layer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasTianDiTuTerrainImageLayer',
            'createInstance',
            { param: param },
            function (json) {
                layer = new DasTianDiTuTerrainImageLayer()
                layer.readObjectInfo(json.object)
            }
        )

        return layer
    }

    /**
     * 批量创建多个DasTianDiTuTerrainImageLayer实例
     * @param {Object} param - 参数对象，应包含'params'数组
     * @param {Array<Object>} param.params - 每个图层的配置对象数组
     * @param {string} [param.params[].token] - 天地图访问令牌
     * @param {string} [param.params[].layerType] - 图层类型
     * @param {string} [param.params[].baseUrl] - 天地图服务基础URL
     * @returns {Promise<Array<DasTianDiTuTerrainImageLayer>>} - 创建的图层对象数组
     *
     * @example
     * // 批量创建多个天地图图层
     * const layers = await DasTianDiTuTerrainImageLayer.batchCreateInstance({
     *     params: [
     *         { token: "your_token", layerType: "img_w" },  // 影像底图
     *         { token: "your_token", layerType: "cia_w" }   // 影像注记
     *     ]
     * });
     *
     * // 附加所有图层
     * for (const layer of layers) {
     *     await layer.setAttach(true);
     * }
     */
    async batchCreateInstance(param) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            'DasTianDiTuTerrainImageLayer',
            'batchCreateInstance',
            param,
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasTianDiTuTerrainImageLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }
}
