import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import { useDasUE } from '@/hooks/useDasUEHook'

/**
 * JavaScript wrapper for UWebCustomMessage UE component
 * 提供Web与UE之间的双向自定义消息通道
 */
export default class CustomMessage {
    static className = 'CustomMessage'
    static mapName2Callback = new Map() // messageName -> callback
    static bCreateListener = false

    /**
     * 从Web端发送自定义消息到UE
     * @param {string} messageName - 消息名称
     * @param {string} message - 消息内容
     * @returns {Promise<boolean>} 是否成功发送
     */
    async MessageFromWeb(messageName, message) {
        let result = false
        const param = {
            messageName: messageName,
            message: message
        }
        await ExcuteUEFun.excuteUEFunction(
            CustomMessage.className,
            'MessageFromWeb',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 注册监听UE推送的自定义消息（MessageToWeb方向）
     * @param {string} messageName - 要监听的消息名称
     * @param {function} callback - 回调函数 (messageName: string, message: string) => void
     */
    MessageToWeb(messageName, callback) {
        const viewer = useDasUE().dasUE.viewer
        CustomMessage.mapName2Callback.set(messageName, callback)

        if (!CustomMessage.bCreateListener) {
            CustomMessage.bCreateListener = true
            viewer.addResponseEventListener(CustomMessage.className, json => {
                const obj = JSON.parse(json)
                if (obj.class != CustomMessage.className) return
                if (obj.function != 'emitMessage') return

                const cb = CustomMessage.mapName2Callback.get(obj.messageName)
                if (cb) {
                    cb(obj.messageName, obj.message)
                }
            })
        }
    }
}
