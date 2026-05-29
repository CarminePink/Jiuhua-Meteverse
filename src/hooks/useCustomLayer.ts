interface TriggerPoint {
    id: string
    name: string
    position: number[]
    dRadius: number
    dHeightAdd: number
    dHeightReduce: number
}

/**
 * 自定义光圈图层管理 Hook
 * 负责光圈图层的创建、显隐控制和清除
 */
export const useCustomLayer = (triggerPoints: TriggerPoint[], assetName = 'Guide') => {
    const customGizmoLayers = ref<Record<string, any>>({})

    // 添加自定义光圈图层
    const addCustomGizmoLayer = async (ueManager: any) => {
        if (!ueManager) return

        const tasks = triggerPoints.map(async (point: TriggerPoint) => {
            const layerName = point.name
            const param = {
                param: {
                    assetName,
                    transform: {
                        translation: [point.position[0], point.position[1], point.position[2]],
                        rotation: [0, 0, 0, 1],
                        scale3D: [1, 1, 1]
                    }
                }
            }

            const layer = await ueManager.dasCustomLayer.createInstance(param)

            if (!layer) return null

            await layer.setName(layerName)
            layer.customData = {
                id: point.id,
                name: layerName,
                triggerName: point.name
            }

            return layer
        })

        const layers = (await Promise.all(tasks)).filter(Boolean) as any[]

        customGizmoLayers.value = markRaw(
            layers.reduce((layerMap: Record<string, any>, layer: any) => {
                const layerName = layer.customData?.name
                if (layerName) {
                    layerMap[layerName] = layer
                }
                return layerMap
            }, {})
        )
    }

    // 设置自定义光圈图层显隐
    const setCustomGizmoLayerVisible = async (layerName: string, visible: boolean) => {
        const layer = customGizmoLayers.value[layerName]
        if (!layer) return
        await layer.setVisible(visible)
    }

    // 清除自定义光圈图层
    const clearCustomGizmoLayer = async () => {
        const layers = Object.values(customGizmoLayers.value)
        await Promise.all(layers.map((layer: any) => layer.removeInstance()))
        customGizmoLayers.value = {}
    }

    return {
        customGizmoLayers,
        addCustomGizmoLayer,
        setCustomGizmoLayerVisible,
        clearCustomGizmoLayer
    }
}
