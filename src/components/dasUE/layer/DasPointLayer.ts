import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'
import DasUIBillboardLayer from '@/components/dasUE/layer/DasUIBillboardLayer'

export default class DasPointsLayer extends DasBaseLayer {
    public popupLayer
    constructor() {
        super()
        this.id = ''
        this.className = 'DasPointsLayer'
        this.popupLayer = null
    }

    /**
     * Set points using LLH (Longitude, Latitude, Height) coordinates
     * @param {Array} points - Array of [longitude, latitude, height] arrays
     * @returns {Promise<boolean>} - Success result
     */
    setPointsLLH = async points => {
        const param = { points: points }
        return await this.excuteUEClassFunction('setPointsLLH', param)
    }

    /**
     * Get points in LLH (Longitude, Latitude, Height) format
     * @returns {Promise<Array>} - Array of [longitude, latitude, height] arrays
     */
    getPointsLLH = async () => {
        let points = []
        await this.excuteUEClassFunction('getPointsLLH', {}, function (json) {
            points = json.points
        })
        return points
    }

    /**
     * Set texture for the points
     * @param {string} texturePath - Path to the texture
     * @returns {Promise<boolean>} - Success result
     */
    setTexture = async texturePath => {
        const param = { texturePath: texturePath }
        return await this.excuteUEClassFunction('setTexture', param)
    }

    /**
     * Set point appearance info (color, size, offset)
     * @param {Object} pointInfo - Point appearance configuration with any of these properties directly in the object:
     * @param {Array<number>} [pointInfo.color] - Color as [r, g, b, a] where each value is 0-1
     * @param {Array<number>} [pointInfo.pointSize] - Size as [width, height]
     * @param {Array<number>} [pointInfo.offset] - Offset as [x, y]
     * @returns {Promise<boolean>} - Success result
     */
    setPointInfo = async pointInfo => {
        const param = { pointInfo: pointInfo }
        return await this.excuteUEClassFunction('setPointInfo', param)
    }

    /**
     * Enable or disable depth testing for points
     * @param {boolean} enableDepthTest - Whether to enable depth testing
     * @returns {Promise<boolean>} - Success result
     */
    setDepthTest = async enableDepthTest => {
        const param = { enableDepthTest: enableDepthTest }
        return await this.excuteUEClassFunction('setDepthTest', param)
    }

    /**
     * Set mask material usage for points
     * @param {boolean} useMask - Whether to use mask material
     * @returns {Promise<boolean>} - Success result
     */
    setUseMaskTextureMaterial = async useMask => {
        const param = { useMaskTexture: useMask }
        return await this.excuteUEClassFunction('setUseMaskTextureMaterial', param)
    }

    /**
     * Get current mask material state
     * @returns {Promise<boolean>} - Current mask material state
     */
    isUseMaskTextureMaterial = async () => {
        let useMask = false
        await this.excuteUEClassFunction('isUseMaskTextureMaterial', {}, function (json) {
            useMask = json.useMaskTexture
        })
        return useMask
    }

    /**
     * Set auto scale for points
     * @param {boolean} autoScale - Whether to enable auto scale
     * @returns {Promise<boolean>} - Success result
     */
    setAutoScale = async autoScale => {
        const param = { autoScale: autoScale }
        return await this.excuteUEClassFunction('setAutoScale', param)
    }

    /**
     * Get current auto scale state
     * @returns {Promise<boolean>} - Current auto scale state
     */
    isAutoScale = async () => {
        let autoScale = false
        await this.excuteUEClassFunction('isAutoScale', {}, function (json) {
            autoScale = json.autoScale
        })
        return autoScale
    }

    /**
     * Set spread for points
     * @param {boolean} isSpread - Whether to enable spread
     * @returns {Promise<boolean>} - Success result
     */
    setSpread = async isSpread => {
        const param = { IsSpread: isSpread }
        return await this.excuteUEClassFunction('setSpread', param)
    }

    /**
     * Get current spread state
     * @returns {Promise<boolean>} - Current spread state
     */
    isSpread = async () => {
        let isSpread = false
        await this.excuteUEClassFunction('isSpread', {}, function (json) {
            isSpread = json.IsSpread
        })
        return isSpread
    }

