<template>
    <div class="demo-ui norem">
        <ul class="tab-list">
            <li v-for="item in tabList" :key="item.id" @click="toggleTab(item.id)">
                <el-image :src="item.imgUrl"></el-image>
            </li>
        </ul>
        <SkySetting v-if="activeTab === TAB_ENUM.SKY" />
        <WeatherSetting v-else-if="activeTab === TAB_ENUM.WEATHER" />
    </div>
    <div class="operate-btns-container">
        <el-button @click="resetCamera">复位全景</el-button>
        <el-button @click="getCameraInfo">获取相机信息</el-button>
        <el-button :type="activeTool === 'point' ? 'success' : ''" @click="toolPoint"
            >点位标注工具</el-button
        >
        <el-button @click="getPoints">获取点位工具信息</el-button>
        <el-button @click="flyCircle">环绕飞行</el-button>
        <el-card class="btn-card">
            <div class="btn-box">
                <el-button @click="createCameraRoamingLayer">创建漫游图层</el-button>
                <el-button @click="addCurrentCamera">添加当前相机</el-button>
                <el-button @click="getRoamingPositions">获取所有视角</el-button>
                <el-button @click="startRoaming">开始全部飞行</el-button>
            </div>
        </el-card>
        <el-button @click="clearAll">清除所有</el-button>
        <el-button @click="testInfoModal">测试InfoModal定位</el-button>
        <el-button @click="testPdfViewer">测试PDF双页预览</el-button>
    </div>
    <!-- InfoModal测试 -->
    <InfoModal
        v-if="isShowInfoModal"
        :detail-data="testModalData"
        :detailScreenXY="testScreenXY"
        :triggerSize="testTriggerSize"
        @close="isShowInfoModal = false"
    />

    <!-- PDF预览测试 -->
    <div v-if="isShowPdfViewer" class="pdf-test-modal">
        <div class="pdf-test-content">
            <div class="pdf-test-header">
                <h3>PDF双页预览测试</h3>
                <button @click="isShowPdfViewer = false" class="close-btn">×</button>
            </div>
            <div class="pdf-test-body">
                <PdfViewer :fileUrl="testPdfUrl" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SkySetting from './components/skySetting.vue'
import WeatherSetting from './components/weatherSetting.vue'
import InfoModal from '@/components/commonPanel/InfoModal.vue'
import PdfViewer from '@/components/pdfViewer/index.vue'
import skyUrl from '@/assets/images/skySetting.png'
import weatherUrl from '@/assets/images/weatherSetting.png'
import { useDasUE } from '@/hooks/useDasUEHook'
import { ElMessageBox, ElMessage } from 'element-plus'

//tab
enum TAB_ENUM {
    SYSTEM,
    SKY,
    WEATHER,
    SEASON
}

const activeTab = ref<TAB_ENUM>()

const toggleTab = (tabEnum: TAB_ENUM) => {
    return activeTab.value == tabEnum ? (activeTab.value = null) : (activeTab.value = tabEnum)
}

const tabList = [
    { id: TAB_ENUM.SKY, label: '天空设置', imgUrl: skyUrl },
    { id: TAB_ENUM.WEATHER, label: '天气设置', imgUrl: weatherUrl }
]

let ueManager = null
let activeTool = ref('select') // 当前激活的工具
let romaingLayer = ref() // 相机漫游图层

// InfoModal测试相关
let isShowInfoModal = ref(false)
let testScreenXY = ref([0, 0])
let testTriggerSize = ref([200, 40]) // 按钮的大概尺寸
let testModalData = ref({
    name: '测试弹窗',
    description:
        '这是一个测试弹窗，用于验证根据detailScreenXY进行智能定位的功能。弹窗会根据点击位置和屏幕空间自动选择最佳的显示位置，确保不会超出屏幕边界。',
    video: '' // 可以为空，测试时不显示视频
})

// PDF测试相关
let isShowPdfViewer = ref(false)
let testPdfUrl = ref('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf') // 使用公开的测试PDF

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
    })
})

// 复位
const resetCamera = async () => {
    await ueManager.resetCamera()
}
// 获取相机信息
const getCameraInfo = async () => {
    const info = await ueManager.dasScene.getCameraFlyInfoLLH()
    // console.log('info', info)
    ElMessageBox.alert(
        `locationLLH:</div><div>[${info.locationLLH}]</div><br/><div>rotationLLH:</div><div>${JSON.stringify(
            info.rotationLLH
        )}</div></div>`,
        '获取相机信息',
        {
            dangerouslyUseHTMLString: true
        }
    )
}
// 点位标注工具
const toolPoint = async () => {
    if (activeTool.value == 'point') {
        activeTool.value = 'select'
        ueManager.dasPointsTool.finishTool()
        ueManager.dasSelectTool.setToCurrent()
    } else {
        activeTool.value = 'point'
        let param = {
            texturePath: 'D:/workfiles/UEWEB/图标/大屏版/locate.png',
            pointSize: [50, 50]
            // posLLH: [110.961461, 32.394071, 707]
        }
        ueManager.dasSelectTool.finishTool()
        ueManager.dasPointsTool.setToCurrent()
        ueManager.dasPointsTool.updateAll(param)
    }
}

