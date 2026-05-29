import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

/**
 * JavaScript wrapper for the UWebDasCameraRouteRoaming UE component
 * Provides camera route roaming control functions based on spline paths
 */
export default class CameraRouteRoaming {
    static className = 'CameraRouteRoaming'

    /**
     * 设置路径顶点（经纬高坐标系）
     * @param {Array<Array<number>>} pointsLLH - 路径点数组，每个点为[经度, 纬度, 高度]
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setRoutePointsLLH(pointsLLH) {
        let result = false
        const param = {
            pointsLLH: pointsLLH
        }
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'SetRoutePointsLLH',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 开始漫游
     * @returns {Promise<boolean>} 操作是否成功
     */
    async startRoaming() {
        let result = false
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'StartRoaming',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 停止漫游
     * @returns {Promise<boolean>} 操作是否成功
     */
    async stopRoaming() {
        let result = false
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'StopRoaming',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 暂停漫游
     * @returns {Promise<boolean>} 操作是否成功
     */
    async pauseRoaming() {
        let result = false
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'PauseRoaming',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 恢复漫游
     * @returns {Promise<boolean>} 操作是否成功
     */
    async resumeRoaming() {
        let result = false
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'ResumeRoaming',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置漫游总时间
     * @param {number} totalTime - 总时间（秒）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setTotalRoamingTime(totalTime) {
        let result = false
        const param = {
            totalTime: totalTime
        }
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'SetTotalRoamingTime',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置相机俯仰角
     * @param {number} pitch - 俯仰角（度，-90到90，0为平视，正值为俯视，负值为仰视）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setCameraPitch(pitch) {
        let result = false
        const param = {
            pitch: pitch
        }
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'SetCameraPitch',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置相机高度偏移
     * @param {number} heightOffset - 高度偏移（米）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setCameraHeightOffset(heightOffset) {
        let result = false
        const param = {
            heightOffset: heightOffset
        }
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'SetCameraHeightOffset',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置是否循环漫游
     * @param {boolean} loop - 是否循环
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setLoopRoaming(loop) {
        let result = false
        const param = {
            loop: loop
        }
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'SetLoopRoaming',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取当前漫游状态
     * @returns {Promise<number>} 状态值：0-停止, 1-漫游中, 2-暂停
     */
    async getRoamingState() {
        let state = 0
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'GetRoamingState',
            param,
            function (json) {
                if (typeof json.state !== 'undefined') {
                    state = json.state
                }
            }
        )
        return state
    }

    /**
     * 批量更新所有属性
     * @param {Object} params - 包含所有可选参数的对象
     * @param {Array<Array<number>>} [params.pointsLLH] - 路径点数组
     * @param {number} [params.totalTime] - 总时间（秒）
     * @param {number} [params.pitch] - 俯仰角（度）
     * @param {number} [params.heightOffset] - 高度偏移（米）
     * @param {boolean} [params.loop] - 是否循环
     * @returns {Promise<boolean>} 操作是否成功
     */
    async updateAll(params) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'UpdateAll',
            params,
            function () {
                result = true
            }
        )
        return result
    }

    /**
     * 获取所有属性
     * @returns {Promise<Object>} 包含所有当前属性值的对象
     */
    async getAll() {
        let result = {}
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            CameraRouteRoaming.className,
            'GetAll',
            param,
            function (json) {
                result = json
            }
        )
        return result
    }
}
