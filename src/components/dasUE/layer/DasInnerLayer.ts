import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'
import DasBaseLayer from '@/components/dasUE/layer/DasBaseLayer'

export default class DasInnerLayer extends DasBaseLayer {
    constructor() {
        super()
        this.id = ''
        this.className = 'DasInnerLayer'
    }

    /**
     * Create a new inner layer instance
     * @param {Object} param - Creation parameters
     * @param {string} param.TagName - Tag name to find the actor
     * @returns {Promise<DasInnerLayer>} - New inner layer instance
     */
    async createInstance(param) {
        let innerLayer = null
        await ExcuteUEFun.excuteUEFunction(
            'DasInnerLayer',
            'createInstance',
            param,
            function (json) {
                innerLayer = new DasInnerLayer()
                innerLayer.readObjectInfo(json.object)
            }
        )

        return innerLayer
    }
}
