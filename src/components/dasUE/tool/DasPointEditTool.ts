import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasPointTool from './DasPointTool.js'

/**
 * DasPointEditTool JavaScript接口类
 * 继承自DasPointTool，增加图层编辑功能
 */
export default class DasPointEditTool extends DasPointTool {
    static className = 'DasPointEditTool'

    /**
     * 设置编辑图层
     * @param {Object} layer - 要编辑的图层对象
     * @returns {Promise<boolean>} 设置是否成功
     */
    static async editLayer(layer) {
        const param = {
            layer: layer
        }

        try {
            await ExcuteUEFun.excuteUEFunction(DasPointEditTool.className, 'editLayer', param)
            return true
        } catch (error) {
            console.error('设置编辑图层失败:', error)
            return false
        }
    }

    /**
     * 设置当前工具
     * @returns {Promise<boolean>} 设置是否成功
     */
    static async setToCurrent() {
        try {
            await ExcuteUEFun.excuteUEFunction(DasPointEditTool.className, 'setToCurrent', {})
            return true
        } catch (error) {
            console.error('设置当前工具失败:', error)
            return false
        }
    }

    /**
     * 完成当前工具操作
     * @param {function} callback - 操作完成后的回调函数
     */
    static async finishTool(callback?) {
        const param = {}
        await ExcuteUEFun.excuteUEFunction('ToolBase', 'finishTool', param, callback)
    }
}
