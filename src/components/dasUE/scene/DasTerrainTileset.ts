import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

/**
 * JavaScript wrapper for the UWebDasTerrainTileset UE component
 * Provides terrain tileset control functions
 */
export default class DasTerrainTileset {
    static className = 'DasTerrainTileset'

    /**
     * 设置地形高度偏移量
     * @param {number} addHeight - 高度偏移量（米），正值表示抬高地形，负值表示降低地形
     * @returns {Promise<boolean>} 操作是否成功
     *
     * @example
     * // 将地形抬高100米
     * await DasTerrainTileset.setAddHeight(100);
     *
     * @example
     * // 将地形降低50米
     * await DasTerrainTileset.setAddHeight(-50);
     *
     * @example
     * // 重置地形高度（无偏移）
     * await DasTerrainTileset.setAddHeight(0);
     */
    async setAddHeight(addHeight) {
        let result = false
        const param = {
            addHeight: addHeight
        }
        await ExcuteUEFun.excuteUEFunction(
            DasTerrainTileset.className,
            'setAddHeight',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取当前地形高度偏移量
     * @returns {Promise<number>} 当前高度偏移量（米）
     *
     * @example
     * const currentHeight = await DasTerrainTileset.getAddHeight();
     * console.log(`Current terrain height offset: ${currentHeight} meters`);
     */
    async getAddHeight() {
        let addHeight = 0.0
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            DasTerrainTileset.className,
            'getAddHeight',
            param,
            function (json) {
                if (json.addHeight != null) {
                    addHeight = json.addHeight
                }
            }
        )
        return addHeight
    }
}
