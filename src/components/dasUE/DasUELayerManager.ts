import DasUE from '@/components/dasUE/DasUE'
import { getAdaptiveSize } from '@/utils/utils'
const markerBasePath = window.webConfig.mapMarkerUrl

export default class DasUELayerMarkerManager {
    public layerMarkerMap: any = {}
    constructor(private dasUE: DasUE) {}
    createLayerMarker = (layerName: string, config?: any, data?: any[]) => {
        if (!this.dasUE) return
        switch (layerName) {
            case 'chapter1':
                this.createLayerByType(layerName, data || [])
                break
            default:
                break
        }
    }

    // 创建自由漫游路线遗址点位图层
    async createFreeRoamHeritageLayer(layerName: string, config?: any, data?: any[]) {
        const list: any = data.filter(item => item.points?.length > 0)

        const layers = await this.dasUE.dasPointsLayer.batchCreateInstance(
            list.map(item => ({
                points: item.points,
                useMaskTexture: true,
                pointSize: getAdaptiveSize([81, 264]),
                texturePath: item.texturePath
            }))
        )

        layers.forEach((layer, index) => {
            layer.customData = list[index]
            layer.customData.id = index + 1
        })
        this.layerMarkerMap[layerName] = layers
    }

    // 根据类型创建点位图层
    async createLayerByType(layerName: string, data: any[]) {
        const list: any = data.filter(item => item.points?.length > 0)

        const layers = await this.dasUE.dasPointsLayer.batchCreateInstance(
            list.map(item => ({
                points: item.points,
                useMaskTexture: true,
                pointSize: getAdaptiveSize(item.pointSize),
                texturePath: item.texturePath
            }))
        )

        layers.forEach((layer, index) => {
            layer.customData = list[index]
            layer.customData.id = index + 1
        })
        this.layerMarkerMap[layerName] = layers
    }

    // 显示图层所有标注
    showLayerMakers = layerName => {
        this.layerMarkerMap[layerName]?.forEach(layer => {
            layer.setVisible(true)
        })
    }

    // 隐藏图层所有标注
    hideLayerMakers = layerName => {
        this.layerMarkerMap[layerName]?.forEach(layer => {
            layer.setVisible(false)
        })
    }

    // 删除图层所有标注（！删除图层效率很低，不如直接 rootGroup.removeAllLayer()）
    removeLayerMakers = async layerName => {
        const rootGroup = await this.dasUE.dasGroupLayer.getRoot()
        this.layerMarkerMap[layerName]?.forEach(layer => {
            rootGroup.removeLayer(layer)
        })
        delete this.layerMarkerMap[layerName]
    }
}
