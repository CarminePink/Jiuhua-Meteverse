import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasPolylineLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasPolylineLayer'
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
     * Set line properties (color, thickness, screen space)
     * @param {Object} lineProperties - Line configuration with any of these properties:
     * @param {Array<number>} [lineProperties.color] - Color as [r, g, b, a] where each value is 0-1
     * @param {number} [lineProperties.thickness] - Line thickness
     * @param {boolean} [lineProperties.fixScreen] - Whether to fix screen
     * @returns {Promise<boolean>} - Success result
     */
    setLineProperties = async lineProperties => {
        return await this.excuteUEClassFunction('setLineProperties', lineProperties)
    }

    /**
     * Enable or disable depth testing for polyline
     * @param {boolean} enableDepthTest - Whether to enable depth testing
     * @returns {Promise<boolean>} - Success result
     */
    setDepthTest = async enableDepthTest => {
        const param = { enableDepthTest: enableDepthTest }
        return await this.excuteUEClassFunction('setDepthTest', param)
    }

    /**
     * Set line color
     * @param {Array<number>} color - Color as [r, g, b, a] where each value is 0-1
     * @returns {Promise<boolean>} - Success result
     */
    setColor = async color => {
        const param = { color: color }
        return await this.excuteUEClassFunction('setColor', param)
    }

    /**
     * Set line thickness
     * @param {number} thickness - Line thickness
     * @returns {Promise<boolean>} - Success result
     */
    setThickness = async thickness => {
        const param = { thickness: thickness }
        return await this.excuteUEClassFunction('setThickness', param)
    }

    /**
     * Set depth offset for polyline
     * @param {number} depthOffset - Depth offset value (0-1)
     * @returns {Promise<boolean>} - Success result
     */
    setDepthOffset = async depthOffset => {
        const param = { depthOffset: depthOffset }
        return await this.excuteUEClassFunction('setDepthOffset', param)
    }

    /**
     * Set halo effect for polyline
     * @param {Object} haloConfig - Halo configuration
     * @param {boolean} [haloConfig.enableHalo] - Whether to enable halo effect
     * @param {number} [haloConfig.haloWidth] - Halo width
     * @param {number} [haloConfig.haloIntensity] - Halo intensity
     * @returns {Promise<boolean>} - Success result
     */
    setHalo = async haloConfig => {
        return await this.excuteUEClassFunction('setHalo', haloConfig)
    }

    /**
     * Set spline interpolation for polyline
     * @param {Object} splineConfig - Spline configuration
     * @param {boolean} [splineConfig.enableSpline] - Whether to enable spline interpolation
     * @param {number} [splineConfig.interpolateCount] - Number of interpolation points
     * @returns {Promise<boolean>} - Success result
     */
    setSplinePoint = async splineConfig => {
        return await this.excuteUEClassFunction('setSplinePoint', splineConfig)
    }

    /**
     * Set line brightness for polyline
     * @param {number} brightness - Brightness value
     * @returns {Promise<boolean>} - Success result
     */
    setBrightness = async brightness => {
        const param = { brightness: brightness }
        return await this.excuteUEClassFunction('setBrightness', param)
    }

    /**
     * Update all properties at once
     * @param {Object} config - Combined configuration object with any of these properties:
     * @param {Array} [config.points] - Array of [longitude, latitude, height] arrays
     * @param {Array<number>} [config.color] - Color as [r, g, b, a] where each value is 0-1
     * @param {number} [config.thickness] - Line thickness
     * @param {boolean} [config.enableDepthTest] - Whether to enable depth testing
     * @param {number} [config.depthOffset] - Depth offset value (0-1)
     * @param {boolean} [config.enableHalo] - Whether to enable halo effect
     * @param {number} [config.haloWidth] - Halo width
     * @param {number} [config.haloIntensity] - Halo intensity
     * @param {boolean} [config.enableSpline] - Whether to enable spline interpolation
     * @param {number} [config.interpolateCount] - Number of interpolation points
     * @param {number} [config.brightness] - Line brightness value
     * @returns {Promise<boolean>} - Success result
     */
    updateAll = async config => {
        return await this.excuteUEClassFunction('updateAll', config)
    }

    /**
     * Create a new polyline layer instance
     * @param {Object} param - Creation parameters
     * @param {Array} [param.points] - Array of [longitude, latitude, height] arrays
     * @param {Array<number>} [param.color] - Color as [r, g, b, a] where each value is 0-1
     * @param {number} [param.thickness] - Line thickness
     * @param {Object} [param.halo] - Halo configuration
     * @param {Object} [param.spline] - Spline configuration
     * @returns {Promise<DasPolylineLayer>} - New polyline layer instance
     */
    async createInstance(param) {
        let polylineLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasPolylineLayer',
            'createInstance',
            { param },
            function (json) {
                polylineLayer = new DasPolylineLayer()
                polylineLayer.readObjectInfo(json.object)
            }
        )

        return polylineLayer
    }

    /**
     * Batch create multiple DasPolylineLayer instances.
     * @param {Object} param - Parameters object, should contain an array under 'params'.
     * @returns {Promise<Array>} - Array of created layer objects.
     */
    async batchCreateInstance(param) {
        let layers = []
        await ExcuteUEFun.excuteUEFunction(
            'DasPolylineLayer',
            'batchCreateInstance',
            { params: param },
            function (json) {
                if (Array.isArray(json.layers)) {
                    layers = json.layers.map(obj => {
                        const layer = new DasPolylineLayer()
                        layer.readObjectInfo(obj)
                        return layer
                    })
                }
            }
        )
        return layers
    }
}
