import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import ToolBase from '@/components/dasUE/tool/DasBaseTool'

/**
 * JavaScript wrapper for the DasPolylineTool UE component
 * Provides functionality for managing polylines in the Unreal Engine environment
 */
export default class DasPolylineTool extends ToolBase {
    static className = 'DasPolylineTool' // Corresponds to the UE class name

    /**
     * Sets the DasPolylineTool as the current active tool
     */
    async setToCurrent() {
        const param = {}
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'setToCurrent', param)
    }

    /**
     * Sets the line color
     * @param {Array<number>} color - Color as [r, g, b, a] where each value is 0-1
     */
    async setLineColor(color) {
        const param = { color: color }
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'setLineColor', param)
    }

    /**
     * Gets the line color
     * @returns {Promise<Array<number>>} - Color as [r, g, b, a]
     */
    async getLineColor() {
        let result = [1, 1, 1, 1] // Default white
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'getLineColor', {}, json => {
            result = json.color
        })
        return result
    }

    /**
     * Sets the line thickness
     * @param {number} thickness - Line thickness
     * @param {boolean} [screenSpace=true] - Whether thickness is screen space fixed
     */
    async setLineThickness(thickness, screenSpace = true) {
        const param = { thickness: thickness, screenSpace: screenSpace }
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'setLineThickness', param)
    }

    /**
     * Gets the line thickness
     * @returns {Promise<number>} - Line thickness
     */
    async getLineThickness() {
        let result = 1.0
        await ExcuteUEFun.excuteUEFunction(
            DasPolylineTool.className,
            'getLineThickness',
            {},
            json => {
                result = json.thickness
            }
        )
        return result
    }

    /**
     * Sets the depth test setting
     * @param {boolean} enableDepthTest - Whether to enable depth testing
     */
    async setDepthTest(enableDepthTest) {
        const param = { enableDepthTest: enableDepthTest }
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'setDepthTest', param)
    }

    /**
     * Gets the depth test setting
     * @returns {Promise<boolean>} - Whether depth testing is enabled
     */
    async getDepthTest() {
        let enabled = true // Default value
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'getDepthTest', {}, json => {
            enabled = json.enableDepthTest
        })
        return enabled
    }

    /**
     * Sets the line visibility
     * @param {boolean} visible - Whether the line should be visible
     */
    async setLineVisible(visible) {
        const param = { visible: visible }
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'setLineVisible', param)
    }

    /**
     * Gets the line visibility
     * @returns {Promise<boolean>} - Whether the line is visible
     */
    async getLineVisible() {
        let visible = true // Default value
        await ExcuteUEFun.excuteUEFunction(
            DasPolylineTool.className,
            'getLineVisible',
            {},
            json => {
                visible = json.visible
            }
        )
        return visible
    }

    /**
     * Sets spline interpolation settings
     * @param {Object} splineConfig - Spline configuration
     * @param {boolean} [splineConfig.enableSpline] - Whether to enable spline interpolation
     * @param {number} [splineConfig.interpolateCount] - Number of interpolation points
     */
    async setSplinePoint(splineConfig) {
        await ExcuteUEFun.excuteUEFunction(
            DasPolylineTool.className,
            'setSplinePoint',
            splineConfig
        )
    }

    /**
     * Gets spline interpolation settings
     * @returns {Promise<Object>} - Object containing enableSpline and interpolateCount
     */
    async getSplinePoint() {
        const result = { enableSpline: false, interpolateCount: 10 }
        await ExcuteUEFun.excuteUEFunction(
            DasPolylineTool.className,
            'getSplinePoint',
            {},
            json => {
                result.enableSpline = json.enableSpline
                result.interpolateCount = json.interpolateCount
            }
        )
        return result
    }

    /**
     * Checks if the tool has any points
     * @returns {Promise<boolean>} - Whether points exist
     */
    async hasPoints() {
        let hasPoints = false
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'hasPoints', {}, json => {
            hasPoints = json.hasPoints
        })
        return hasPoints
    }

    /**
     * Updates all polyline properties in one call.
     * @param {Object} param - An object containing the properties to update
     * @param {Array<number>} [param.color] - Color as [r, g, b, a] where each value is 0-1
     * @param {number} [param.thickness] - Line thickness
     * @param {boolean} [param.screenSpace] - Whether thickness is screen space fixed
     * @param {boolean} [param.enableDepthTest] - Whether to enable depth testing
     * @param {boolean} [param.visible] - Whether the line should be visible
     * @param {boolean} [param.enableSpline] - Whether to enable spline interpolation
     * @param {number} [param.interpolateCount] - Number of interpolation points
     */
    async updateAll(param) {
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'updateAll', param)
    }

    /**
     * Gets all polyline properties in one call.
     * @returns {Promise<Object>} - Object containing all polyline properties
     */
    async getAll() {
        let result = {}
        await ExcuteUEFun.excuteUEFunction(DasPolylineTool.className, 'getAll', {}, json => {
            result = json
        })
        return result
    }
}
