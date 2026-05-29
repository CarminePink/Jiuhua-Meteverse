<template>
    <Teleport to=".app-wrapper">
        <div v-show="mapStore.isShowMap" class="map-tool-popup">
            <button type="button" class="map-close-btn" aria-label="关闭地图" @click="closeMap">
                ×
            </button>
            <div class="map-container">
                <img class="map-image" :src="mapImg" alt="九华山景区手绘地图" />
                <button
                    v-for="poi in poiList"
                    :key="poi.name"
                    type="button"
                    class="map-point"
                    :class="{ active: poi.name === activeMarker }"
                    :style="{ left: poi.left, top: poi.top }"
                    :aria-label="poi.name"
                    :title="poi.name"
                    @click="handleMarkerClick(poi.name)"
                >
                    <span class="map-point-dot"></span>
                    <span v-if="poi.name === activeMarker" class="map-point-name">
                        {{ poi.name }}
                    </span>
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import mapImg from '@/assets/images/tool/map.png'
import { useMapStore } from '@/stores/map'

interface POI {
    name: string
    left: string
    top: string
}

const mapStore = useMapStore()

const poiList: POI[] = [
    { name: '化城寺', left: '22.5%', top: '57.5%' },
    { name: '月身殿', left: '23%', top: '84.5%' },
    { name: '百岁宫', left: '88.8%', top: '33%' },
    { name: '祇园寺', left: '55%', top: '30.5%' }
]

const activeMarker = computed(() => mapStore.activeMarker)

const handleMarkerClick = (name: string) => {
    mapStore.requestChapterJump(name)
    closeMap()
}

const closeMap = () => {
    mapStore.setShowMap(false)
}
</script>

<style lang="scss" scoped>
.map-tool-popup {
    position: absolute;
    top: 147px;
    right: 126px;
    width: 400px;
    height: 480px;
    padding: 10px;
    border-radius: 10px;
    border: 1.5px solid rgba(252, 223, 165, 0);
    background: rgba(7, 51, 91, 0.7);
    backdrop-filter: blur(2.5px);
    z-index: 3000;
}

.map-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
}

.map-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
    user-select: none;
    -webkit-user-drag: none;
}

.map-close-btn {
    position: absolute;
    top: 20px;
    right: 18px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    z-index: 2;
}

.map-point {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    transform: translate(-50%, -50%);
    cursor: pointer;
}

.map-point-dot {
    width: 18px;
    height: 18px;
    border: 4px solid #1777b6;
    border-radius: 50%;
    background: #f7fbff;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.45);
    transition: all 0.2s ease;
}

.map-point.active {
    width: 34px;
    height: 34px;
}

.map-point.active .map-point-dot {
    width: 24px;
    height: 24px;
    border-width: 5px;
    border-color: #e8b14a;
    background: radial-gradient(circle at center, #ffffff 0 28%, #f7fbff 28% 60%, #e8b14a 60% 100%);
    box-shadow: 0 0 8px 4px rgba(232, 177, 74, 0.5);
    animation: breathe 1.5s ease-in-out infinite;
}

@keyframes breathe {
    0%,
    100% {
        box-shadow: 0 0 8px 4px rgba(232, 177, 74, 0.5);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 18px 10px rgba(232, 177, 74, 0.35);
        transform: scale(1.15);
    }
}

.map-point-name {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 10px;
    border: 1px solid rgba(214, 137, 34, 0.25);
    border-radius: 999px;
    background: rgba(255, 249, 237, 0.96);
    color: #b35d15;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    box-shadow: 0 6px 16px rgba(12, 45, 73, 0.15);
    pointer-events: none;
}
</style>
