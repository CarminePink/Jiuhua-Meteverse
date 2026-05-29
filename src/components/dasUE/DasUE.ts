import Viewer from '@/components/dasUE/Viewer'
import DasScene from '@/components/dasUE/scene/DasScene'
import DasCamera from '@/components/dasUE/scene/DasCamera'
import DasCompass from '@/components/dasUE/scene/DasCompass'
import DasCustomMessage from '@/components/dasUE/scene/DasCustomMessage'
import DasInformerShape from '@/components/dasUE/scene/DasInformerShape'
import DasTerrainTileset from '@/components/dasUE/scene/DasTerrainTileset'
import DasCameraRouteRoaming from '@/components/dasUE/scene/DasCameraRouteRoaming'
import DasThirdPersonCamera from '@/components/dasUE/scene/DasThirdPersonCamera'
import DasWatchGuideLine from '@/components/dasUE/scene/DasWatchGuideLine'
import DasLevelSequenceControl from '@/components/dasUE/scene/DasLevelSequenceControl'
import DasElectron from '@/components/dasUE/scene/DasElectron'
import DasPointsLayer from '@/components/dasUE/layer/DasPointLayer'
import DasGroupLayer from '@/components/dasUE/layer/DasGroupLayer'
import DasWidgetBillboardLayer from '@/components/dasUE/layer/DasWidgetBillboardLayer'
import DasUIBillboardLayer from '@/components/dasUE/layer/DasUIBillboardLayer'
import DasPolylineLayer from '@/components/dasUE/layer/DasPolylineLayer'
import DasPolygonLayer from '@/components/dasUE/layer/DasPolygonLayer'
import DasFitEarthPolylineLayer from '@/components/dasUE/layer/DasFitEarthPolylineLayer'
import DasFitEarthPolygonLayer from '@/components/dasUE/layer/DasFitEarthPolygonLayer'
import DasInnerLayer from '@/components/dasUE/layer/DasInnerLayer'
import DasCameraRoamingLayer from '@/components/dasUE/layer/DasCameraRoamingLayer'
import DasCameraRoamingCircleLayer from '@/components/dasUE/layer/DasCameraRoamingCircleLayer'
import DasTemplateTerrainImageLayer from '@/components/dasUE/layer/Tileset/DasTemplateTerrainImageLayer'
import DasTianDiTuTerrainImageLayer from '@/components/dasUE/layer/Tileset/DasTianDiTuTerrainImageLayer'
import DasLoadModelSubView from '@/components/dasUE/layer/DasLoadModelSubView'
import DasSplineLayer from '@/components/dasUE/layer/DasSplineLayer'
import DasCustomLayer from '@/components/dasUE/layer/DasCustomLayer'
import DasPointsTool from '@/components/dasUE/tool/DasPointTool'
import DasSelectTool from '@/components/dasUE/tool/DasSelectTool'
import DasPolylineTool from '@/components/dasUE/tool/DasPolylineTool'
import DasPointEditTool from '@/components/dasUE/tool/DasPointEditTool'
import DasSplineWalk from '@/components/dasUE/tool/DasSplineWalk'
import DasGizmosOperateTool from '@/components/dasUE/tool/DasGizmosOperateTool'
import DasUELayerMarkerManager from './DasUELayerManager'

const signalServerUrl = window.webConfig.signalServerUrl
export default class DasUE {
    public viewer
    public isViewerReady = false // Viewer initialized flag
    public dasScene: DasScene
    public dasCamera: DasCamera
    public dasCompass: DasCompass
    public dasCustomMessage: DasCustomMessage
    public dasInformerShape: DasInformerShape
    public dasTerrainTileset: DasTerrainTileset
    public dasCameraRouteRoaming: DasCameraRouteRoaming
    public dasGroupLayer: DasGroupLayer
    public dasPointsLayer: DasPointsLayer
    public dasWidgetBillboardLayer: DasWidgetBillboardLayer
    public dasUIBillboardLayer: DasUIBillboardLayer
    public dasPolylineLayer: DasPolylineLayer
    public dasPolygonLayer: DasPolygonLayer
    public dasFitEarthPolylineLayer: DasFitEarthPolylineLayer
    public dasFitEarthPolygonLayer: DasFitEarthPolygonLayer
    public dasInnerLayer: DasInnerLayer
    public dasCameraRoamingLayer: DasCameraRoamingLayer
    public dasCameraRoamingCircleLayer: DasCameraRoamingCircleLayer
    public dasLoadModelSubViewLayer: DasLoadModelSubView
    public dasTemplateTerrainImageLayer: DasTemplateTerrainImageLayer
    public dasTianDiTuTerrainImageLayer: DasTianDiTuTerrainImageLayer
    public dasLevelSequenceControl: DasLevelSequenceControl
    public dasElectron: DasElectron
    public dasThirdPersonCamera: DasThirdPersonCamera
    public dasWatchGuideLine: DasWatchGuideLine
    public dasSplineLayer: DasSplineLayer
    public dasCustomLayer: DasCustomLayer
    public dasPointsTool: DasPointsTool
    public dasSelectTool: DasSelectTool
    public dasPolylineTool: DasPolylineTool
    public dasPointEditTool: DasPointEditTool
    public dasSplineWalk: DasSplineWalk
    public dasGizmosOperateTool: DasGizmosOperateTool
    public dasUELayerMarkerManager: DasUELayerMarkerManager

