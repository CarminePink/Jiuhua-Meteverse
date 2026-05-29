import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import { useDasUE } from '@/hooks/useDasUEHook'
import ToolBase from '@/components/dasUE/tool/DasBaseTool'

/**
 * JavaScript wrapper for the DasSelectTool UE component
 * Provides selection functionality for Components, Actors, and Layers
 */
export default class DasSelectTool extends ToolBase {
    static className = 'DasSelectTool'
    /**
     * Sets the DasSelectTool as the current active tool
     * @param {function} callback - Optional callback function after operation
     */
    async setToCurrent() {
        const param = {}
        await ExcuteUEFun.excuteUEFunction(DasSelectTool.className, 'setToCurrent', param)
    }

    // 根据配置信息，初始化选中工具
    async initSelectTool(config) {
        this.addCallBack(config.onClick)
        ExcuteUEFun.excuteUEFunction(DasSelectTool.className, 'setSelectMode', {
            selectMode: config.selectMode || 'Layer'
        })
        ExcuteUEFun.excuteUEFunction(DasSelectTool.className, 'setSelectShowState', {
            selectShowState: config.selectShowState || 'None'
        })
        await ExcuteUEFun.excuteUEFunction(DasSelectTool.className, 'setToCurrent', {})
    }

    /**
     * Clears the current selection
     * @param {function} callback - Optional callback function after operation
     */
    async clearSelect(callback?) {
        const param = {}
        await ExcuteUEFun.excuteUEFunction(DasSelectTool.className, 'clearSelect', param, callback)
    }

    /**
     * Sets the selection mode
     * @param {string} mode - The selection mode: "Component", "Actor", or "Layer"
     * @param {function} callback - Optional callback function after operation
     */
    async setSelectMode(mode) {
        const param = {
            selectMode: mode
        }
        await ExcuteUEFun.excuteUEFunction(DasSelectTool.className, 'setSelectMode', param)
    }

    /**
     * Gets the current selection mode
     * @param {function} callback - Callback function receiving the selection mode
     */
    async getSelectMode() {
        let selectMode = ''
        await ExcuteUEFun.excuteUEFunction(
            DasSelectTool.className,
            'getSelectMode',
            {},
            function (json) {
                selectMode = json.selectMode
            }
        )

        return selectMode
    }

    /**
     * Sets the selection visual state
     * @param {string} state - Visual state: "None", "Outline", "Highlight", or "OutlineAndHighlight"
     * @param {function} callback - Optional callback function after operation
     */
    async setSelectShowState(state) {
        const param = {
            selectShowState: state
        }
        await ExcuteUEFun.excuteUEFunction(DasSelectTool.className, 'setSelectShowState', param)
    }

    /**
     * Gets the current selection visual state
     * @param {function} callback - Callback function receiving the visual state
     */
    async getSelectShowState() {
        let strShowState = ''
        await ExcuteUEFun.excuteUEFunction(
            DasSelectTool.className,
            'getSelectShowState',
            {},
            function (json) {
                strShowState = json.selectShowState
            }
        )

        return strShowState
    }

    addCallBack(fun) {
        const viewer = useDasUE().dasUE.viewer
        viewer.addResponseEventListener(DasSelectTool.className, json => {
            const obj = JSON.parse(json)
            if (obj.class == DasSelectTool.className) {
                if (fun != null) {
                    fun(obj)
                }
            }
        })
    }

    removeCallBack() {
        const viewer = useDasUE().dasUE.viewer
        viewer.removeResponseEventListener(DasSelectTool.className)
    }
}
