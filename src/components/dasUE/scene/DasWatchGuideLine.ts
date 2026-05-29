import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

export default class WatchGuideLine {
    static className = 'DasWatchGuideLine'

    /**
     * 设置当前激活的引导路线名
     * @param {string} routeName - 路线名称（对应Tag中 "路线名_序号" 的路线名部分）
     * @returns {Promise<boolean>}
     */
    async setCurrentGuideLineRouteName(routeName: string) {
        let result = false
        const param = { routeName: routeName }
        await ExcuteUEFun.excuteUEFunction(
            WatchGuideLine.className,
            'setCurrentGuideLineRouteName',
            param,
            function (json: any) {
                result = true
            }
        )
        return result
    }
}
