export const createGuid = () => {
    const timestamp = new Date().getTime().toString(16)
    const randomPart = Math.floor(Math.random() * 0xffffffff).toString(16)
    return `${timestamp.padStart(12, '0')}-${randomPart.padStart(8, '0')}-${Math.floor(
        Math.random() * 0xffff
    )
        .toString(16)
        .padStart(4, '0')}-${Math.floor(Math.random() * 0xffff)
        .toString(16)
        .padStart(4, '0')}`
}

export const calculateModalPosition = (
    detailScreenXY: number[],
    triggerSize: number[] = [100, 80]
) => {
    // 确保坐标值为数字类型
    const clickX = Number(detailScreenXY[0]) || 0
    const clickY = Number(detailScreenXY[1]) || 0

    // 获取视口尺寸
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // 获取当前rem基准值（amfe-flexible设置的）
    const htmlFontSize = parseFloat(
        document.documentElement.style.fontSize ||
            getComputedStyle(document.documentElement).fontSize ||
            '16'
    )

    // 弹窗尺寸（rem转换为px，rootValue=960）
    const actualModalWidth = (3400 / 960) * htmlFontSize
    const actualModalHeight = (1600 / 960) * htmlFontSize

    // 安全边距
    const margin = 20

    // 获取触发元素的尺寸
    const triggerWidth = Number(triggerSize[0]) || 100
    const triggerHeight = Number(triggerSize[1]) || 80

    let left = 0
    let top = 0

    // 优先级：右侧 > 左侧 > 下方 > 上方
    // 1. 尝试在右侧显示
    if (clickX + triggerWidth + actualModalWidth + margin <= viewportWidth) {
        left = clickX + triggerWidth
        // 垂直居中对齐触发元素
        top = Math.max(
            margin,
            Math.min(
                clickY + triggerHeight / 2 - actualModalHeight / 2,
                viewportHeight - actualModalHeight - margin
            )
        )
    } else if (clickX - triggerWidth - actualModalWidth - margin >= 0) {
        // 2. 尝试在左侧显示
        left = clickX - actualModalWidth - triggerWidth
        // 垂直居中对齐触发元素
        top = Math.max(
            margin,
            Math.min(
                clickY + triggerHeight / 2 - actualModalHeight / 2,
                viewportHeight - actualModalHeight - margin
            )
        )
    } else if (clickY + triggerHeight + actualModalHeight + margin <= viewportHeight) {
        // 3. 尝试在下方显示
        top = clickY + triggerHeight
        // 水平居中对齐触发元素
        left = Math.max(
            margin,
            Math.min(
                clickX + triggerWidth / 2 - actualModalWidth / 2,
                viewportWidth - actualModalWidth - margin
            )
        )
    } else if (clickY - actualModalHeight - margin >= 0) {
        // 4. 尝试在上方显示
        top = clickY - actualModalHeight
        // 水平居中对齐触发元素
        left = Math.max(
            margin,
            Math.min(
                clickX + triggerWidth / 2 - actualModalWidth / 2,
                viewportWidth - actualModalWidth - margin
            )
        )
    } else {
        // 5. 如果都放不下，则居中显示并确保不超出边界
        left = Math.max(
            margin,
            Math.min(
                clickX + triggerWidth / 2 - actualModalWidth / 2,
                viewportWidth - actualModalWidth - margin
            )
        )
        top = Math.max(
            margin,
            Math.min(
                clickY + triggerHeight / 2 - actualModalHeight / 2,
                viewportHeight - actualModalHeight - margin
            )
        )
    }

    return { left, top, actualModalWidth, actualModalHeight }
}

// 根据缩放比例,计算点位图标大小
export const getAdaptiveSize = (pointSize: number[]) => {
    const zoomScale = window.innerWidth / window.webConfig.screenWidth
    return pointSize.map(size => size * zoomScale)
}

export const getAdaptiveSizeNumber = (pointSize: number) => {
    const zoomScale = window.innerWidth / window.webConfig.screenWidth
    return pointSize * zoomScale
}

// 生成查询字符串的函数
export const generateSearchParams = (item: any): string => {
    const params = new URLSearchParams()
    for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key) && item[key]) {
            params.append(key, item[key])
        }
    }
    return params.toString()
}
