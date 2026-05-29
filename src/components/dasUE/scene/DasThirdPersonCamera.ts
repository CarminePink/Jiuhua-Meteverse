import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

/**
 * JavaScript wrapper for the UWebThirdPersonCamera UE component
 * Provides third person pawn control functions
 */
export default class ThirdPersonCamera {
    static className = 'ThirdPersonCamera'

    /**
     * 设置第三人称操作器的移动速度
     * @param {number} moveSpeed - 移动速度值
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setMoveSpeed(moveSpeed: number) {
        let result = false
        const param = {
            moveSpeed: moveSpeed
        }
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setMoveSpeed',
            param,
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取第三人称操作器的移动速度
     * @returns {Promise<number>} 当前移动速度值
     */
    async getMoveSpeed() {
        let result = 1.0
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'getMoveSpeed',
            param,
            function (json: any) {
                if (json.moveSpeed !== undefined) {
                    result = json.moveSpeed
                }
            }
        )
        return result
    }

    /**
     * 设置脚部骨骼网格体部件
     * @param {string} feetName - 部件名称
     * @returns {Promise<boolean>}
     */
    async setFeet(feetName: string) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setFeet',
            { feetName: feetName },
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置头发骨骼网格体部件
     * @param {string} hairName - 部件名称
     * @returns {Promise<boolean>}
     */
    async setHair(hairName: string) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setHair',
            { hairName: hairName },
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置左手骨骼网格体部件
     * @param {string} handLName - 部件名称
     * @returns {Promise<boolean>}
     */
    async setHandL(handLName: string) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setHandL',
            { handLName: handLName },
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置右手骨骼网格体部件
     * @param {string} handRName - 部件名称
     * @returns {Promise<boolean>}
     */
    async setHandR(handRName: string) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setHandR',
            { handRName: handRName },
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置下身骨骼网格体部件
     * @param {string} bottomBodyName - 部件名称
     * @returns {Promise<boolean>}
     */
    async setBottomBody(bottomBodyName: string) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setBottomBody',
            { bottomBodyName: bottomBodyName },
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置上身骨骼网格体部件
     * @param {string} upperBodyName - 部件名称
     * @returns {Promise<boolean>}
     */
    async setUpperBody(upperBodyName: string) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setUpperBody',
            { upperBodyName: upperBodyName },
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置面具骨骼网格体部件
     * @param {string} maskName - 部件名称
     * @returns {Promise<boolean>}
     */
    async setMask(maskName: string) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'setMask',
            { maskName: maskName },
            function (json: any) {
                result = true
            }
        )
        return result
    }

    /**
     * 一次性更新所有换装部件
     * @param {object} param - 包含各部件名称的对象，所有字段可选
     * @param {string} [param.feetName] - 脚部部件名称
     * @param {string} [param.hairName] - 头发部件名称
     * @param {string} [param.handLName] - 左手部件名称
     * @param {string} [param.handRName] - 右手部件名称
     * @param {string} [param.bottomBodyName] - 下身部件名称
     * @param {string} [param.upperBodyName] - 上身部件名称
     * @param {string} [param.maskName] - 面具部件名称
     * @returns {Promise<boolean>}
     */
    async updateAll(param: {
        feetName?: string
        hairName?: string
        handLName?: string
        handRName?: string
        bottomBodyName?: string
        upperBodyName?: string
        maskName?: string
    }) {
        let result = false
        await ExcuteUEFun.excuteUEFunction(
            ThirdPersonCamera.className,
            'updateAll',
            param,
            function (json: any) {
                result = true
            }
        )
        return result
    }
}
