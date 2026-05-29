<template>
    <div class="select-container">
        <div class="select-content">
            <div class="card-wrapper">
                <div
                    class="card-item"
                    :class="{ active: selectedRole === 'female' }"
                    @click="selectedRole = 'female'"
                >
                    <img
                        class="card-bg"
                        :src="selectedRole === 'female' ? cardActiveBg : cardBg"
                        alt=""
                    />
                    <img
                        class="card-character"
                        src="@/assets/images/select/female.png"
                        alt="女性角色"
                    />
                </div>
                <div
                    class="card-item"
                    :class="{ active: selectedRole === 'male' }"
                    @click="selectedRole = 'male'"
                >
                    <img
                        class="card-bg"
                        :src="selectedRole === 'male' ? cardActiveBg : cardBg"
                        alt=""
                    />
                    <img
                        class="card-character"
                        src="@/assets/images/select/male.png"
                        alt="男性角色"
                    />
                </div>
            </div>
            <img
                class="btn-enter"
                src="@/assets/images/select/icon_enter.png"
                alt="进入"
                @click="handleEnter"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDasUE } from '@/hooks/useDasUEHook'
import cardBg from '@/assets/images/select/card_bg.png'
import cardActiveBg from '@/assets/images/select/card_active_bg.png'
import { saveRoleGender } from '@/api/select/index'
import { resolveRetainedQueryFromRoute } from '@/router/query'

const router = useRouter()
const route = useRoute()
const selectedRole = ref<'male' | 'female' | ''>('')

let ueManager: any = null

const handleEnter = () => {
    if (!selectedRole.value) return

    const isMale = selectedRole.value === 'male'
    const retainedQuery = resolveRetainedQueryFromRoute(route)

    ueManager.dasCustomMessage.MessageFromWeb('SetRoleMale', isMale)
    router.push({
        path: '/home',
        query: retainedQuery
    })

    saveRoleGender({ characterGender: isMale ? 0 : 1 })
}

onMounted(() => {
    const { dasUE, onViewerReady } = useDasUE()
    onViewerReady(() => {
        ueManager = dasUE
    })
})
</script>

<style scoped lang="scss">
.select-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .select-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 100;
    }

    .card-wrapper {
        display: flex;
        gap: 80px;
        margin: 70px 0 60px;
    }

    .card-item {
        position: relative;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.03);
        }

        .card-bg {
            width: 280px;
            display: block;
        }

        .card-character {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            height: 70%;
            pointer-events: none;
        }
    }

    .btn-enter {
        width: 200px;
        cursor: pointer;
        transition:
            transform 0.2s ease,
            opacity 0.2s ease;

        &:hover {
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.97);
        }
    }
}
</style>
