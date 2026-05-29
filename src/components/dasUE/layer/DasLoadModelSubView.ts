import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasLoadModelSubView extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasLoadModelSubView'
    }

    /**
     * 设置渲染纹理大小
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    async setTextureSize(width, height) {
        return await this.excuteUEClassFunction('SetTextureSize', {
            width: width,
            height: height
        })
    }

    /**
     * 设置纹理偏移
     * @param {number} offsetX - X轴偏移
     * @param {number} offsetY - Y轴偏移
     */
    async setTextureOffset(offsetX, offsetY) {
        return await this.excuteUEClassFunction('SetTextureOffset', {
            offsetX: offsetX,
            offsetY: offsetY
        })
    }

    /**
     * 设置旋转参数
     * @param {number} rotaionRadiusScale - 旋转半径缩放
     * @param {number} rotationTime - 旋转时间
     * @param {number} rotationPitch - 相机俯仰角
     */
    async setRotationParams(rotaionRadiusScale, rotationTime, rotationPitch) {
        return await this.excuteUEClassFunction('SetRotationParams', {
            RotaionRadiusScale: rotaionRadiusScale,
            RotationTime: rotationTime,
            RotationPitch: rotationPitch
        })
    }

    /**
     * 开始捕获
     */
    async beginCapture() {
        return await this.excuteUEClassFunction('BeginCapture', {})
    }

    /**
     * 停止捕获
     */
    async stopCapture() {
        return await this.excuteUEClassFunction('StopCapture', {})
    }

    /**
     * 异步加载模型
     * @param {string} modelName - 模型名称
     */
    async loadModelAsync(modelName) {
        return await this.excuteUEClassFunction('LoadModelAsync', {
            modelName: modelName
        })
    }

    /**
     * 销毁所有模型
     */
    async destroyModels() {
        return await this.excuteUEClassFunction('DestroyModels', {})
    }

    /**
     * 开始炸开动画
     * @param {number} [explodeAnimTime] - 炸开动画时长（可选）
     */
    async startExplode(explodeAnimTime) {
        const params: any = {}
        if (explodeAnimTime) {
            params.explodeAnimTime = explodeAnimTime
        }
        return await this.excuteUEClassFunction('StartExplode', params)
    }

    /**
     * 获取所有参数
     * @returns {Promise<Object>} 包含所有参数的对象
     */
    async getAll() {
        let allParams = {}
        await this.excuteUEClassFunction('GetAll', {}, function (json) {
            allParams = {
                actorCount: json.actorCount,
                explodeAnimTime: json.explodeAnimTime,
                RotaionRadiusScale: json.RotaionRadiusScale,
                RotationTime: json.RotationTime
            }
        })
        return allParams
    }

    /**
     * 更新所有参数
     * @param {Object} params - 更新参数
     * @param {number} [params.explodeAnimTime] - 炸开动画时长
     * @param {number} [params.RotaionRadiusScale] - 旋转半径缩放
     * @param {number} [params.RotationTime] - 旋转时间
     * @param {number} [params.RotationPitch] - 相机俯仰角
     * @param {number} [params.width] - 视口宽度
     * @param {number} [params.height] - 视口高度
     * @param {number} [params.offsetX] - X轴偏移
     * @param {number} [params.offsetY] - Y轴偏移
     */
    async updateAll(params) {
        return await this.excuteUEClassFunction('UpdateAll', params)
    }

    /**
     * 设置炸开动画时长
     * @param {number} animTime - 动画时长（秒）
     */
    async setExplodeAnimTime(animTime) {
        return await this.updateAll({ explodeAnimTime: animTime })
    }

    /**
     * 设置旋转半径缩放
     * @param {number} scale - 半径缩放倍数
     */
    async setRotationRadiusScale(scale) {
        return await this.updateAll({ RotaionRadiusScale: scale })
    }

    /**
     * 设置相机俯仰角
     * @param {number} pitch - 相机俯仰角
     */
    async setRotationPitch(pitch) {
        return await this.updateAll({ RotationPitch: pitch })
    }

    /**
     * 设置旋转时间
     * @param {number} time - 旋转时间
     */
    async setRotationTime(time) {
        return await this.updateAll({ RotationTime: time })
    }

    /**
     * 设置视口参数
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @param {number} [offsetX] - X轴偏移
     * @param {number} [offsetY] - Y轴偏移
     */
    async setViewportParams(width, height, offsetX, offsetY) {
        const params: any = { width: width, height: height }
        if (offsetX) params.offsetX = offsetX
        if (offsetY) params.offsetY = offsetY
        return await this.updateAll(params)
    }

    /**
     * 创建模型加载器图层
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 初始配置参数
     * @param {number} [param.param.explodeAnimTime] - 初始炸开动画时长
     * @param {number} [param.param.RotaionRadiusScale] - 初始旋转半径缩放
     * @param {number} [param.param.RotationTime] - 初始旋转时间
     * @param {number} [param.param.width] - 初始视口宽度
     * @param {number} [param.param.height] - 初始视口高度
     * @param {number} [param.param.offsetX] - 初始X轴偏移
     * @param {number} [param.param.offsetY] - 初始Y轴偏移
     * @returns {Promise<DasLoadModelSubView>} 创建的模型加载器图层实例
     */
    async createInstance(param) {
        let loadModelSubView = null
        await ExcuteUEFun.excuteUEFunction(
            'DasLoadModelSubView',
            'createInstance',
            { param },
            function (json) {
                loadModelSubView = new DasLoadModelSubView()
                loadModelSubView.readObjectInfo(json.object)
            }
        )

        return loadModelSubView
    }
}
