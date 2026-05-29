<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import StepCon from './step.vue'
defineProps<{ msg: string }>()

const curCamera = ref('map')

const onMessage = inject('onMessage')
const subShareData = inject('subShareData')
// const getShareData = inject('getShareData')

const showStepCon = ref(false)

subShareData('viewerReady', (key, value) => {
    if (value) {
        onMessage({ action: 'GetSequenceKeys', data: 0 })
        onMessage({ action: 'GetPresetViewKeys', data: 0 })
    }
})

const sequenceKeys = ref(new Set())

subShareData('sequenceKeys', (key, value) => {
    if (value) {
        sequenceKeys.value = new Set(value)
    }
})

const presetViewKeys = ref(new Set())
subShareData('presetViewKeys', (key, value) => {
    if (value) {
        presetViewKeys.value = new Set(value)
    }
})

// let counter = 0

const changeCamera = camera => {
    if (camera == 'free') {
        onMessage({ action: 'RemoteSetVisibility', data: false })
        onMessage({ action: 'SwitchCamera', data: -1 })
        if (showStepCon.value) {
            showStepCon.value = false
            const cameraSetting = document.querySelector('.camera_setting')
            if (cameraSetting) {
                cameraSetting.classList.remove('move-up')
            }
        }
    } else if (camera == 'tourist') {
        onMessage({ action: 'RemoteSetVisibility', data: false })
        onMessage({ action: 'SwitchCamera', data: 1 })
        if (showStepCon.value) {
            showStepCon.value = false
            const cameraSetting = document.querySelector('.camera_setting')
            if (cameraSetting) {
                cameraSetting.classList.remove('move-up')
            }
        }
    } else if (camera == 'map') {
        onMessage({ action: 'RemoteSetVisibility', data: false })
        onMessage({ action: 'SwitchCamera', data: 0 })
        if (showStepCon.value) {
            showStepCon.value = false
            const cameraSetting = document.querySelector('.camera_setting')
            if (cameraSetting) {
                cameraSetting.classList.remove('move-up')
            }
        }
    } else if (camera == 'fly') {
        const cameraSetting = document.querySelector('.camera_setting')
        if (cameraSetting) {
            cameraSetting.classList.add('move-up')
            setTimeout(() => {
                showStepCon.value = true // Show StepCon
            }, 500)
        }
        onMessage({ action: 'RemoteSetVisibility', data: true })
        onMessage({ action: 'CameraHide', data: true })

        // if (sequenceKeys.value.size > 0) {
        // 	const sequenceKeysArray = Array.from(sequenceKeys.value)
        // 	onMessage({ action: 'PlaySequence', data: sequenceKeysArray[0] })
        // }
    }
}

watch(
    () => curCamera.value,
    newValue => {
        switch (newValue) {
            case 'free':
                changeCamera('free')
                break
            case 'map':
                changeCamera('map')
                break
            case 'fly':
                changeCamera('fly')
                break
            case 'tourist':
                changeCamera('tourist')
                break
            default:
                break
        }
    }
)

// const setFlyCamera = () => {
//     curCamera.value = 'fly'

//     if (sequenceKeys.value.size > 0 || presetViewKeys.value.size > 0) {
//         const sequenceKeysArray = Array.from(sequenceKeys.value)
//         const presetViewKeysArray = Array.from(presetViewKeys.value)
//         if (counter >= sequenceKeysArray.length + presetViewKeysArray.length) {
//             counter = 0
//         }

//         setTimeout(() => {
//             if (counter < presetViewKeysArray.length) {
//                 onMessage({
//                     action: 'SetPresetView',
//                     data: presetViewKeysArray[counter]
//                 })
//             } else {
//                 onMessage({
//                     action: 'PlaySequence',
//                     data: sequenceKeysArray[counter - sequenceKeysArray.length]
//                 })
//             }
//             counter = counter + 1
//         }, 1000)
//     }
// }
</script>

<template>
    <div class="camera_setting">
        <div
            class="map"
            :class="curCamera == 'map' ? 'map_sel' : ''"
            @click="curCamera = 'map'"
        ></div>
        <div
            class="tourist"
            :class="curCamera == 'tourist' ? 'tourist_sel' : ''"
            @click="curCamera = 'tourist'"
        ></div>
        <div
            class="fly"
            :class="curCamera == 'fly' ? 'fly_sel' : ''"
            @click="curCamera = 'fly'"
        ></div>
        <div
            class="free"
            :class="curCamera == 'free' ? 'free_sel' : ''"
            @click="curCamera = 'free'"
        ></div>
        <div class="pointer" :class="`pointer-${curCamera}`"></div>
    </div>
    <Transition name="fade">
        <StepCon v-if="showStepCon"></StepCon>
    </Transition>
</template>

<style scoped>
.camera_setting {
    transition: transform 0.5s ease;
    /* Animation for moving up */
    position: absolute;
    width: 156px;
    height: 130px;
    bottom: 45px;
    right: 90px;
    z-index: 1;

    .map {
        cursor: pointer;
        position: absolute;
        left: 29px;
        top: -19px;
        width: 99px;
        height: 74px;
        background: url(/src/assets/images/mapCamera.png);
        background-size: 100% 100%;
    }

    .map_sel {
        background: url(/src/assets/images/mapCamera_active.png);
        background-size: 100% 100%;
    }

    .tourist {
        cursor: pointer;
        position: absolute;
        left: 0px;
        top: 10px;
        width: 74px;
        height: 99px;
        background: url(/src/assets/images/touristCamera.png);
        background-size: 100% 100%;
    }

    .tourist_sel {
        background: url(/src/assets/images/touristCamera_active.png);
        background-size: 100% 100%;
    }

    .fly {
        cursor: pointer;
        position: absolute;
        left: 29px;
        bottom: -7px;
        width: 99px;
        height: 74px;
        background: url(/src/assets/images/flyCamera.png);
        background-size: 100% 100%;
    }

    .fly_sel {
        background: url(/src/assets/images/flyCamera_active.png);
        background-size: 100% 100%;
    }

    .free {
        cursor: pointer;
        position: absolute;
        right: 0px;
        top: 10px;
        width: 74px;
        height: 99px;
        background: url(/src/assets/images/freeCamera.png);
        background-size: 100% 100%;
    }

    .free_sel {
        background: url(/src/assets/images/freeCamera_active.png);
        background-size: 100% 100%;
    }

    .pointer {
        position: absolute;
        left: 50px;
        top: 33px;
        width: 55px;
        height: 55px;
        background: url(/src/assets/images/cursor.png);
        background-size: 100% 100%;
    }

    .pointer-tourist {
        transform: rotate(5deg);
    }
    .pointer-map {
        transform: rotate(95deg);
    }
    .pointer-free {
        transform: rotate(185deg);
    }
    .pointer-fly {
        transform: rotate(275deg);
    }
}

.move-up {
    transform: translateY(-130px);
    /* Adjust the value as needed */
}

.move-down {
    transform: translateY(130px);
    /* Adjust the value as needed */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
}
</style>
