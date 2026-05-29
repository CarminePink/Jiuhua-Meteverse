<template>
    <div class="time-tool-bar">
        <div class="time-str">{{ timeStr }}</div>
        <div class="day-str-content">
            <div class="week-str">{{ weekStr }}</div>
            <div class="day-str">{{ dayStr }}</div>
        </div>
        <!-- <img class="weather-icon" src="@/assets/images/tool/icon_sun.png" /> -->
    </div>
</template>

<script setup lang="ts">
import { dayjs } from 'element-plus'

let timeStr = ref('')
let dayStr = ref('')
let weekStr = ref('')

// 更新时间
const updateTime = () => {
    const now = dayjs()
    timeStr.value = now.format('HH:mm:ss')
    dayStr.value = now.format('YYYY-MM-DD')
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六']
    weekStr.value = '星期' + daysOfWeek[now.get('day')]
}

onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
})
</script>

<style lang="scss" scoped>
.time-tool-bar {
    display: flex;
    align-items: center;
    .time-str {
        font-size: 50px;
        color: #fff;
        margin-right: 52px;
        font-family: '';
    }
    .day-str-content {
        text-align: center;
        margin-right: 52px;
        .week-str {
            font-size: 40px;
            color: #ffffff;
            font-weight: bold;
        }
        .day-str {
            font-size: 24px;
            color: #fff;
            font-family: '';
        }
    }
    .weather-icon {
        width: 50px;
        height: 50px;
    }
}
</style>
