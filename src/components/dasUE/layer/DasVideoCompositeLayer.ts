import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasVideoCompositeLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasVideoCompositeLayer'
    }

    /**
     * 设置Actor的Transform
     * @param {Object} transform - Transform对象，包含translation、rotation、scale3D
     */
    async setActorTransform(transform) {
        return await this.excuteUEClassFunction('setActorTransform', { transform: transform })
    }

    /**
     * 获取Actor的Transform
     * @returns {Promise<Object>} Transform对象
     */
    async getActorTransform() {
        let transform = {}
        await this.excuteUEClassFunction('getActorTransform', {}, function (json) {
            transform = json.transform
        })
        return transform
    }

    /**
     * 开始视频捕获
     */
    async startVideoCapture() {
        return await this.excuteUEClassFunction('startVideoCapture', {})
    }

    /**
     * 停止视频捕获
     */
    async stopVideoCapture() {
        return await this.excuteUEClassFunction('stopVideoCapture', {})
    }

    /**
     * 聚焦到此相机
     */
    async focusToThis() {
        return await this.excuteUEClassFunction('focusToThis', {})
    }

    /**
     * 设置视椎体组件可见性
     * @param {boolean} visible - 是否可见
     */
    async setFrustumComponentVisible(visible) {
        return await this.excuteUEClassFunction('setFrustumComponentVisible', { visible: visible })
    }

    /**
     * 设置视频URL
     * @param {string} videoUrl - 视频URL
     */
    async setVideoUrl(videoUrl) {
        return await this.excuteUEClassFunction('setVideoUrl', { videoUrl: videoUrl })
    }

    /**
     * 设置视场角
     * @param {number} fov - 视场角（度）
     */
    async setFOV(fov) {
        return await this.excuteUEClassFunction('setFOV', { fov: fov })
    }

    /**
     * 设置近裁剪面
     * @param {number} nearClipPlane - 近裁剪面距离
     */
    async setNearClipPlane(nearClipPlane) {
        return await this.excuteUEClassFunction('setNearClipPlane', {
            nearClipPlane: nearClipPlane
        })
    }

    /**
     * 设置远裁剪面
     * @param {number} farClipPlane - 远裁剪面距离
     */
    async setFarClipPlane(farClipPlane) {
        return await this.excuteUEClassFunction('setFarClipPlane', { farClipPlane: farClipPlane })
    }

    /**
     * 设置宽高比
     * @param {number} aspectRatio - 宽高比
     */
    async setAspectRatio(aspectRatio) {
        return await this.excuteUEClassFunction('setAspectRatio', { aspectRatio: aspectRatio })
    }

    /**
     * 获取所有参数
     * @returns {Promise<Object>} 包含所有参数的对象
     */
    async getAll() {
        let allParams = {}
        await this.excuteUEClassFunction('getAll', {}, function (json) {
            allParams = {
                transform: json.transform,
                fov: json.fov,
                nearClipPlane: json.nearClipPlane,
                farClipPlane: json.farClipPlane,
                aspectRatio: json.aspectRatio,
                frustumVisible: json.frustumVisible,
                videoUrl: json.videoUrl
            }
        })
        return allParams
    }

    /**
     * 更新所有参数
     * @param {Object} params - 更新参数
     * @param {Object} [params.transform] - Transform对象
     * @param {string} [params.videoUrl] - 视频URL
     * @param {number} [params.fov] - 视场角（度）
     * @param {number} [params.nearClipPlane] - 近裁剪面距离
     * @param {number} [params.farClipPlane] - 远裁剪面距离
     * @param {number} [params.aspectRatio] - 宽高比
     * @param {boolean} [params.visible] - 视椎体组件可见性
     */
    async updateAll(params) {
        return await this.excuteUEClassFunction('updateAll', params)
    }

    /**
     * 创建视频合成图层
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 初始配置参数
     * @param {Object} [param.param.transform] - 初始Transform
     * @param {string} [param.param.videoUrl] - 视频URL
     * @param {number} [param.param.fov] - 视场角（度）
     * @param {number} [param.param.nearClipPlane] - 近裁剪面距离
     * @param {number} [param.param.farClipPlane] - 远裁剪面距离
     * @param {number} [param.param.aspectRatio] - 宽高比
     * @param {boolean} [param.param.visible] - 视椎体组件可见性
     * @returns {Promise<DasVideoCompositeLayer>} 创建的视频合成图层实例
     */
    async createInstance(param) {
        let videoCompositeLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasVideoCompositeLayer',
            'createInstance',
            param,
            function (json) {
                videoCompositeLayer = new DasVideoCompositeLayer()
                videoCompositeLayer.readObjectInfo(json.object)
            }
        )

        return videoCompositeLayer
    }
}