    constructor(domId: string) {
        this.viewer = new Viewer({
            onInitialize: () => {
                this.isViewerReady = true
            },
            useUrlParams: false,
            hideDefaultUI: true,
            signalServer: signalServerUrl
        })
        const targetDom = document.getElementById(domId)
        if (targetDom && !window.webConfig.isElectron) {
            targetDom.appendChild(this.viewer.rootElement)
        }
        // scene
        this.dasScene = new DasScene() // Scene控制（Weather、LevelSequence、Camera、Scene）
        this.dasCamera = new DasCamera() // Camera控制
        this.dasCompass = new DasCompass() // 指北针
        this.dasCustomMessage = new DasCustomMessage() // 自定义消息
        this.dasInformerShape = new DasInformerShape() // 区域形状监听（Pawn进入/离开）
        this.dasTerrainTileset = new DasTerrainTileset() // 地形Tileset
        this.dasCameraRouteRoaming = new DasCameraRouteRoaming() // 相机轨迹线漫游
        this.dasThirdPersonCamera = new DasThirdPersonCamera() // 第三人称相机
        this.dasWatchGuideLine = new DasWatchGuideLine() // 引导线
        this.dasLevelSequenceControl = new DasLevelSequenceControl() // 关卡序列控制
        this.dasElectron = new DasElectron() // Electron控制
        // layers
        this.dasGroupLayer = new DasGroupLayer() // 图层组
        this.dasPointsLayer = new DasPointsLayer() // 点位图层
        this.dasWidgetBillboardLayer = new DasWidgetBillboardLayer() // 标牌图层
        this.dasUIBillboardLayer = new DasUIBillboardLayer() // UI标牌图层
        this.dasPolylineLayer = new DasPolylineLayer() // 折线图层
        this.dasPolygonLayer = new DasPolygonLayer() // 多边形图层
        this.dasFitEarthPolylineLayer = new DasFitEarthPolylineLayer() // 贴地折线图层
        this.dasFitEarthPolygonLayer = new DasFitEarthPolygonLayer() // 贴地多边形图层
        this.dasInnerLayer = new DasInnerLayer() // 内置图层
        this.dasCameraRoamingLayer = new DasCameraRoamingLayer() // 漫游图层
        this.dasCameraRoamingCircleLayer = new DasCameraRoamingCircleLayer() // 环绕飞行图层
        this.dasLoadModelSubViewLayer = new DasLoadModelSubView() // 加载模型子视口图层
        this.dasTemplateTerrainImageLayer = new DasTemplateTerrainImageLayer() // 模板地形影像图层
        this.dasTianDiTuTerrainImageLayer = new DasTianDiTuTerrainImageLayer() // 天地图地形影像图层
        this.dasSplineLayer = new DasSplineLayer() // 样条图层
        this.dasCustomLayer = new DasCustomLayer() // 自定义图层
        // tool
        this.dasPointsTool = new DasPointsTool() // 点位工具
        this.dasSelectTool = new DasSelectTool() // 选择工具
        this.dasPolylineTool = new DasPolylineTool() // 折线工具
        this.dasPointEditTool = new DasPointEditTool() // 点位编辑
        this.dasSplineWalk = new DasSplineWalk() // 样条线行走工具
        this.dasGizmosOperateTool = new DasGizmosOperateTool() // 变换操作工具
        // manager
        this.dasUELayerMarkerManager = new DasUELayerMarkerManager(this)

        this.dasElectron.initListener()
    }

    // 复位视角（子场景页面时复位到对应的子场景视角，其他情况复位到全山视角）
    resetCamera() {
        this.dasScene.flyToCameraPositionByName('总览视角')
    }

    // 清除所有图层
    async clearAllLayers() {
        const rootGroup = await this.dasGroupLayer.getRoot()
        rootGroup.removeAllLayer()
    }
    // 清除所有图层、事件监听
    async clearAllLayerAndEvent() {
        const rootGroup = await this.dasGroupLayer.getRoot()
        rootGroup.removeAllLayer()
        this.dasSelectTool.removeCallBack()
        this.dasSelectTool.finishTool()
        for (const key in this.dasUELayerMarkerManager.layerMarkerMap) {
            delete this.dasUELayerMarkerManager.layerMarkerMap[key]
        }
    }

    getQueryVariable(variable) {
        const query = window.location.search.substring(1)
        const vars = query.split('&')
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=')
            if (pair[0] == variable) {
                return decodeURIComponent(pair[1])
            }
        }
        return false
    }
}
