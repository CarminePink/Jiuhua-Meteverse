import DasUE from '@/components/dasUE/DasUE'

let dasUE: DasUE
const domContainerId = 'scene-viewer-container'

export const useDasUE = (noClear = false) => {
    if (!dasUE) {
        console.log('dasUE is null')
        dasUE = new DasUE(domContainerId)
    } else {
        // console.log('dasUE is already initialized')
    }
    const onViewerReady = (callback: () => void) => {
        const intervalId = setInterval(async () => {
            // 判断此时viewer是否已经初始化完成
            if (dasUE?.isViewerReady) {
                console.log('~~~~~~~~~~~~~~~~~viewer is ready~~~~~~~~~~~~~~~~~')
                // 每次初始化后调用onViewerReady时会先清除之前的所有layer和绑定事件，清除动画序列播放后再执行回调（目前是全部清除了，后续根据功能可能需要保留某些layer，再做优化）
                // await dasUE.dasScene.setSequence('')
                // await dasUE.dasScene.stopSequence()
                // if (!noClear) {
                //     await dasUE.clearAllLayerAndEvent()
                // }
                callback()
                clearInterval(intervalId)
            }
        }, 100)
    }
    return {
        dasUE,
        onViewerReady
    }
}
