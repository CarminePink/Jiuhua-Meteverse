import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

/**
 * JavaScript wrapper for the UWebCamera UE component
 * Provides camera control and positioning functions
 */
export default class Camera {
    static className = 'Camera'

    /**
     * 通过名称飞行到指定点位
     * @param {string} positionName - 点位名称
     * @param {number} [duration=5.0] - 飞行时间（秒）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async flyToCameraPositionByName(positionName, duration = 5.0) {
        let result = false
        const param = {
            positionName: positionName,
            duration: duration
        }
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'flyToCameraPositionByName',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取当前相机的经纬度高度和欧拉角
     * @returns {Promise<object>} 包含locationLLH和rotationLLH的对象
     */
    async getCameraFlyInfoLLH() {
        const result = {} as any
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'getCameraFlyInfoLLH',
            param,
            function (json) {
                // 位置数据 [longitude, latitude, height]
                if (json.locationLLH && Array.isArray(json.locationLLH)) {
                    result.locationLLH = json.locationLLH
                }

                // 旋转数据 (对象格式 {pitch, yaw, roll})
                if (json.rotationLLH) {
                    result.rotationLLH = json.rotationLLH
                }
            }
        )
        return result
    }

    /**
     * 飞行到指定的经纬度高度和欧拉角
     * @param {Array} locationLLH - 包含[经度,纬度,高度]的数组
     * @param {object} rotationLLH - 包含pitch、yaw、roll的对象
     * @param {number} [duration=5.0] - 飞行时间（秒）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async flyToLocationLLH(locationLLH, rotationLLH, duration = 5.0) {
        let result = false
        const param = {
            locationLLH: locationLLH,
            rotationLLH: rotationLLH,
            duration: duration
        }
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'flyToLocationLLH',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置飞行时禁止增加高度的标志
     * @param {boolean} forbitAddHeight - 是否禁止增加高度
     * @returns {Promise<boolean>} 操作是否成功
     */
    async forbitAddHeightOnFly(forbitAddHeight) {
        let result = false
        const param = {
            forbitAddHeight: forbitAddHeight
        }
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'forbitAddHeightOnFly',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取飞行时是否禁止增加高度的标志
     * @returns {Promise<boolean>} 是否禁止增加高度
     */
    async isForbitAddHeightOnFly() {
        let forbitAddHeight = false
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'IsForbitAddHeightOnFly',
            param,
            function (json) {
                if (typeof json.forbitAddHeight !== 'undefined') {
                    forbitAddHeight = json.forbitAddHeight
                }
            }
        )
        return forbitAddHeight
    }

    /**
     * 设置是否禁用边界检查
     * @param {boolean} disableBoundCheck - 是否禁用边界检查
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setDisableBoundCheck(disableBoundCheck) {
        let result = false
        let param = {
            disableBoundCheck: disableBoundCheck
        }
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'setDisableBoundCheck',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取是否禁用边界检查
     * @returns {Promise<boolean>} 是否禁用边界检查
     */
    async isDisableBoundCheck() {
        let disableBoundCheck = false
        let param = {}
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'isDisableBoundCheck',
            param,
            function (json) {
                if (json.disableBoundCheck !== undefined) {
                    disableBoundCheck = json.disableBoundCheck
                }
            }
        )
        return disableBoundCheck
    }

    /**
     * 设置Pawn是否启用
     * @param {boolean} enable - 是否启用
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setPawnEnable(enable) {
        let result = false
        let param = { enable: enable }
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'setPawnEnable',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取Pawn是否启用
     * @returns {Promise<boolean>} 是否启用
     */
    async getPawnEnable() {
        let enable = false
        let param = {}
        await ExcuteUEFun.excuteUEFunction(
            Camera.className,
            'getPawnEnable',
            param,
            function (json) {
                if (json.enable !== undefined) {
                    enable = json.enable
                }
            }
        )
        return enable
    }
}
