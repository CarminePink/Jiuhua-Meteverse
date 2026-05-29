import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import { useDasUE } from '@/hooks/useDasUEHook'

/**
 * DasInformerShape 类
 * 用于注册地理坐标区域形状（圆柱体等），并监听 Pawn 进入/离开区域的事件。
 * 目前支持 shapeType: "Cylinder"
 */
export default class DasInformerShape {
    static className = 'DasInformerShape'

    // 监听 Inside 变化的回调 Map：listenerID -> callback(shapeID, shapeName)
    static mapInsideCallbacks = new Map()

    // 监听 Outside 变化的回调 Map：listenerID -> callback(shapeID, shapeName)
    static mapOutsideCallbacks = new Map()

    // 是否已创建 UE 响应监听
    static bCreateListener = false

    /**
     * 初始化 UE 事件监听（内部调用，仅初始化一次）
     */
    static _ensureListener() {
        const viewer = useDasUE().dasUE.viewer

        if (DasInformerShape.bCreateListener) return
        DasInformerShape.bCreateListener = true

        viewer.addResponseEventListener(DasInformerShape.className, json => {
            const obj = JSON.parse(json)
            if (obj.class !== DasInformerShape.className || obj.function !== 'emitMessage') return

            const message = JSON.parse(obj.message)
            const shapeID = message.shapeID ?? ''
            const shapeName = message.shapeName ?? ''

            if (obj.messageName === 'shapeInsideChanged') {
                for (const cb of DasInformerShape.mapInsideCallbacks.values()) {
                    cb(shapeID, shapeName)
                }
            } else if (obj.messageName === 'shapeOutsideChanged') {
                for (const cb of DasInformerShape.mapOutsideCallbacks.values()) {
                    cb(shapeID, shapeName)
                }
            }
        })
    }

    /**
     * 添加 Inside 状态变化监听器（Pawn 进入形状区域时触发）
     * @param {string} listenerID - 监听器唯一标识，用于后续移除
     * @param {function} callback - 回调函数 (shapeID: string, shapeName: string) => void
     */
    addShapeInsideChangedListener(listenerID, callback) {
        DasInformerShape._ensureListener()
        DasInformerShape.mapInsideCallbacks.set(listenerID, callback)
    }

    /**
     * 添加 Outside 状态变化监听器（Pawn 离开形状区域时触发）
     * @param {string} listenerID - 监听器唯一标识，用于后续移除
     * @param {function} callback - 回调函数 (shapeID: string, shapeName: string) => void
     */
    addShapeOutsideChangedListener(listenerID, callback) {
        DasInformerShape._ensureListener()
        DasInformerShape.mapOutsideCallbacks.set(listenerID, callback)
    }

    /**
     * 移除 Inside 监听器
     * @param {string} listenerID
     */
    removeShapeInsideChangedListener(listenerID) {
        DasInformerShape.mapInsideCallbacks.delete(listenerID)
    }

    /**
     * 移除 Outside 监听器
     * @param {string} listenerID
     */
    removeShapeOutsideChangedListener(listenerID) {
        DasInformerShape.mapOutsideCallbacks.delete(listenerID)
    }

    /**
     * 批量注册形状点位
     * @param {Array<object>} shapes - 形状数组，每项格式见下方说明
     * @param {string}   shapes[].shapeType    - 形状类型，当前仅支持 "Cylinder"
     * @param {string}   shapes[].shapeName    - 形状名称（可选）
     * @param {number[]} shapes[].posLLH       - 中心经纬高 [longitude, latitude, height]
     * @param {number}   shapes[].dRadius      - 水平半径（米）
     * @param {number}   shapes[].dHeightAdd   - 向上高度范围（米）
     * @param {number}   shapes[].dHeightReduce - 向下高度范围（米）
     * @returns {Promise<string[]>} 返回已注册形状的 ID 数组
     */
    async RegisterShapes(shapes) {
        const param = { shapes }
        const result = await ExcuteUEFun.excuteUEFunction(
            DasInformerShape.className,
            'RegisterShapes',
            param
        )
        return (result as any).shapeIDs ?? []
    }

    /**
     * 按 ID 移除形状
     * @param {string} shapeID - 要移除的形状 ID
     * @returns {Promise<boolean>} 是否成功
     */
    async RemoveShape(shapeID) {
        const param = { shapeID }
        const result = await ExcuteUEFun.excuteUEFunction(
            DasInformerShape.className,
            'RemoveShape',
            param
        )
        return (result as any).success !== undefined ? (result as any).success : true
    }

    /**
     * 清空所有形状
     * @returns {Promise<boolean>} 是否成功
     */
    async ClearAllShapes() {
        const result = await ExcuteUEFun.excuteUEFunction(
            DasInformerShape.className,
            'ClearAllShapes',
            {}
        )
        return (result as any).success !== undefined ? (result as any).success : true
    }

    /**
     * 控制形状调试可视化开关
     * @param {boolean} bShow - true 启用绘制，false 关闭绘制
     * @returns {Promise<boolean>} 是否成功
     */
    async ShowShape(bShow) {
        const param = { bShow }
        const result = await ExcuteUEFun.excuteUEFunction(
            DasInformerShape.className,
            'ShowShape',
            param
        )
        return (result as any).success !== undefined ? (result as any).success : false
    }
}
