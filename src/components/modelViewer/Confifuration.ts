export interface IConfiguration {
    dom: HTMLElement
    modelUrl: string
    autoRotate?: boolean
    autoRotateSpeed?: number
    backgroundImg?: string
    backgroundOpacity?: number
    mtlUrl?: string
    lightIntensity?: number
}

const defaultConfiguration: Partial<IConfiguration> = {
    autoRotate: true,
    autoRotateSpeed: 1,
    backgroundOpacity: 0,
    lightIntensity: 5
}

export class Configuration {
    dom: HTMLElement
    modelUrl: string
    autoRotate?: boolean
    autoRotateSpeed?: number
    backgroundImg?: string
    backgroundOpacity?: number
    mtlUrl?: string
    lightIntensity?: number
    constructor(options: IConfiguration) {
        this.dom = options.dom
        this.modelUrl = options.modelUrl
        Object.assign(this, defaultConfiguration, options)
    }
}
