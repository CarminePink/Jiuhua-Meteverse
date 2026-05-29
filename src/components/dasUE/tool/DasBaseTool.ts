import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
export default class ToolBase {
    static className = 'ToolBase'

    /**
     * 设置此工具为当前活动工具
     * @param {function} callback - 操作完成后的回调函数
     */
    async setToCurrent(callback) {
        const param = {}
        await ExcuteUEFun.excuteUEFunction(ToolBase.className, 'setToCurrent', param, callback)
    }

    /**
     * 完成当前工具操作
     * @param {function} callback - 操作完成后的回调函数
     */
    async finishTool(callback?) {
        const param = {}
        await ExcuteUEFun.excuteUEFunction(ToolBase.className, 'finishTool', param, callback)
    }
}
