import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import { useDasUE } from '@/hooks/useDasUEHook'

export default class DasElectron {
    static className = 'DasElectron'

    /// 显示UE程序窗口
    async showUEWindow() {
        const result = { success: false, message: '' }
        await ExcuteUEFun.excuteUEFunction(
            DasElectron.className,
            'showUEWindow',
            {},
            function (json) {
                if (json) {
                    result.success = json.success || false
                    result.message = json.message || ''
                }
            }
        )
        return result
    }

    /// 隐藏UE程序窗口
    async hideUEWindow() {
        const result = { success: false, message: '' }
        await ExcuteUEFun.excuteUEFunction(
            DasElectron.className,
            'hideUEWindow',
            {},
            function (json) {
                if (json) {
                    result.success = json.success || false
                    result.message = json.message || ''
                }
            }
        )
        return result
    }

    /// 关闭UE程序
    async closeUEApplication() {
        const result = { success: false, message: '' }
        await ExcuteUEFun.excuteUEFunction(
            DasElectron.className,
            'closeUEApplication',
            {},
            function (json) {
                if (json) {
                    result.success = json.success || false
                    result.message = json.message || ''
                }
            }
        )
        return result
    }
    /// 设置是否检查鼠标穿透。bCheck: true=检查 false=不检查
    SetCheckMousePassThrough(bCheck) {
        if (window.electronAPI && window.electronAPI.bridge) {
            window.electronAPI.bridge.send(
                'DasElectron',
                JSON.stringify({ checkPassThrough: bCheck })
            )
        }
    }

    /// 设置是否命令控制鼠标穿透。bIsPassThroughByCommand: true=命令控制 false=恢复自动跟踪
    SetElectronCheckMousePassThrough(bIsPassThroughByCommand) {
        if (window.electronAPI && window.electronAPI.bridge) {
            window.electronAPI.bridge.send(
                'DasElectron',
                JSON.stringify({ IsPassThroughByCommand: bIsPassThroughByCommand })
            )
        }
    }

    /// 监听UE发来的DasElectron消息，转发IsPassThroughByCommand到Electron
    initListener() {
        if (DasElectron._bListenerCreated) return
        DasElectron._bListenerCreated = true

        const viewer = useDasUE().dasUE.viewer

        viewer.addResponseEventListener(DasElectron.className, json => {
            const obj = JSON.parse(json)
            if (obj.class !== DasElectron.className || obj.function !== 'emitMessage') return
            if (obj.messageName === 'IsPassThroughByCommand') {
                const data = JSON.parse(obj.message)
                this.SetElectronCheckMousePassThrough(data.IsPassThroughByCommand)
            }
        })
    }

    /// 设置鼠标穿透。bMousePassThrough: true=穿透 false=不穿透
    async setMousePassThrough(bMousePassThrough) {
        const result = { success: false, message: '' }
        await ExcuteUEFun.excuteUEFunction(
            DasElectron.className,
            'setMousePassThrough',
            { bMousePassThrough: bMousePassThrough },
            function (json) {
                if (json) {
                    result.success = json.success || false
                    result.message = json.message || ''
                }
            }
        )
        return result
    }
}
