interface TriggerPoint {
    id: string
    name: string
    position: number[]
    dRadius: number
    dHeightAdd: number
    dHeightReduce: number
}

import { HomeVisitMode, useHomeModeStore } from '@/stores/homeMode'

export const useShapeListener = (
    LISTENER_ID: string,
    triggerPoints: TriggerPoint[],
    listenerCallback: (shapeID: string, shapeName: string) => void,
    unListenerCallback: (shapeID: string, shapeName: string) => void
) => {
    const homeModeStore = useHomeModeStore()

    // 注册触发点事件
    const registerTriggerPoints = async (ueManager: any) => {
        if (!ueManager) return

        const tasks = triggerPoints.map((point: TriggerPoint) => {
            const shapes = {
                shapeType: 'Cylinder',
                shapeName: `Shape_${point.name}`,
                posLLH: point.position,
                dRadius: point.dRadius,
                dHeightAdd: point.dHeightAdd,
                dHeightReduce: point.dHeightReduce
            }

            return new Promise(resolve => {
                ueManager.dasInformerShape
                    .RegisterShapes([shapes])
                    .then(() => {
                        console.log(`注册触发点成功: ${point.name}`)
                        resolve(true)
                    })
                    .catch((err: any) => {
                        console.error(`注册触发点失败: ${point.name}`, err)
                        resolve(false)
                    })
            })
        })

        await Promise.all(tasks)
        console.log('所有触发点已注册')
        ueManager.dasInformerShape.ShowShape(false) // 默认隐藏形状

        // 添加进入/离开监听（set 会覆盖同 listenerID，只保留一份）
        ueManager.dasInformerShape.addShapeInsideChangedListener(
            LISTENER_ID,
            (shapeID: string, shapeName: string) => {
                if (homeModeStore.currentMode === HomeVisitMode.Free) {
                    return
                }

                const time = new Date().toLocaleTimeString()
                console.log(
                    `触发点进入事件: shapeID=${shapeID} shapeName=${shapeName} time=${time}`
                )

                listenerCallback(shapeID, shapeName)
            }
        )

        ueManager.dasInformerShape.addShapeOutsideChangedListener(
            LISTENER_ID,
            (shapeID: string, shapeName: string) => {
                if (homeModeStore.currentMode === HomeVisitMode.Free) {
                    return
                }

                const time = new Date().toLocaleTimeString()
                console.log(
                    `触发点离开事件: shapeID=${shapeID} shapeName=${shapeName} time=${time}`
                )

                unListenerCallback(shapeID, shapeName)
            }
        )
    }

    const removeTriggerPointListeners = (ueManager: any) => {
        if (ueManager) {
            ueManager.dasInformerShape.removeShapeInsideChangedListener(LISTENER_ID)
            ueManager.dasInformerShape.removeShapeOutsideChangedListener(LISTENER_ID)
        }
    }

    return {
        registerTriggerPoints,
        removeTriggerPointListeners
    }
}
