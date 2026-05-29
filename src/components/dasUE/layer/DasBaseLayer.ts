import { DasBaseClass } from '@/components/dasUE/DasBaseClass'
// import DasGroupLayer from '@/components/dasUE/layer/DasGroupLayer'

export default class DasBaseLayer extends DasBaseClass {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasLayerBase'
    }

    // Get the layer's unique ID
    getLayerID = async () => {
        let layerID = 0
        await this.excuteUEClassFunction('getID', {}, json => {
            layerID = json.LayerID
        })
        return layerID
    }

    // Set the layer's visibility
    setVisible = async visible => {
        const param = { visible: visible }
        return await this.excuteUEClassFunction('setVisible', param)
    }

    // Check if the layer is visible
    isVisible = async () => {
        let visible = false
        await this.excuteUEClassFunction('isVisible', {}, json => {
            visible = json.visible
        })
        return visible
    }

    // Set the layer's name
    setName = async strName => {
        const param = { name: strName }
        return await this.excuteUEClassFunction('setName', param)
    }

    // Get the layer's name
    getName = async () => {
        let name = ''
        await this.excuteUEClassFunction('getName', {}, json => {
            name = json.name
        })
        return name
    }

    // Get the layer's parent
    // getParent = async () => {
    //     let parent = null
    //     await this.excuteUEClassFunction('getParent', {}, json => {
    //         parent = new DasGroupLayer()
    //         parent.readObjectInfo(json)
    //     })
    //     return parent
    // }

    // Fly camera to this layer's position
    flyToThis = async ({ canInterruptByMoving = true, flyDuration = 3.0, pitch = 89.9 }) => {
        const param = {
            canInterruptByMoving: canInterruptByMoving,
            flyDuration: flyDuration,
            pitch: pitch
        }
        return await this.excuteUEClassFunction('flyToThis', param)
    }

    // Set the layer's visible distance settings
    setVisibleDistance = async (distanceVisibleEnable, maxVisibleDistance, minVisibleDistance) => {
        const param = {
            distanceVisibleEnable: distanceVisibleEnable,
            maxVisibleDistance: maxVisibleDistance
        }

        if (minVisibleDistance) {
            param.minVisibleDistance = minVisibleDistance
        }

        return await this.excuteUEClassFunction('setVisibleDistance', param)
    }
    // Set distance visible enable state
    setDistanceVisibleEnable = async enable => {
        const param = { enable: enable }
        return await this.excuteUEClassFunction('setDistanceVisibleEnable', param)
    }

    // Check if distance visible is enabled
    isDistanceVisibleEnable = async () => {
        let enable = false
        await this.excuteUEClassFunction('isDistanceVisibleEnable', {}, function (json) {
            enable = json.enable
        })
        return enable
    }

    // Set visible distance configuration
    setVisibleDistanceConfig = async (maxVisibleDistance, minVisibleDistance = 0) => {
        const param = {
            maxVisibleDistance: maxVisibleDistance,
            minVisibleDistance: minVisibleDistance
        }
        return await this.excuteUEClassFunction('setVisibleDistanceConfig', param)
    }

    // Get visible distance configuration
    getVisibleDistanceConfig = async () => {
        const config = { maxVisibleDistance: 50000, minVisibleDistance: 0 }
        await this.excuteUEClassFunction('getVisibleDistanceConfig', {}, function (json) {
            config.maxVisibleDistance = json.maxVisibleDistance
            config.minVisibleDistance = json.minVisibleDistance
        })
        return config
    }
    // Set the layer's highlight state
    setHightLight = async hightLight => {
        const param = { hightLight: hightLight }
        return await this.excuteUEClassFunction('setHightLight', param)
    }

    // Check if the layer is highlighted
    isHightLight = async () => {
        let hightLight = false
        await this.excuteUEClassFunction('isHightLight', {}, json => {
            hightLight = json.hightLight
        })
        return hightLight
    }

    // Set the layer's outline state
    setOutline = async outline => {
        const param = { outline: outline }
        return await this.excuteUEClassFunction('setOutline', param)
    }

    // Check if the layer has outline
    isOutline = async () => {
        let outline = false
        await this.excuteUEClassFunction('isOutline', {}, json => {
            outline = json.outline
        })
        return outline
    }

    // Set the layer's world transform
    setWorldTransform = async transform => {
        const param = { transform: transform }
        return await this.excuteUEClassFunction('setWorldTransform', param)
    }

    // Get the layer's world transform
    getWorldTransform = async () => {
        let transform = null
        await this.excuteUEClassFunction('getWorldTransform', {}, json => {
            transform = json.transform
        })
        return transform
    }

    writeObjectInfo() {
        const obj = {
            class: this.className,
            id: this.id
        }
        return obj
    }
}
