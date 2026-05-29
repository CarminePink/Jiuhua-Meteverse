import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

/**
 * JavaScript wrapper for the UWebLevelSequenceControl UE component
 * Provides level sequence control functionalities
 */
export default class LevelSequenceControl {
    static className = 'LevelSequenceControl'

    /**
     * 设置要播放的关卡序列
     * @param {string} sequencePath - 序列资产路径
     * @param {Object} options - 可选参数
     * @param {boolean} [options.canInterrupt=true] - 是否可以被用户操作中断
     * @param {number} [options.playRate=1.0] - 播放速率（正数为正放，负数为倒放）
     * @param {boolean} [options.isReversePlay=false] - 是否倒放（会自动将playRate设置为负数，并从末尾开始）
     * @param {boolean} [options.autoPlay=true] - 是否自动播放
     * @returns {Promise<object>} 返回对象包含成功状态和序列总时间 {success: boolean, duration: number}
     *
     * @example
     * // 基本用法（正常播放，自动开始）
     * let result = await LevelSequenceControl.setSequence("/Game/Sequences/MySequence");
     * console.log(result.duration); // 序列总时间
     *
     * // 只设置序列，不自动播放
     * await LevelSequenceControl.setSequence("/Game/Sequences/MySequence", {
     *     autoPlay: false
     * });
     *
     * // 倒放播放（从末尾开始，以1倍速倒放）
     * await LevelSequenceControl.setSequence("/Game/Sequences/MySequence", {
     *     isReversePlay: true
     * });
     *
     * // 倒放播放，2倍速
     * await LevelSequenceControl.setSequence("/Game/Sequences/MySequence", {
     *     isReversePlay: true,
     *     playRate: 2.0       // 2倍速倒放
     * });
     *
     * // 正常播放，1.5倍速
     * await LevelSequenceControl.setSequence("/Game/Sequences/MySequence", {
     *     canInterrupt: true,
     *     playRate: 1.5
     * });
     */
    async setSequence(sequencePath, options = {}) {
        let result = {
            success: false,
            duration: 0
        }
        let param = {
            sequencePath: sequencePath,
            canInterrupt: false,
            playRate: options.playRate !== undefined ? options.playRate : 1.0,
            isReversePlay: options.isReversePlay !== undefined ? options.isReversePlay : false,
            autoPlay: options.autoPlay !== undefined ? options.autoPlay : true
        }

        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'setSequence',
            param,
            function (json) {
                result.success = json.success
                result.duration = json.duration || 0
            }
        )
        return result
    }

    /**
     * 播放关卡序列
     * @param {boolean} resetToStart - 是否从头开始播放，默认为true
     * @returns {Promise<boolean>} 是否成功开始播放
     */
    async playSequence(resetToStart = true) {
        let result = false
        let param = {
            resetToStart: resetToStart
        }
        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'playSequence',
            param,
            function (json) {
                result = json.success
            }
        )
        return result
    }

    /**
     * 暂停关卡序列
     * @returns {Promise<boolean>} 是否成功暂停
     */
    async pauseSequence() {
        let result = false
        let param = {}
        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'pauseSequence',
            param,
            function (json) {
                result = json.success
            }
        )
        return result
    }

    /**
     * 继续播放关卡序列
     * @returns {Promise<boolean>} 是否成功继续播放
     */
    async resumeSequence() {
        let result = false
        let param = {}
        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'resumeSequence',
            param,
            function (json) {
                result = json.success
            }
        )
        return result
    }

    /**
     * 停止关卡序列
     * @returns {Promise<boolean>} 是否成功停止
     */
    async stopSequence() {
        let result = false
        let param = {}
        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'stopSequence',
            param,
            function (json) {
                result = json.success
            }
        )
        return result
    }

    /**
     * 获取序列状态
     * @returns {Promise<object>} 播放状态和当前时间信息
     */
    async getStatus() {
        let result = {
            state: 'unknown',
            currentTime: 0,
            duration: 0
        }
        let param = {}
        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'getStatus',
            param,
            function (json) {
                result.state = json.state
                result.currentTime = json.currentTime
                result.duration = json.duration
            }
        )
        return result
    }

    /**
     * 设置当前播放时间（跳转到指定进度）
     * @param {number} timeInSeconds - 目标时间（秒）
     * @returns {Promise<boolean>} 是否成功设置
     *
     * @example
     * // 跳转到序列的第5秒
     * await LevelSequenceControl.setCurrentTime(5.0);
     *
     * // 跳转到序列的一半位置
     * let status = await LevelSequenceControl.getStatus();
     * await LevelSequenceControl.setCurrentTime(status.duration / 2);
     */
    async setCurrentTime(timeInSeconds) {
        let result = false
        let param = {
            timeInSeconds: timeInSeconds
        }
        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'setCurrentTime',
            param,
            function (json) {
                result = json.success
            }
        )
        return result
    }

    /**
     * 设置播放速率
     * @param {number} playRate - 播放速率（正数为正放，负数为倒放，1.0为正常速度）
     * @returns {Promise<boolean>} 是否成功设置
     *
     * @example
     * // 设置为正常速度
     * await LevelSequenceControl.setPlayRate(1.0);
     *
     * // 设置为2倍速播放
     * await LevelSequenceControl.setPlayRate(2.0);
     *
     * // 设置为倒放（1倍速）
     * await LevelSequenceControl.setPlayRate(-1.0);
     *
     * // 设置为0.5倍速慢放
     * await LevelSequenceControl.setPlayRate(0.5);
     */
    async setPlayRate(playRate) {
        let result = false
        let param = {
            playRate: playRate
        }
        await ExcuteUEFun.excuteUEFunction(
            LevelSequenceControl.className,
            'setPlayRate',
            param,
            function (json) {
                result = json.success
            }
        )
        return result
    }
}
