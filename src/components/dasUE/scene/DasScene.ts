import ExcuteUEFun from '@/components/dasUE/ExcuteUEFun'

const weatherControlName = 'Weather' // 天气控制类名
const cameraControlName = 'Camera' // 相机控制类名
const levelSequenceControlName = 'LevelSequenceControl' // 动画序列控制类名
const sceneControlName = 'Scene' // 场景控制类名
const compassControlName = 'DasCompass' // 指北针控制类名
export default class DasScene {
    /**
     * 天气控制（时间、季节、光照等）
     * @param {string} type - 天气控制类型
     * @param {string} value - 设置值
     */
    async setWeather(type: string, value: string) {
        let param = {}
        switch (type) {
            case 'SetSunIntensity': // 设置太阳强度，范围: 4-10
            case 'SetWindIntensity': // 设置风强度，范围: 0-5
            case 'SetControlCloudIntensity': // 设置云层强度，范围: 0-10
            case 'SetControlRainIntensity': // 设置雨强度，范围: 1000-50000
            case 'SetControlSnowIntensity': // 设置雪强度，范围: 1000-50000
            case 'SetControlFogIntensity': // 设置雾强度，范围: 0-10
            case 'SetControlThunderIntensity': // 设置雷暴强度，范围: 0-20
            case 'SetControlSnowOverlapIntensity': // 设置雪覆盖强度，范围: 0-1
                param = { intensity: value }
                break
            case 'SetTimeOfDay': // 设置一天中的时间，时间字符串，格式为"8:30"，24小时制，范围: 0:00 - 23:59
                param = { timeOfDay: value }
                break
            case 'SetSunAngle': // 设置太阳角度，角度，范围: 0-360
                param = { angle: value }
                break
            case 'SetWeatherType': // 天气类型，中文字符串，可选："晴"、"雨"、"雪"、"雾"、"雷电"等
                param = { weatherType: value }
                break
            case 'SetWindDirection': // 设置风向，角度，范围: 0-360
                param = { direction: value }
                break
            case 'SetSeason': // 设置季节
                param = { season: value }
                break
            case 'SetMoonSacle': // 月亮大小比例，范围: 0-10
                param = { moonScale: value }
                break
            case 'SetMoonLightColor': // 设置月光颜色，颜色对象 {r: 1.0, g: 1.0, b: 1.0, a: 1.0}，范围: 0-1
                param = { moonColor: value }
                break
            case 'SetMoonLightIntensity': // 月光强度，范围: 0-10
                param = { moonIntensity: value }
                break
            case 'SetStarIntensity': // 星星亮度强度，范围: 0-10
                param = { starIntensity: value }
                break
        }
        ExcuteUEFun.excuteUEFunction(weatherControlName, type, param)
    }
    /**
     * 设置要播放的关卡序列
     * @param {string} sequencePath - 序列资产路径
     * @returns {Promise<boolean>} 是否成功设置
     */
    async setSequence(sequencePath: string) {
        let result = false
        const param = {
            sequencePath: sequencePath
        }
        await ExcuteUEFun.excuteUEFunction(
            levelSequenceControlName,
            'setSequence',
            param,
            function (json) {
                result = json.success
            }
        )
        return result
    }
    /**
     * 播放关卡序列
     * @param {boolean} resetToStart - 是否从头开始播放，默认为true
     * @param {number} playRate - 播放速率，默认为1.0
     * @returns {Promise<boolean>} 是否成功开始播放
     */
    async playSequence(resetToStart = true, playRate = 1.0) {
        let result = false
        const param = {
            resetToStart: resetToStart,
            playRate: playRate
        }
        await ExcuteUEFun.excuteUEFunction(
            levelSequenceControlName,
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
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            levelSequenceControlName,
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
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            levelSequenceControlName,
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
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            levelSequenceControlName,
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
    async getSequenceStatus() {
        const result = {
            state: 'unknown',
            currentTime: 0,
            duration: 0,
            progress: 0
        }
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            levelSequenceControlName,
            'getStatus',
            param,
            function (json) {
                result.state = json.state
                result.currentTime = json.currentTime
                result.duration = json.duration
                result.progress = json.progress
            }
        )
        return result
    }
    /**
     * 通过名称飞行到指定点位
     * @param {string} positionName - 点位名称
     * @param {number} [duration=5.0] - 飞行时间（秒）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async flyToCameraPositionByName(positionName, duration = 2) {
        let result = false
        const param = {
            positionName: positionName,
            duration: duration
        }
        await ExcuteUEFun.excuteUEFunction(
            cameraControlName,
            'flyToCameraPositionByName',
            param,
            function () {
                result = true
            }
        )
        return result
    }

    /**
     * 获取当前相机的经纬度高度和欧拉角
     * @returns {Promise<object>} 包含locationLLH和rotationLLH的对象
     */
    async getCameraFlyInfoLLH() {
        const result = { locationLLH: [], rotationLLH: {} }
        const param = {}
        await ExcuteUEFun.excuteUEFunction(
            cameraControlName,
            'getCameraFlyInfoLLH',
            param,
            function (json) {
                // 位置数据 [longitude, latitude, height]
                if (json.locationLLH && Array.isArray(json.locationLLH)) {
                    result.locationLLH = json.locationLLH
                }

                // 旋转数据 (对象格式 {pitch, yaw, roll})
                if (json.rotationLLH) {
                    result.rotationLLH = json.rotationLLH
                }
            }
        )
        return result
    }

    /**
     * 飞行到指定的经纬度高度和欧拉角
     * @param {Array} locationLLH - 包含[经度,纬度,高度]的数组
     * @param {object} rotationLLH - 包含pitch、yaw、roll的对象
     * @param {number} [duration=2.0] - 飞行时间（秒）
     * @returns {Promise<boolean>} 操作是否成功
     */
    async flyToLocationLLH(locationLLH, rotationLLH, duration = 2) {
        let result = false
        const param = {
            locationLLH,
            rotationLLH,
            duration
        }
        await ExcuteUEFun.excuteUEFunction(
            cameraControlName,
            'flyToLocationLLH',
            param,
            function () {
                result = true
            }
        )
        return result
    }
    async screenToWorld(screenX, screenY) {
        let result = {}
        const param = {
            screenX: screenX,
            screenY: screenY
        }
        await ExcuteUEFun.excuteUEFunction(
            sceneControlName,
            'screenToWorld',
            param,
            function (json) {
                result = json.posLLH
            }
        )
        return result
    }

    /**
     * 加载指定的关卡
     * @param {string} levelName - 关卡名称
     * @param {boolean} makeVisible - 是否使关卡可见，默认为true
     * @returns {Promise<boolean>} 是否成功发起加载请求
     */
    async loadLevel(levelName, makeVisible = true) {
        let result = false
        const param = {
            levelName: levelName,
            makeVisible: makeVisible
        }
        await ExcuteUEFun.excuteUEFunction(sceneControlName, 'loadLevel', param, function (json) {
            // C++ loadLevel返回true，表示请求成功发起。实际加载完成通过事件监听。
            result = json.result === true // Assuming C++ writes '"result":true' on success
        })
        return result
    }

    /**
     * 卸载指定的关卡
     * @param {string} levelName - 关卡名称
     * @returns {Promise<boolean>} 是否成功发起卸载请求
     */
    async unloadLevel(levelName) {
        let result = false
        const param = {
            levelName: levelName
        }
        await ExcuteUEFun.excuteUEFunction(sceneControlName, 'unloadLevel', param, function (json) {
            result = json.success
        })
        return result
    }

    /**
     * 切换操作器类型
     * @param {string} pawnType - 操作器类型 ("Pawn_Universal" 或 "Pawn_ThirdPerson")
     * @returns {Promise<boolean>} 是否成功切换
     */
    async switchPawnType(pawnType) {
        let success = false
        const param = {
            pawnType: pawnType
        }
        await ExcuteUEFun.excuteUEFunction(
            sceneControlName,
            'switchPawnType',
            param,
            function (json) {
                // C++ switchPawnType 返回 true/false，并且在成功时写出 "result": true 到 writer
                success = json.result === true
            }
        )
        return success
    }

    /**
     * 获取当前操作器类型
     * @returns {Promise<string>} 当前操作器类型 ("Pawn_Universal", "Pawn_ThirdPerson", 或 "Unknown")
     */
    async getCurrentPawnType() {
        let currentType = 'Unknown'
        await ExcuteUEFun.excuteUEFunction(
            sceneControlName,
            'getCurrentPawnType',
            {},
            function (json) {
                // C++ getCurrentPawnType 写出 "pawnType": "..." 到 writer
                if (json && json.pawnType) {
                    currentType = json.pawnType
                }
            }
        )
        return currentType
    }

    /**
     * Shows the compass
     * @returns {Promise<boolean>} Whether the compass was successfully shown
     */
    async showCompass() {
        try {
            let success = false
            await ExcuteUEFun.excuteUEFunction(compassControlName, 'ShowCompass', {}, json => {
                success = json.success !== false
            })
            return success
        } catch (error) {
            console.error('显示指北针失败:', error)
            return false
        }
    }

    /**
     * Hides the compass
     * @returns {Promise<boolean>} Whether the compass was successfully hidden
     */
    async hideCompass() {
        try {
            let success = false
            await ExcuteUEFun.excuteUEFunction(compassControlName, 'HideCompass', {}, json => {
                success = json.success !== false
            })
            return success
        } catch (error) {
            console.error('隐藏指北针失败:', error)
            return false
        }
    }

    /**
     * 获取指定经纬度的高度
     * @param {number} longitude - 经度
     * @param {number} latitude - 纬度
     * @returns {Promise<{height: number, success: boolean}>} 高度信息和成功状态
     */
    async getHeightAtLongLat(longitude, latitude) {
        const result = { height: 0.0, success: false }
        const param = {
            longitude: longitude,
            latitude: latitude
        }
        await ExcuteUEFun.excuteUEFunction(
            sceneControlName,
            'getHeightAtLongLat',
            param,
            function (json) {
                if (json) {
                    result.height = json.height || 0.0
                    result.success = json.success || false
                }
            }
        )
        return result
    }

    /**
     * 设置投影模式
     * @param {boolean} bPerspective - true为透视投影，false为正交投影
     * @returns {Promise<boolean>} 是否成功设置
     */
    async setPerspectiveProjection(bPerspective) {
        let result = false
        let param = {
            bPerspective: bPerspective
        }
        await ExcuteUEFun.excuteUEFunction(
            sceneControlName,
            'setPerspectiveProjection',
            param,
            function (json) {
                result = true
            }
        )
        return result
    }

    /**
     * 获取当前投影模式
     * @returns {Promise<boolean>} 当前是否为透视投影
     */
    async getPerspectiveProjection() {
        let bPerspective = true
        await ExcuteUEFun.excuteUEFunction(
            sceneControlName,
            'getPerspectiveProjection',
            {},
            function (json) {
                if (json && json.bPerspective !== undefined) {
                    bPerspective = json.bPerspective
                }
            }
        )
        return bPerspective
    }

    /**
     * 切换到指定顺序关卡（ADasSequenceLevelControl）
     * @param {string} levelName - 要加载的关卡名称
     * @returns {Promise<boolean>} 是否成功触发
     */
    async loadNextLevel(levelName) {
        let result = false
        let param = { levelName: levelName }
        await ExcuteUEFun.excuteUEFunction(sceneControlName, 'loadNextLevel', param, function () {
            result = true
        })
        return result
    }
}
