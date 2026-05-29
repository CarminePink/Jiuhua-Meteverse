import { Configuration, IConfiguration } from './Confifuration'
import {
    Scene,
    Object3D,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    DirectionalLight,
    Box3,
    Vector3,
    Mesh,
    HemisphereLight,
    Group,
    AnimationMixer,
    Clock,
    MeshStandardMaterial,
    AxesHelper,
    DirectionalLightHelper,
    HemisphereLightHelper,
    SRGBColorSpace
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

export default class ModelViewer {
    config: Configuration
    private scene: Scene
    private model?: Object3D
    private renderer: WebGLRenderer
    private camera: PerspectiveCamera
    private control: OrbitControls
    private mixer?: AnimationMixer
    private clock: Clock
    private lightGroup: Group
    private mainDirectionalLight: DirectionalLight
    private fillLight: DirectionalLight
    private backLight: DirectionalLight
    constructor(options: IConfiguration) {
        this.config = new Configuration(options)
        //! 创建场景
        this.scene = new Scene()
        //! 创建相机
        this.camera = new PerspectiveCamera(
            75,
            this.config.dom.clientWidth / this.config.dom.clientHeight,
            0.1,
            999999
        )
        //! 创建渲染器
        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            outputColorSpace: SRGBColorSpace
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.config.dom.clientWidth, this.config.dom.clientHeight)
        this.config.dom.appendChild(this.renderer.domElement)
        //! 设置循环
        this.renderer.setAnimationLoop(this.render.bind(this))

        //! 初始化控制器
        this.control = new OrbitControls(this.camera, this.renderer.domElement)
        this.control.enableDamping = true
        this.control.minDistance = 0.1
        this.control.maxDistance = 999999
        this.control.target.set(0, 0, 1)
        this.control.update()
        this.control.enablePan = false

        // 初始化光源系统
        this.initLights()

        //!clock
        this.clock = new Clock()

        // 辅助坐标轴
        // this.scene.add(new AxesHelper(5000))

        //! 缩放
        window.addEventListener('resize', this.onWindowResize.bind(this), false)
    }

    private render(): void {
        this.control.update()

        //! 自动旋转
        if (this.model && this.config.autoRotate) {
            this.model.rotation.y += 0.005
            if (this.mixer) {
                this.mixer.update(this.clock.getDelta())
            }
        }
        this.renderer.render(this.scene, this.camera)
    }

    private initLights(): void {
        // 创建独立的光源组，只用于非方向光
        this.lightGroup = new Group()

        // 1. 环境光 - 提供强基础照明，确保没有完全黑暗的区域
        const ambientLight = new AmbientLight(0x404040, 1.2) // 大幅增加环境光强度

        // 2. 半球光 - 模拟天空和地面的反射光
        const hemisphereLight = new HemisphereLight(0xffffff, 0x444444, 0.8) // 增加半球光强度

        // 只将不需要target的光源添加到组中
        this.lightGroup.add(ambientLight)
        this.lightGroup.add(hemisphereLight)

        // 将光源组添加到场景
        this.scene.add(this.lightGroup)

        // 创建多方向光源系统，确保全方位明亮
        this.createMultiDirectionalLights()
    }

    // 创建多个方向光，形成全方位照明
    private createMultiDirectionalLights(): void {
        // 主方向光 - 从右上前方照射，强度较高
        this.mainDirectionalLight = new DirectionalLight(0xffffff, 3.0)
        this.mainDirectionalLight.position.set(2000, 500, 1000)
        this.mainDirectionalLight.castShadow = true
        this.mainDirectionalLight.target.position.set(0, 0, 0)
        this.mainDirectionalLight.target.updateMatrixWorld()
        this.scene.add(this.mainDirectionalLight)
        this.scene.add(this.mainDirectionalLight.target)

        // 补光1 - 从左前方照射
        this.fillLight = new DirectionalLight(0xffffff, 2.0)
        this.fillLight.position.set(-1000, 500, 1000)
        this.fillLight.target.position.set(0, 0, 0)
        this.fillLight.target.updateMatrixWorld()
        this.scene.add(this.fillLight)
        this.scene.add(this.fillLight.target)

        // 补光2 - 从后方照射
        this.backLight = new DirectionalLight(0xffffff, 1.5)
        this.backLight.position.set(0, 500, -1000)
        this.backLight.target.position.set(0, 0, 0)
        this.backLight.target.updateMatrixWorld()
        this.scene.add(this.backLight)
        this.scene.add(this.backLight.target)

        // 顶部光源 - 从正上方照射
        const topLight = new DirectionalLight(0xffffff, 1.0)
        topLight.position.set(0, 1500, 0)
        topLight.target.position.set(0, 0, 0)
        topLight.target.updateMatrixWorld()
        this.scene.add(topLight)
        this.scene.add(topLight.target)

        // 底部光源 - 从下方补光，减少底部阴影
        const bottomLight = new DirectionalLight(0xffffff, 1.0)
        bottomLight.position.set(0, -1000, 0)
        bottomLight.target.position.set(0, 0, 0)
        bottomLight.target.updateMatrixWorld()
        this.scene.add(bottomLight)
        this.scene.add(bottomLight.target)

        // 右侧光源 - 从右侧补光
        const rightLight = new DirectionalLight(0xffffff, 1.2)
        rightLight.position.set(1500, 0, 0)
        rightLight.target.position.set(0, 0, 0)
        rightLight.target.updateMatrixWorld()
        this.scene.add(rightLight)
        this.scene.add(rightLight.target)

        // 左侧光源 - 从左侧补光
        const leftLight = new DirectionalLight(0xffffff, 1.2)
        leftLight.position.set(-1500, 0, 0)
        leftLight.target.position.set(0, 0, 0)
        leftLight.target.updateMatrixWorld()
        this.scene.add(leftLight)
        this.scene.add(leftLight.target)

        // 添加光照辅助线
        // this.scene.add(new DirectionalLightHelper(this.mainDirectionalLight, 5))
        // this.scene.add(new DirectionalLightHelper(this.fillLight, 5))
        // this.scene.add(new DirectionalLightHelper(this.backLight, 5))
        // this.scene.add(new DirectionalLightHelper(topLight, 5))
        // this.scene.add(new DirectionalLightHelper(bottomLight, 5))
        // this.scene.add(new DirectionalLightHelper(rightLight, 5))
        // this.scene.add(new DirectionalLightHelper(leftLight, 5))
    }

    public placeCameraAndLight(): void {
        if (!this.model) return

        //! 重新计算模型的包围盒（模型已经居中到原点）
        const box = new Box3().setFromObject(this.model)
        const size = box.getSize(new Vector3())

        // 找出模型最大的尺寸
        const maxDim = Math.max(size.x, size.y, size.z)

        //! 设置相机位置（以原点为中心）
        // 根据模型大小计算合适的相机位置
        const fov = this.camera.fov * (Math.PI / 180) // 将角度转换为弧度
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
        const offset = 2.5 // 增加一点距离，确保模型完全可见
        cameraZ = cameraZ * offset

        // 相机位置：稍微偏右上前方，看向原点
        const cameraHeight = maxDim * 0.3
        this.camera.position.set(cameraZ * 0.3, cameraHeight, cameraZ)
        this.camera.updateProjectionMatrix()

        // 设置控制器参数（以原点为中心）
        this.control.minDistance = maxDim * 0.5
        this.control.maxDistance = maxDim * 5
        this.control.target.set(0, 0, 0) // 控制器目标设为原点
        this.control.update()
    }

    public dispose(): void {
        // 1. 停止渲染循环
        this.stopRenderLoop()

        // 2. 清理动画混合器
        if (this.mixer) {
            this.mixer.stopAllAction()
            this.mixer.uncacheRoot(this.mixer.getRoot())
            this.mixer = null as any
        }

        // 3. 清理模型资源
        this.disposeModel()

        // 4. 清理光源
        this.disposeLights()

        // 5. 清理场景
        this.disposeScene()

        // 6. 清理控制器
        if (this.control) {
            this.control.dispose()
        }

        // 7. 清理渲染器
        this.disposeRenderer()
    }

    // 停止渲染循环
    private stopRenderLoop(): void {
        // 停止WebGL渲染器的动画循环
        if (this.renderer) {
            this.renderer.setAnimationLoop(null)
        }
    }

    // 清理模型资源
    private disposeModel(): void {
        if (!this.model) return

        this.model.traverse((node: Object3D) => {
            if (node instanceof Mesh) {
                // 清理几何体
                if (node.geometry) {
                    node.geometry.dispose()
                }

                // 清理材质
                this.disposeMaterial(node.material)
            }
        })

        // 从场景中移除模型
        if (this.model.parent) {
            this.model.parent.remove(this.model)
        }

        this.model = null as any
    }

    // 清理材质资源
    private disposeMaterial(material: any): void {
        if (!material) return

        if (Array.isArray(material)) {
            material.forEach(mat => this.disposeSingleMaterial(mat))
        } else {
            this.disposeSingleMaterial(material)
        }
    }

    // 清理单个材质
    private disposeSingleMaterial(material: any): void {
        if (!material || typeof material.dispose !== 'function') return

        // 清理材质的贴图
        const textureProperties = [
            'map',
            'lightMap',
            'bumpMap',
            'normalMap',
            'specularMap',
            'envMap',
            'alphaMap',
            'aoMap',
            'displacementMap',
            'emissiveMap',
            'gradientMap',
            'metalnessMap',
            'roughnessMap',
            'clearcoatMap',
            'clearcoatNormalMap',
            'clearcoatRoughnessMap',
            'transmissionMap'
        ]

        textureProperties.forEach(prop => {
            if (material[prop] && material[prop].dispose) {
                material[prop].dispose()
            }
        })

        // 清理材质本身
        material.dispose()
    }

    // 清理光源
    private disposeLights(): void {
        // 清理所有方向光
        const lights = [this.mainDirectionalLight, this.fillLight, this.backLight]

        lights.forEach(light => {
            if (light) {
                if (light.parent) {
                    light.parent.remove(light)
                }
                if (light.target && light.target.parent) {
                    light.target.parent.remove(light.target)
                }
                light.dispose?.()
            }
        })

        // 重置光源引用
        this.mainDirectionalLight = null as any
        this.fillLight = null as any
        this.backLight = null as any
        this.lightGroup = null as any
    }

    // 清理场景
    private disposeScene(): void {
        // 递归清理场景中的所有对象
        while (this.scene.children.length > 0) {
            const child = this.scene.children[0]
            this.scene.remove(child)

            // 如果子对象有dispose方法，调用它
            if ((child as any).dispose) {
                ;(child as any).dispose()
            }
        }

        // 清理场景本身
        this.scene.clear()
    }

    // 清理渲染器
    private disposeRenderer(): void {
        if (this.renderer) {
            // 清理渲染器的渲染目标
            this.renderer.setRenderTarget(null)

            // 清理WebGL上下文
            this.renderer.dispose()

            // 强制垃圾回收WebGL资源
            const gl = this.renderer.getContext()
            if (gl && gl.getExtension) {
                const loseContext = gl.getExtension('WEBGL_lose_context')
                if (loseContext) {
                    loseContext.loseContext()
                }
            }

            // 从DOM中移除canvas
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
            }
        }
    }

    public onWindowResize(): void {
        // 更新相机的宽高比
        this.camera.aspect = this.config.dom.clientWidth / this.config.dom.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.config.dom.clientWidth, this.config.dom.clientHeight)
    }

    public async loadModel(modelUrl: string): Promise<void> {
        if (!this.model) {
            //! 加载模型 通过后缀判断模型类型并加载
            const modelType = modelUrl.split('.').pop()!.toLowerCase()
            switch (modelType) {
                case 'gltf':
                case 'glb': {
                    const loader = new GLTFLoader()
                    const gltf = await loader.loadAsync(modelUrl)
                    this.model = gltf.scene

                    // 处理材质和阴影
                    // this.setupModelMaterials(this.model)

                    // 居中模型
                    this.centerModel(this.model)

                    this.scene.add(this.model)
                    break
                }
                case 'obj': {
                    const loader = new OBJLoader()

                    // 自动推导MTL文件路径（与OBJ文件同路径同名，仅后缀不同）
                    const mtlUrl = modelUrl.replace(/\.obj$/i, '.mtl')
                    try {
                        const mtlLoader = new MTLLoader()

                        const materials = await mtlLoader.loadAsync(mtlUrl)
                        materials.preload()
                        loader.setMaterials(materials)

                        console.log('MTL材质加载成功:', materials)
                    } catch (error) {
                        console.warn('MTL材质加载失败，使用默认材质:', error)
                    }

                    const obj = await loader.loadAsync(modelUrl)
                    this.model = obj

                    // 处理OBJ材质和阴影
                    // this.setupModelMaterials(this.model, true)

                    // 居中模型
                    this.centerModel(this.model)

                    this.scene.add(this.model)
                    break
                }
                default:
                    console.error('模型格式不正确')
            }
        } else {
            console.error('模型已加载')
        }
    }

    // 设置模型材质和阴影
    private setupModelMaterials(model: Object3D, isOBJ: boolean = false): void {
        model.traverse((node: Object3D) => {
            if (node instanceof Mesh) {
                node.castShadow = true
                node.receiveShadow = true

                // 对于OBJ模型，需要特殊处理材质
                if (isOBJ) {
                    if (Array.isArray(node.material)) {
                        // 处理多材质情况
                        node.material.forEach((mat: any) => {
                            if (mat) {
                                this.enhanceMaterial(mat)
                            }
                        })
                    } else if (node.material) {
                        this.enhanceMaterial(node.material)
                    } else {
                        // 如果没有材质，设置默认材质
                        node.material = new MeshStandardMaterial({ color: 0xaaaaaa })
                    }
                } else {
                    // 对于GLTF/FBX模型
                    if (!node.material || !(node.material as any).map) {
                        // 如果没有贴图，设置默认材质
                        node.material = new MeshStandardMaterial({ color: 0xaaaaaa })
                    }
                }
            }
        })
    }

    // 增强材质属性
    private enhanceMaterial(material: any): void {
        if (material.isMeshPhongMaterial || material.isMeshLambertMaterial) {
            // 将旧材质转换为PBR材质以获得更好的光照效果
            const newMaterial = new MeshStandardMaterial({
                map: material.map,
                color: material.color,
                transparent: material.transparent,
                opacity: material.opacity,
                side: material.side
            })
            return newMaterial
        }

        // 确保材质支持阴影
        if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
            material.needsUpdate = true
        }
    }

    // 居中模型
    private centerModel(model: Object3D): void {
        // 计算模型的包围盒
        const box = new Box3().setFromObject(model)
        const center = box.getCenter(new Vector3())
        // 确保模型的变换原点也在几何中心
        // 对于复杂的模型层级，需要递归处理
        this.adjustModelPivot(model, center)
    }

    // 调整模型的变换原点
    private adjustModelPivot(model: Object3D, originalCenter: Vector3): void {
        // 对于有子对象的模型，确保所有子对象都相对于新的中心点
        model.traverse((child: Object3D) => {
            if (child !== model && child.parent === model) {
                // 调整直接子对象的位置，使其相对于新的中心点
                child.position.sub(originalCenter)
            }
        })

        // 更新模型的变换矩阵
        model.updateMatrixWorld(true)
    }
}
