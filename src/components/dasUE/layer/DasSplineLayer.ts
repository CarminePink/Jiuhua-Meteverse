import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasSpline extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasSplineLayer'
    }

    /**
     * 设置样条点坐标
     * @param {Array<Object>} points - 点坐标数组，每个点包含x、y、z
     */
    async setPoints(points) {
        return await this.excuteUEClassFunction('setPoints', { points: points })
    }

    /**
     * 获取样条点坐标
     * @returns {Promise<Array<Object>>} 点坐标数组
     */
    async getPoints() {
        let points = []
        await this.excuteUEClassFunction('getPoints', {}, function (json) {
            points = json.points
        })
        return points
    }

    /**
     * 设置网格名称
     * @param {string} meshName - 网格名称
     */
    async setMeshName(meshName) {
        return await this.excuteUEClassFunction('setMeshName', { meshName: meshName })
    }

    /**
     * 获取网格名称
     * @returns {Promise<string>} 网格名称
     */
    async getMeshName() {
        let meshName = ''
        await this.excuteUEClassFunction('getMeshName', {}, function (json) {
            meshName = json.meshName
        })
        return meshName
    }

    /**
     * 设置线宽（厘米）
     * @param {number} lineWidth - 线宽值（厘米）
     */
    async setLineWidth(lineWidth) {
        return await this.excuteUEClassFunction('setLineWidth', { lineWidth: lineWidth })
    }

    /**
     * 获取线宽（厘米）
     * @returns {Promise<number>} 线宽值（厘米）
     */
    async getLineWidth() {
        let lineWidth = 50.0
        await this.excuteUEClassFunction('getLineWidth', {}, function (json) {
            lineWidth = json.lineWidth
        })
        return lineWidth
    }

    /**
     * 获取所有参数
     * @returns {Promise<Object>} 包含所有参数的对象
     */
    async getAll() {
        let allParams = {}
        await this.excuteUEClassFunction('getAll', {}, function (json) {
            allParams = {
                points: json.points,
                meshName: json.meshName,
                lineWidth: json.lineWidth
            }
        })
        return allParams
    }

    /**
     * 更新所有参数
     * @param {Object} params - 更新参数
     * @param {Array<Object>} [params.points] - 点坐标数组
     * @param {string} [params.meshName] - 网格名称
     * @param {number} [params.lineWidth] - 线宽（厘米）
     */
    async updateAll(params) {
        return await this.excuteUEClassFunction('updateAll', params)
    }

    /**
     * 创建样条图层
     * @param {Object} param - 创建参数
     * @param {Object} [param.param] - 初始配置参数
     * @param {Array<Object>} [param.param.points] - 初始点坐标数组
     * @param {string} [param.param.meshName] - 初始网格名称
     * @param {number} [param.param.lineWidth] - 初始线宽（厘米）
     * @returns {Promise<DasSpline>} 创建的样条图层实例
     */
    async createInstance(param) {
        let spline = null
        await ExcuteUEFun.excuteUEFunction(
            'DasSplineLayer',
            'createInstance',
            param,
            function (json) {
                spline = new DasSpline()
                spline.readObjectInfo(json.object)
            }
        )

        return spline
    }
}
