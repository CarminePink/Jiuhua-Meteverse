// 全局类型声明文件

// 扩展Window接口，添加webConfig属性
declare global {
    interface Window {
        webConfig: {
            signalServerUrl: string
            staticResourceUrl: string
            htmlResourceUrl: string
            mapMarkerUrl: string
            screenWidth: number
            isElectron: boolean
        }
        // 其他可能需要的全局属性
        gInitListener?: boolean
        nextLoading: boolean
    }
}

// 确保这个文件被当作模块处理
export {}
