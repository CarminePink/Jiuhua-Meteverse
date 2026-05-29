import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasGroupLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasGroupLayer'
    }

    // Add a layer to the group
    addLayer = async childLayer => {
        const param = { child: childLayer.writeObjectJson() }
        return await this.excuteUEClassFunction('addLayer', param)
    }

    // Remove a layer from the group
    removeLayer = childLayer => {
        const param = { child: childLayer }
        return this.excuteUEClassFunction('removeLayer', param)
    }

    // Get number of layers in the group
    numLayer = async () => {
        let num = 0
        await this.excuteUEClassFunction('numLayer', {}, json => {
            num = json.num
        })
        return num
    }

    // Get a layer by index
    getLayer = async index => {
        let layer = null
        const param = { index: index }
        await this.excuteUEClassFunction('getLayer', param, json => {
            layer = new DasBaseLayer()
            layer.readObjectInfo(json)
        })

        return layer
    }

    // Get all layers in the group
    getAllLayer = async () => {
        const layers = []
        await this.excuteUEClassFunction('getAllLayer', {}, json => {
            const layerJsons = json.layers
            for (let i = 0; i < layerJsons.length; i++) {
                const layer = new DasBaseLayer()
                layer.readObjectInfo(layerJsons[i])
                layers.push(layer)
            }
        })
        return layers
    }

    // Remove all layers from the group
    removeAllLayer = async () => {
        return await this.excuteUEClassFunction('removeAllLayer', {})
    }

    // Get the root group
    getRoot = async () => {
        let root = null
        await ExcuteUEFun.excuteUEFunction(this.className, 'getRoot', {}, json => {
            root = new DasGroupLayer()
            root.readObjectInfo(json)
        })
        return root
    }

    createInstance = async param => {
        let group = null
        await ExcuteUEFun.excuteUEFunction(
            this.className,
            'createInstance',
            param,
            function (json) {
                group = new DasGroupLayer()
                group.readObjectInfo(json.object)
            }
        )

        return group
    }
}
