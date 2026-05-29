import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

export class DasBaseClass {
    public id: string // 前后端交互使用ID
    public className: string // 对象名,与后端交互需要
    public class: string
    constructor() {
        this.id = '' // 前后端交互使用ID
        this.className = 'DasLayerBase' // 对象名,与后端交互需要
    }
    getClassName = () => {
        return this.className
    }
    getID = () => {
        return this.id
    }

    //请求获取的class，可以获取具体的子类信息
    requestClassName = async () => {
        let name = ''
        await this.excuteUEClassFunction('requestClassName', {}, function (json) {
            name = json.childClassName
        })
        return name
    }

    readObjectInfo = obj => {
        if (obj == null) {
            return
        }
        this.id = obj.id
        this.class = obj.class
    }

    writeObjectJson = () => {
        const json = { id: null, class: null }
        json.id = this.id
        json.class = this.class
        return json
    }

    async removeInstance(callback) {
        if (this.id == '') {
            return
        }
        const param = { id: this.id }
        const result = await ExcuteUEFun.excuteUEFunction(
            this.getClassName(),
            'removeInstance',
            param,
            callback
        )
        return result
    }

    async excuteUEClassFunction(funName, param, callback?) {
        param.id = this.id
        const result = await ExcuteUEFun.excuteUEFunction(
            this.getClassName(),
            funName,
            param,
            callback
        )
        return result
    }
}
