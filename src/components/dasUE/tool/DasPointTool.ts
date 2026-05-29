import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import ToolBase from '@/components/dasUE/tool/DasBaseTool'

export default class DasPointsTool extends ToolBase {
    static className = 'DasPointsTool' // Corresponds to the UE class name
    /**
     * Sets the DasPointsTool as the current active tool
     */
    async setToCurrent() {
        const param = {}
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'setToCurrent', param)
    }

    /**
     * Sets the point position
     * @param {object} param - Parameters including position data
     */
    async setPointPosition(param) {
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'setPointPosition', param)
    }

    /**
     * Gets the point position
     * @param {function} callback - Callback to handle the returned position
     */
    async getPointPosition() {
        let result = {}
        await ExcuteUEFun.excuteUEFunction(
            DasPointsTool.className,
            'getPointPosition',
            {},
            json => {
                result = json.posLLH
            }
        )
        return result
    }

    /**
     * Sets the point texture
     * @param {object} param - Parameters including texture path
     */
    async setPointTexture(param) {
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'setPointTexture', param)
    }

    /**
     * Gets the point texture
     * @param {function} callback - Callback to handle the returned texture
     */
    async getPointTexture() {
        let result = ''
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'getPointTexture', {}, json => {
            result = json.texturePath
        })
        return result
    }

    /**
     * Sets the point size
     * @param {object} param - Parameters including size data
     */
    async setPointSize(param) {
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'setPointSize', param)
    }

    /**
     * Gets the point size
     * @param {function} callback - Callback to handle the returned size
     */
    async getPointSize() {
        let result = {}
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'getPointSize', {}, json => {
            result = json.pointSize
        })
        return result
    }

    /**
     * Sets the depth test setting
     * @param {boolean} enableDepthTest - Whether to enable depth testing
     */
    static async setDepthTest(enableDepthTest) {
        const param = { enableDepthTest: enableDepthTest }
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'setDepthTest', param)
    }

    /**
     * Gets the depth test setting
     * @returns {Promise<boolean>} Whether depth testing is enabled
     */
    static async getDepthTest() {
        let enabled = true // Default value
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'getDepthTest', {}, json => {
            enabled = json.enableDepthTest
        })
        return enabled
    }

    /**
     * Updates all point properties in one call.
     * @param {object} param - An object containing the properties to update (e.g., { posLLH: [x, y, z], texturePath: "path", pointSize: [w, h], enableDepthTest: true }).
     */
    async updateAll(param) {
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'updateAll', param)
    }

    /**
     * Gets all point properties in one call.
     * @returns {Promise<object>} A promise that resolves with an object containing all point properties (e.g., { posLLH: [x, y, z], texturePath: "path", pointSize: [w, h], enableDepthTest: true }).
     */
    async getAll() {
        let result = {}
        await ExcuteUEFun.excuteUEFunction(DasPointsTool.className, 'getAll', {}, json => {
            // 假设 cpp 的 getAll 方法将所有属性直接放在返回的 JSON 对象中
            result = json
        })
        return result
    }
}
