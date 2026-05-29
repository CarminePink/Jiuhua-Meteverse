import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

/**
 * JavaScript wrapper for the DasCompass UE component
 * Provides functionality for controlling compass display in the Unreal Engine environment
 */
export default class DasCompass {
    static className = 'DasCompass'

    /**
     * 显示指北针
     * @returns {Promise<boolean>} 操作是否成功
     */
    async showCompass() {
        let result = false
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            DasCompass.className,
            'ShowCompass',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 隐藏指北针
     * @returns {Promise<boolean>} 操作是否成功
     */
    async hideCompass() {
        let result = false
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            DasCompass.className,
            'HideCompass',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置指北针表盘图片
     * @param {string} imagePath - 图片路径
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setCompassPlateImage(imagePath) {
        let result = false
        const param = {
            PlateImagePath: imagePath
        }
        await ExcuteUEFun.excuteUEFunction(
            DasCompass.className,
            'SetCompassPlateImage',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置指北针指针图片
     * @param {string} imagePath - 图片路径
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setCompassPointerImage(imagePath) {
        let result = false
        const param = {
            PointerImagePath: imagePath
        }
        await ExcuteUEFun.excuteUEFunction(
            DasCompass.className,
            'SetCompassPointerImage',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置指北针位置
     * @param {number} x - X坐标（像素）
     * @param {number} y - Y坐标（像素）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setCompassPosition(x, y) {
        let result = false
        const param = {
            x: x,
            y: y
        }
        await ExcuteUEFun.excuteUEFunction(
            DasCompass.className,
            'SetCompassPosition',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 设置指北针大小
     * @param {number} width - 宽度（像素）
     * @param {number} height - 高度（像素）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async setCompassSize(width, height) {
        let result = false
        const param = {
            width: width,
            height: height
        }
        await ExcuteUEFun.excuteUEFunction(
            DasCompass.className,
            'SetCompassSize',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 更新指北针所有设置（显示、表盘图片、指针图片、位置、大小）
     * @param {Object} options - 配置选项
     * @param {string} options.PlateImagePath - 表盘图片路径
     * @param {string} options.PointerImagePath - 指针图片路径
     * @param {number} options.x - X坐标（像素）
     * @param {number} options.y - Y坐标（像素）
     * @param {number} options.width - 宽度（像素）
     * @param {number} options.height - 高度（像素）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async updateAll(options) {
        let result = false
        const param = {
            PlateImagePath: options.PlateImagePath || '',
            PointerImagePath: options.PointerImagePath || '',
            x: options.x || 0,
            y: options.y || 0,
            width: options.width || 200,
            height: options.height || 200
        }
        await ExcuteUEFun.excuteUEFunction(
            DasCompass.className,
            'UpdateAll',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }
}
