import { createGuid } from '@/utils/utils'
import { useDasUE } from '@/hooks/useDasUEHook'
export default class ExcuteUEFun {
    constructor() {}

    static async excuteUEFunction(strclass, strFun, param, callback?) {
        const viewer = useDasUE().dasUE.viewer
        if (!window.gInitListener) {
            window.gmapClass = new Map()
            viewer.onResponse(x => {
                //x解析成jsonObject
                const JsonResult = JSON.parse(x)
                console.log('RecieveMessage', JsonResult)
                if (window.gmapClass.has(JsonResult.class)) {
                    const classBack = window.gmapClass.get(JsonResult.class)
                    const f = classBack.get(JsonResult.commandID)
                    if (f) {
                        f(JsonResult)
                    }
                    classBack.delete(JsonResult.commandID)
                }
            })
            window.gInitListener = true
        }

        return new Promise(function (resolve) {
            const guid = createGuid()
            const message = {
                class: strclass,
                function: strFun,
                commandID: guid,
                param: param
            }

            viewer.sendMessage(message)
            console.log('sendMessage', message)
            if (!window.gmapClass.has(strclass)) {
                window.gmapClass.set(strclass, new Map())
            }
            const classBack = window.gmapClass.get(strclass)
            classBack.set(guid, function (json) {
                if (callback != null) {
                    callback(json)
                }
                resolve(json)
            })
        })
    }
}