const getPoints = async () => {
    const info = await ueManager.dasPointsTool.getPointPosition()
    console.log('点位标注工具信息', info)
    ElMessageBox.alert(`<div>[${info}]</div>`, '点位标注工具信息', {
        dangerouslyUseHTMLString: true
    })
}

// 清空所有
const clearAll = async () => {
    ueManager.dasPointsTool.finishTool()
    let rootGroup = await ueManager.dasGroupLayer.getRoot()
    rootGroup.removeAllLayer()
    romaingLayer.value = null
    activeTool.value = ''
}

// 创建相机漫游图层
const createCameraRoamingLayer = async () => {
    const result = await ueManager.dasCameraRoamingLayer.createInstance({ positions: [] })
    romaingLayer.value = result
}

const addCurrentCamera = async () => {
    if (romaingLayer.value) {
        const result = await romaingLayer.value.addCurrentCameraPosition()
        console.log('获取到的相机信息：', result)
    } else {
        ElMessage.warning('请先创建相机漫游图层！')
    }
}

const getRoamingPositions = async () => {
    if (romaingLayer.value) {
        const result = await romaingLayer.value.getAllPositionInfo()
        console.log('获取到的相机漫游信息：', result)
    } else {
        ElMessage.warning('请先创建相机漫游图层！')
    }
}

const startRoaming = async () => {
    if (romaingLayer.value) {
        romaingLayer.value.startFlightAll()
    } else {
        ElMessage.warning('请先创建相机漫游图层！')
    }
}

// 环绕飞行
const flyCircle = async () => {
    const info = await ueManager.dasPointsTool.getPointPosition()
    if (info[0] == 0 && info[1] == 0 && info[2] == 0) {
        return ElMessage.warning('请先用点位工具选取点位！')
    }
    const result = await ueManager.dasCameraRoamingCircleLayer.createInstance({
        rotationRadius: 100,
        cameraPitch: 30,
        flightTime: 20,
        loopFlight: true,
        longitude: info[0],
        latitude: info[1],
        height: info[2]
    })
    result.startCircleFlight()
}

// 测试InfoModal定位功能
const testInfoModal = (event: MouseEvent) => {
    // 获取点击位置的屏幕坐标
    const clickX = event.clientX
    const clickY = event.clientY

    // 设置测试坐标和显示弹窗
    testScreenXY.value = [clickX, clickY]
    isShowInfoModal.value = true

    console.log('测试InfoModal定位，点击坐标:', [clickX, clickY])
}

// 测试PDF双页预览功能
const testPdfViewer = () => {
    isShowPdfViewer.value = true
    console.log('打开PDF双页预览测试')
}
</script>

<style scoped lang="scss">
.set_btn {
    width: 36px;
    height: 36px;
    position: absolute;
    top: 62px;
    right: 45px;
    background-image: url('/src/assets/images/sysSetting.png');
    background-size: 100% 100%;
    cursor: pointer;
    z-index: 1;
}
.tab-list {
    position: absolute;
    list-style-type: none;
    top: 45px;
    right: 40px;
    z-index: 1;

    div {
        width: 46px;
        height: 152px;
        cursor: pointer;
        background-size: 100% 100%;
    }
}
.operate-btns-container {
    position: absolute;
    z-index: 999;
    left: 20px;
    top: 20px;
    display: flex;
    flex-direction: column;
    .el-button {
        margin: 10px 0;
        margin-left: 0;
    }
    :deep(.btn-card) {
        .el-card__body {
            padding: 5px;
        }
    }
    .btn-box {
        display: flex;
        flex-direction: column;
    }
}

.pdf-test-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;

    .pdf-test-content {
        width: 90%;
        height: 90%;
        background: #fff;
        border-radius: 8px;
        display: flex;
        flex-direction: column;

        .pdf-test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;

            h3 {
                margin: 0;
                color: #333;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;

                &:hover {
                    color: #333;
                }
            }
        }

        .pdf-test-body {
            flex: 1;
            padding: 20px;
            overflow: hidden;
        }
    }
}
</style>