    /**
     * Enable or disable screen collision for points
     * @param {boolean} enableScreenCollision - Whether to enable screen collision
     * @returns {Promise<boolean>} - Success result
     */
    setEnableScreenCollision = async enableScreenCollision => {
        const param = { enableScreenCollision: enableScreenCollision }
        return await this.excuteUEClassFunction('setEnableScreenCollision', param)
    }

    /**
     * Get current screen collision state
     * @returns {Promise<boolean>} - Current screen collision state
     */
    isEnableScreenCollision = async () => {
        let enableScreenCollision = false
        await this.excuteUEClassFunction('isEnableScreenCollision', {}, function (json) {
            enableScreenCollision = json.enableScreenCollision
        })
        return enableScreenCollision
    }

    /**
     * Get all current settings
     * @returns {Promise<Object>} - Object containing all current settings
     */
    getAll = async () => {
        let allSettings = {}
        await this.excuteUEClassFunction('getAll', {}, function (json) {
            allSettings = {
                points: json.points || [],
                autoScale: json.autoScale || false,
                isSpread: json.IsSpread || false,
                useMask: json.useMask || false,
                enableScreenCollision: json.enableScreenCollision || false
            }
        })
        return allSettings
    }

    /**
     * Update all properties at once
     * @param {Object} config - Combined configuration object with any of these properties:
     * @param {Array} [config.points] - Array of [longitude, latitude, height] arrays
     * @param {string} [config.texturePath] - Path to the texture
     * @param {Array<number>} [config.color] - Color as [r, g, b, a] where each value is 0-1
     * @param {Array<number>} [config.pointSize] - Size as [width, height]
     * @param {boolean} [config.useMask] - Whether to use mask material
     * @param {Array<number>} [config.offset] - Offset as [x, y]
     * @param {boolean} [config.enableDepthTest] - Whether to enable depth testing
     * @param {boolean} [config.autoScale] - Whether to enable auto scale
     * @param {boolean} [config.IsSpread] - Whether to enable spread
     * @param {boolean} [config.enableScreenCollision] - Whether to enable screen collision
     * @returns {Promise<boolean>} - Success result
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * Create a new points layer instance
     * @param {Object} param - Creation parameters
     * @param {Array} [param.points] - Array of [longitude, latitude, height] arrays
     * @param {string} [param.texturePath] - Path to the texture
     * @param {Array<number>} [param.color] - Color as [r, g, b, a] where each value is 0-1
     * @param {Array<number>} [param.pointSize] - Size as [width, height]
     * @param {Array<number>} [param.offset] - Offset as [x, y]
     * @param {boolean} [param.param.autoScale] - Whether to enable auto scale
     * @param {boolean} [param.param.IsSpread] - Whether to enable spread
     * @param {boolean} [param.enableDepthTest] - Whether to enable depth testing
     * @returns {Promise<DasPointsLayer>} - New points layer instance
     */
    async createInstance(param) {
        let pointsLayer = null
        await ExcuteUEFun.excuteUEFunction(
            this.className,
            'createInstance',
            { param: param },
            function (json) {
                pointsLayer = new DasPointsLayer()
                pointsLayer.readObjectInfo(json.object)
            }
        )
        return pointsLayer
    }

    /**
     * Batch create multiple DasPointsLayer instances.
     * @param {Array} params - Array of creation parameters, each parameter is the same as the createInstance method.
     * @returns {Promise<Array>} - Array of created layer objects.
     */
    async batchCreateInstance(params) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            this.className,
            'batchCreateInstance',
            { params: params },
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasPointsLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }

    /**
     * 同时创建点位 + 弹窗，弹窗对象存在 popupLayer 中
     * @param params
     * @param {Array} [params.dataPoints] - 点位配置数组
     * @param {Array} [params.dataPopups] - 弹窗配置数组
     * @param {Function} [params.onMessage] - 弹窗内点击事件
     * @returns {Promise<Array>} - Array of created layer objects.
     */
    async batchCreateInstanceWithPopup(params) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            this.className,
            'batchCreateInstance',
            { params: params.dataPoints },
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasPointsLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        Promise.all(
            params.dataPopups.map(item => {
                return new DasUIBillboardLayer().createInstanceWithListener({
                    ...item,
                    onMessage: params.onMessage
                })
            })
        ).then(res => {
            res.forEach((popupLayer, index) => {
                popupLayer.pointId = layers[index].id
                layers[index].popupLayer = popupLayer
            })
        })
        return layers
    }
}
