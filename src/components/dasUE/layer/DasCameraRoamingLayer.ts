import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasCameraRoamingLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasCameraRoamingLayer'
    }

    /**
     * 添加当前相机位置
     */
    async addCurrentCameraPosition() {
        return await this.excuteUEClassFunction('addCurrentCameraPosition', {})
    }

    /**
     * 更新指定索引的相机位置
     * @param {number} index
     */
    async updateCameraPositionWithIndex(index) {
        return await this.excuteUEClassFunction('updateCameraPositionWithIndex', { index: index })
    }

    /**
     * 更新指定索引的飞行时间
     * @param {number} index
     * @param {number} duration
     */
    async updateCameraFlyDurationWithIndex(index, duration) {
        return await this.excuteUEClassFunction('updateCameraFlyDurationWithIndex', {
            index: index,
            duration: duration
        })
    }

    /**
     * 删除指定索引的相机位置
     * @param {number} index
     */
    async removeCameraPositionWithIndex(index) {
        return await this.excuteUEClassFunction('removeCameraPositionWithIndex', { index: index })
    }

    /**
     * 清除所有相机位置
     */
    async clearCameraPosition() {
        return await this.excuteUEClassFunction('clearCameraPosition', {})
    }

    /**
     * 飞到指定索引的相机位置
     * @param {number} index
     */
    async flyToCameraPositionWithIndex(index) {
        return await this.excuteUEClassFunction('flyToCameraPositionWithIndex', { index: index })
    }

    /**
     * 开始全部飞行
     */
    async startFlightAll() {
        return await this.excuteUEClassFunction('startFlightAll', {})
    }

    /**
     * 停止全部飞行
     */
    async stopFlightAll() {
        return await this.excuteUEClassFunction('stopFlightAll', {})
    }

    /**
     * 获取所有点的信息
     * @returns {Promise<Array<Object>>} 包含相机点位信息的数组
     */
    async getAllPositionInfo() {
        let positions = []
        await this.excuteUEClassFunction('getAllPositionInfo', {}, function (json) {
            if (json && json.positions) {
                positions = json.positions
            }
        })
        return positions
    }

    /**
     * 设置相机点位
     * @param {Array<Object>} positions 相机点位数组，每个点位包含name, llh, rotation, duration属性
     * @returns {Promise<boolean>} 是否设置成功
     */
    async setCameraPositions(positions) {
        return await this.excuteUEClassFunction('setCameraPositions', { positions: positions })
    }

    /**
     * 创建相机漫游层
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 初始配置参数
     * @param {Array<Object>} [param.param.positions] - 相机点位数组
     * @returns {Promise<DasCameraRoamingLayer>} 创建的相机漫游层实例
     */
    async createInstance(param) {
        let cameraRoaming = null
        await ExcuteUEFun.excuteUEFunction(
            'DasCameraRoamingLayer',
            'createInstance',
            { param },
            function (json) {
                cameraRoaming = new DasCameraRoamingLayer()
                cameraRoaming.readObjectInfo(json.object)
            }
        )

        return cameraRoaming
    }
}
