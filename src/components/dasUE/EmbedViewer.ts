class EmbedViewer {
    constructor() {
        this.responseCallbackMap = new Map()
    }

    get rootElement() {
        return this.application.rootElement
    }

    sendMessage(message, chunkSize = 100000) {
        const jsonStr = JSON.stringify(message)
        const send = str => {
            const ue = window.ue
            if (ue?.daswebbridge) {
                ue.daswebbridge.onmessage(str)
            }
        }

        if (jsonStr.length <= chunkSize) {
            send(jsonStr)
            return
        }

        const chunks = []
        for (let i = 0; i < jsonStr.length; i += chunkSize) {
            chunks.push(jsonStr.slice(i, i + chunkSize))
        }

        send('BEGIN' + chunks[0])
        for (let i = 1; i < chunks.length - 1; i++) {
            send(chunks[i])
        }
        send(chunks[chunks.length - 1] + 'END')
    }

    // sendCommand(message) {
    //     this.stream.emitCommand(message)
    // }

    onMessage(message) {
        //alert(message)
        for (const [key, value] of this.responseCallbackMap) {
            if (typeof value === 'function') {
                value(message)
            }
        }
    }

    addResponseEventListener(strKye, callback) {
        this.responseCallbackMap.set(strKye, callback)
    }

    removeResponseEventListener(strKye) {
        this.responseCallbackMap.delete(strKye)
    }

    setResolution(width, height) {
        // this.sendCommand({
        //     Resolution: { Width: width, Height: height }
        // })
    }
}

export default EmbedViewer
