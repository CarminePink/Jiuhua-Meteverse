import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasCameraRoamingCircleLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasCameraRoamingCircleLayer'
    }

    /**
     * 开始环绕飞行
     */
    async startCircleFlight() {
        return await this.excuteUEClassFunction('startCircleFlight', {})
    }

    /**
     * 停止环绕飞行
     */
    async stopCircleFlight() {
        return await this.excuteUEClassFunction('stopCircleFlight', {})
    }

    /**
     * 设置环绕半径
     * @param {number} radius - 半径（米）
     */
    async setRotationRadius(radius) {
        return await this.excuteUEClassFunction('setRotationRadius', { rotationRadius: radius })
    }

    /**
     * 设置相机俯仰角
     * @param {number} pitch - 俯仰角（度）
     */
    async setCameraPitch(pitch) {
        return await this.excuteUEClassFunction('setCameraPitch', { cameraPitch: pitch })
    }

    /**
     * 设置环绕一圈所需时间
     * @param {number} time - 时间（秒）
     */
    async setFlightTime(time) {
        return await this.excuteUEClassFunction('setFlightTime', { flightTime: time })
    }

    /**
     * 设置是否循环飞行
     * @param {boolean} loop - 是否循环
     */
    async setLoopFlight(loop) {
        return await this.excuteUEClassFunction('setLoopFlight', { loopFlight: loop })
    }

    /**
     * 获取环绕飞行设置
     * @returns {Promise<Object>} 包含环绕飞行设置的对象
     */
    async getCircleFlightSettings() {
        let settings = {}
        await this.excuteUEClassFunction('getCircleFlightSettings', {}, function (json) {
            settings = {
                rotationRadius: json.rotationRadius,
                cameraPitch: json.cameraPitch,
                flightTime: json.flightTime,
                loopFlight: json.loopFlight,
                longitude: json.longitude,
                latitude: json.latitude,
                height: json.height
            }
        })
        return settings
    }

    /**
     * 设置原点经纬度高度
     * @param {number} longitude - 经度
     * @param {number} latitude - 纬度
     * @param {number} height - 高度（米）
     */
    async setOriginLLH(longitude, latitude, height) {
        return await this.excuteUEClassFunction('setOriginLLH', {
            longitude: longitude,
            latitude: latitude,
            height: height
        })
    }

    /**
     * 获取原点经纬度高度
     * @returns {Promise<Object>} 包含经纬度高度的对象
     */
    async getOriginLLH() {
        let originLLH = {}
        await this.excuteUEClassFunction('getOriginLLH', {}, function (json) {
            originLLH = {
                longitude: json.longitude,
                latitude: json.latitude,
                height: json.height
            }
        })
        return originLLH
    }

    /**
     * 更新所有参数
     * @param {Object} params - 更新参数
     */
    async updateAll(params) {
        return await this.excuteUEClassFunction('updateAll', params)
    }

    /**
     * 创建相机环绕飞行层
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 初始配置参数
     * @param {number} [param.param.rotationRadius] - 环绕半径（米）
     * @param {number} [param.param.cameraPitch] - 相机俯仰角（度）
     * @param {number} [param.param.flightTime] - 环绕一圈所需时间（秒）
     * @param {boolean} [param.param.loopFlight] - 是否循环飞行
     * @param {number} [param.param.longitude] - 原点经度
     * @param {number} [param.param.latitude] - 原点纬度
     * @param {number} [param.param.height] - 原点高度（米）
     * @returns {Promise<DasCameraRoamingCircleLayer>} 创建的相机环绕飞行层实例
     */
    async createInstance(param) {
        let cameraRoamingCircle = null
        await ExcuteUEFun.excuteUEFunction(
            'DasCameraRoamingCircleLayer',
            'createInstance',
            { param },
            function (json) {
                cameraRoamingCircle = new DasCameraRoamingCircleLayer()
                cameraRoamingCircle.readObjectInfo(json.object)
            }
        )

        return cameraRoamingCircle
    }
}
