import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasTerrainImageLayerBase from './DasTerrainImageLayerBase'

/**
 * DasTemplateTerrainImageLayer - 模板地形影像图层
 * 用于加载基于URL模板的地形影像瓦片数据
 *
 * 支持标准的瓦片URL模板格式，例如：
 * - TMS格式: "http://server.com/tiles/{z}/{x}/{y}.png"
 * - 其他自定义模板格式
 *
 * 默认参数值：
 * @property {string} baseUrl - 影像瓦片的基础URL模板路径 (默认: "")
 *   支持占位符: {z} (缩放级别), {x} (瓦片X坐标), {y} (瓦片Y坐标)
 *   示例: "https://example.com/tiles/{z}/{x}/{y}"
 * @property {string} imageSuffix - 图片后缀名 (默认: ".png")
 *   支持格式: ".png", ".jpg", ".jpeg", ".webp" 等
 */
export default class DasTemplateTerrainImageLayer extends DasTerrainImageLayerBase {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasTemplateTerrainImageLayer'
    }

    /**
     * 设置影像瓦片的基础URL路径
     * @param {string} baseUrl - URL模板字符串
     * @returns {Promise<boolean>} - 设置是否成功
     *
     * @example
     * // 设置OpenStreetMap瓦片服务器
     * await layer.setBaseUrl("file:////10.100.201.61/public/LF/yingxiang/14/osm_tiles");
     *
     * // 设置自定义瓦片服务器
     * await layer.setBaseUrl("file:////10.100.201.61/public/LF/yingxiang/14/osm_tiles");
     */
    setBaseUrl = async baseUrl => {
        const param = { baseUrl: baseUrl }
        return await this.excuteUEClassFunction('setBaseUrl', param)
    }

    /**
     * 设置图片后缀名
     * @param {string} imageSuffix - 图片后缀（如 ".png", ".jpg", ".webp"）
     * @returns {Promise<boolean>} - 设置是否成功
     *
     * @example
     * // 设置为PNG格式
     * await layer.setImageSuffix(".png");
     *
     * // 设置为JPEG格式
     * await layer.setImageSuffix(".jpg");
     */
    setImageSuffix = async imageSuffix => {
        const param = { imageSuffix: imageSuffix }
        return await this.excuteUEClassFunction('setImageSuffix', param)
    }

    /**
     * 一次性更新所有属性
     * @param {Object} config - 配置对象，可包含以下属性：
     * @param {string} [config.baseUrl] - 影像瓦片的基础URL模板路径
     * @param {string} [config.imageSuffix] - 图片后缀名（如 ".png", ".jpg", ".webp"）
     * @returns {Promise<boolean>} - 更新是否成功
     *
     * @example
     * // 一次性配置图层
     * await layer.updateAll({
     *     baseUrl: "https://tile.openstreetmap.org",
     *     imageSuffix: ".png"
     * });
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * 获取所有属性
     * @returns {Promise<Object>} - 包含所有属性的对象：
     * @returns {string} baseUrl - 影像瓦片的基础URL模板路径
     * @returns {string} imageSuffix - 图片后缀名
     *
     * @example
     * const config = await layer.getAll();
     * console.log(`Base URL: ${config.baseUrl}`);
     * console.log(`Image Suffix: ${config.imageSuffix}`);
     */
    getAll = async () => {
        let result = {}
        await this.excuteUEClassFunction('getAll', {}, function (json) {
            result = {
                baseUrl: json.baseUrl,
                imageSuffix: json.imageSuffix
            }
        })
        return result
    }

    /**
     * 创建新的模板地形影像图层实例
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 图层的初始配置（同updateAll的所有参数）
     * @param {string} [param.param.baseUrl] - 影像瓦片的基础URL模板路径
     * @param {string} [param.param.imageSuffix] - 图片后缀名（如 ".png", ".jpg", ".webp"）
     * @returns {Promise<DasTemplateTerrainImageLayer>} - 新的模板地形影像图层实例
     *
     * @example
     * // 创建OpenStreetMap影像图层
     * const osmLayer = await DasTemplateTerrainImageLayer.createInstance({
     *     param: {
     *         baseUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}",
     *         imageSuffix: ".png"
     *     }
     * });
     *
     * // 附加到地形
     * await osmLayer.setAttach(true);
     *
     * @example
     * // 创建自定义瓦片服务图层
     * const customLayer = await DasTemplateTerrainImageLayer.createInstance({
     *     param: {
     *         baseUrl: "http://192.168.1.100/map/tiles/{z}/{x}/{y}",
     *         imageSuffix: ".jpg"
     *     }
     * });
     */
    async createInstance(param) {
        let layer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasTemplateTerrainImageLayer',
            'createInstance',
            { param: param },
            function (json) {
                layer = new DasTemplateTerrainImageLayer()
                layer.readObjectInfo(json.object)
            }
        )

        return layer
    }

    /**
     * 批量创建多个DasTemplateTerrainImageLayer实例
     * @param {Object} param - 参数对象，应包含'params'数组
     * @param {Array<Object>} param.params - 每个图层的配置对象数组
     * @param {string} [param.params[].baseUrl] - 影像瓦片的基础URL模板路径
     * @param {string} [param.params[].imageSuffix] - 图片后缀名（如 ".png", ".jpg", ".webp"）
     * @returns {Promise<Array<DasTemplateTerrainImageLayer>>} - 创建的图层对象数组
     *
     * @example
     * // 批量创建多个影像图层
     * const layers = await DasTemplateTerrainImageLayer.batchCreateInstance({
     *     params: [
     *         { baseUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}", imageSuffix: ".png" },
     *         { baseUrl: "http://192.168.1.100/satellite/{z}/{x}/{y}", imageSuffix: ".jpg" }
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
            'DasTemplateTerrainImageLayer',
            'batchCreateInstance',
            { params: param },
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasTemplateTerrainImageLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }
}
