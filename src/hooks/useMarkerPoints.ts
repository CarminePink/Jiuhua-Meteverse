import { ref, reactive, markRaw } from 'vue'
import { getAdaptiveSize } from '@/utils/utils'

import { completeDailyTask } from '@/api/home/index'

export interface MarkerPointConfig {
    name: string
    texturePath: string
    points: number[][]
    pointSize: number[]
    enableDepthTest: boolean
    description: string
    video?: string
}

/**
 * 标记点管理 Hook
 * 负责标记点图层的创建、点击识别和清除，可在不同章节间复用
 */
export const useMarkerPoints = (markerPoints: MarkerPointConfig[]) => {
    const customMarkers = ref<any[]>([])
    const markerDetailVisible = ref(false)
    const currentMarker = reactive<{
        name: string
        description: string
        video: string
    }>({
        name: '',
        description: '',
        video: ''
    })

    // 批量创建标记点图层
    const addMarkerPoints = async (ueManager: any, points?: MarkerPointConfig[]) => {
        if (!ueManager) return

        const list = (points ?? markerPoints).filter(item => item.points?.length > 0)
        const layers = await ueManager.dasPointsLayer.batchCreateInstance(
            list.map(item => ({
                points: item.points,
                useMaskTexture: true,
                pointSize: getAdaptiveSize(item.pointSize),
                texturePath: item.texturePath,
                autoScale: false
            }))
        )
        layers.forEach((layer: any, index: number) => {
            layer.customData = list[index]
            layer.customData.id = index + 1
        })

        customMarkers.value = markRaw(layers)
    }

    // 点击标注图标，显隐弹窗
    const onMarkerClick = (obj: any) => {
        const item = obj.message ? JSON.parse(obj.message) : {}

        if (item.selectLayer?.class == 'DasPointsLayer') {
            const clickedLayer = customMarkers.value.find(
                (layer: any) => layer.id == item.selectLayer.id
            ) as any

            if (clickedLayer) {
                if (
                    markerDetailVisible.value &&
                    currentMarker.name === clickedLayer.customData.name
                ) {
                    markerDetailVisible.value = false
                    return
                }
                currentMarker.name = clickedLayer.customData.name ?? ''
                currentMarker.description = clickedLayer.customData.description ?? ''
                currentMarker.video = clickedLayer.customData.video ?? ''
                markerDetailVisible.value = true
                completeDailyTask('UNLOCK_HOTSPOT').catch(() => {})
            } else {
                markerDetailVisible.value = false
            }
        }
    }

    // 清除标记点图层
    const clearMarkerPoints = async () => {
        await Promise.all(customMarkers.value.map((layer: any) => layer.removeInstance?.(() => {})))
        customMarkers.value = []
    }

    return {
        customMarkers,
        markerDetailVisible,
        currentMarker,
        addMarkerPoints,
        onMarkerClick,
        clearMarkerPoints
    }
}
