import {
    Config,
    EventEmitter,
    Flags,
    OptionParameters,
    TextParameters,
    PixelStreaming
} from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.3'
import {
    Application,
    PixelStreamingApplicationStyle,
    UIElementCreationMode
} from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.3'

class Viewer extends EventEmitter {
    constructor({
        // InputControllers = [],
        onInitialize = () => {},
        useUrlParams = true,
        hideDefaultUI = false,
        signalServer = '',
        matchViewResolution = false
    }) {
        super()

        const PixelStreamingApplicationStyles = new PixelStreamingApplicationStyle()
        PixelStreamingApplicationStyles.applyStyleSheet()

        const config = new Config({
            useUrlParams: useUrlParams,
            initialSettings: {
                MaxReconnectAttempts: 500,
                StreamerAutoJoinInterval: 1000,
                WaitForStreamer: true
            }
        })

        if (!useUrlParams) {
            config.setTextSetting(TextParameters.SignallingServerUrl, signalServer)
            config.setOptionSettingValue(OptionParameters.StreamerId, 'DefaultStreamer')
        }

        config.setFlagEnabled(Flags.MatchViewportResolution, matchViewResolution)

        config.setFlagEnabled(Flags.AutoConnect, true)

        config.setFlagEnabled(Flags.FakeMouseWithTouches, true)

        config.setFlagEnabled(Flags.AutoPlayVideo, true)
        config.setFlagEnabled(Flags.StartVideoMuted, true)

        config.setFlagEnabled(Flags.HoveringMouseMode, true)
        config.setFlagEnabled(Flags.SuppressBrowserKeys, false)
        config.setFlagEnabled(Flags.KeyboardInput, true)

        // 匹配视口分辨率
        config.setFlagEnabled(Flags.MatchViewportResolution, true)

        const stream = new PixelStreaming(config)

        const settingsPanelConfig = hideDefaultUI
            ? {
                  visibilityButtonConfig: {
                      creationMode: UIElementCreationMode.Disable
                  }
              }
            : {
                  isEnabled: true,
                  visibilityButtonConfig: {
                      creationMode: UIElementCreationMode.CreateDefaultElement
                  }
              }

        const application = new Application({
            stream,
            onColorModeChanged: isLightMode =>
                PixelStreamingApplicationStyles.setColorMode(isLightMode),
            settingsPanelConfig: settingsPanelConfig,
            statsPanelConfig: {
                visibilityButtonConfig: {
                    creationMode: UIElementCreationMode.Disable
                }
            },
            fullScreenControlsConfig: {
                visibilityButtonConfig: {
                    creationMode: UIElementCreationMode.Disable
                }
            },
            videoQpIndicatorConfig: {
                disableIndicator: true
            }
        })

        this.stream = stream
        this.application = application
        this.responseCallbackMap = new Map()

        this.toStreamerMessagesProvider = null

        stream.addResponseEventListener('handle_responses', response => {
            let message = response

            try {
                message = JSON.parse(response)
            } catch (error) {
                message = response
            }

            for (const callback of this.getOrCreateResponseCallbackSet(message.EventName)) {
                callback(message)
            }
        })

        stream.addResponseEventListener('DasElectrom', response => {
            //Electron 接口
            const JsonResult = JSON.parse(response)
            if (JsonResult.class == 'DasElectron') {
                if (window.electronAPI && window.electronAPI.bridge) {
                    window.electronAPI.bridge.send('DasElectron', JsonResult.message)
                }
                try {
                    // const msg = JSON.parse(JsonResult.message)
                    // if (msg && 'MousePassThrough' in msg) {
                    //     const styleId = 'das-cursor-none'
                    //     if (msg.MousePassThrough) {
                    //         if (!document.getElementById(styleId)) {
                    //             const style = document.createElement('style')
                    //             style.id = styleId
                    //             style.textContent =
                    //                 '* { cursor: none !important; pointer-events: none !important }'
                    //             document.head.appendChild(style)
                    //         }
                    //     } else {
                    //         document.getElementById(styleId)?.remove()
                    //     }
                    // }
                } catch {}
            }
        })
        stream.addEventListener('videoInitialized', () => {
            console.log('Video initialized')
            setTimeout(() => {
                onInitialize()
            }, 100)
        })
    }

    get rootElement() {
        return this.application.rootElement
    }

    getStreamHandler(handlerName = '') {
        return this.stream.toStreamerHandlers.get(handlerName)
    }

    getOrCreateResponseCallbackSet(key) {
        if (!this.responseCallbackMap.has(key)) {
            this.responseCallbackMap.set(key, new Set())
        }
        return this.responseCallbackMap.get(key)
    }

    waitResponseOnce(eventName, callback) {
        let canceler = this.addResponseEventListener(eventName, params => {
            callback(params)
            canceler()
            canceler = null
        })
    }

    waitResponseUntil(eventName, boolExpression) {
        let canceler = this.addResponseEventListener(eventName, params => {
            if (boolExpression(params)) {
                canceler()
                canceler = null
            }
        })
    }

    // sendMessage(message) {
    // 	this.stream.emitUIInteraction(message)
    // }

    sendMessage(message, chunkSize = 100000) {
        const jsonStr = JSON.stringify(message)
        if (jsonStr.length <= chunkSize) {
            this.stream.emitUIInteraction(message)
            return
        }

        const chunks = []
        for (let i = 0; i < jsonStr.length; i += chunkSize) {
            chunks.push(jsonStr.slice(i, i + chunkSize))
        }

        this.stream.emitUIInteraction('BEGIN' + chunks[0])

        for (let i = 1; i < chunks.length - 1; i++) {
            this.stream.emitUIInteraction(chunks[i])
        }

        this.stream.emitUIInteraction(chunks[chunks.length - 1] + 'END')
    }

    sendCommand(message) {
        this.stream.emitCommand(message)
    }

    onResponse(callback) {
        this.stream.addResponseEventListener('handle_responses', callback)
    }

    addResponseEventListener(strKye, callback) {
        this.stream.addResponseEventListener(strKye, callback)
    }

    removeResponseEventListener(strKye) {
        this.stream.removeResponseEventListener(strKye)
    }

    dispose() {
        if (this.rootElement && this.rootElement.parentNode) {
            this.rootElement.parentNode.removeChild(this.rootElement)
        }
        this.stream.disconnect()
    }

    setResolution(width, height) {
        this.stream.emitCommand({
            Resolution: { Width: width, Height: height }
        })
    }
}

export default Viewer
