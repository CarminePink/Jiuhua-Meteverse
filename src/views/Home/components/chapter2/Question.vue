<template>
    <div v-if="visible" class="question-modal">
        <div class="question-panel">
            <button class="btn-close" type="button" @click="handleClose">
                <img :src="closeIcon" alt="关闭" />
            </button>

            <template v-if="stage === 'question'">
                <div class="question-title">闯关答题</div>
                <div v-if="isLoading" class="status-text">题目加载中...</div>
                <div v-else-if="loadError" class="status-text">{{ loadError }}</div>
                <div v-else-if="!currentQuestion" class="status-text">暂无可用题目</div>
                <div v-else class="question-content">
                    <p class="question-text">{{ currentQuestion.question }}</p>
                    <div class="option-list">
                        <button
                            v-for="option in currentQuestion.options"
                            :key="option"
                            class="option-item"
                            :class="getOptionClass(option)"
                            type="button"
                            :disabled="isLocked"
                            @click="handleAnswer(option)"
                        >
                            {{ option }}
                        </button>
                    </div>
                </div>

                <div v-if="currentQuestion" class="question-footer">
                    <div class="answer-feedback" :class="feedbackClass">{{ feedbackText }}</div>
                    <div class="progress-text">
                        第{{ currentIndex + 1 }}/{{ totalCount }}题：
                        <span class="time-text">{{ remainingSeconds }}秒</span>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="result-title">恭喜你完成答题挑战！</div>
                <div class="result-content">
                    <img class="result-decorate" :src="decorateIcon" alt="装饰图" />
                    <div class="result-summary">
                        <p>共{{ totalCount }}题，答对{{ correctCount }}题</p>
                        <p>
                            获得
                            <span class="coin-text">{{ rewardCoins }}</span>
                            心愿币！
                        </p>
                    </div>
                </div>
                <button
                    class="btn-complete"
                    type="button"
                    :style="{ backgroundImage: `url(${buttonBg})` }"
                    @click="handleCompleted"
                >
                    完成
                </button>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import closeIcon from '@/assets/images/tool/icon_close.png'
import buttonBg from '@/assets/images/tool/btn_bg.png'
import decorateIcon from '@/assets/images/tool/icon_decorate.png'
import { getChallengeList } from '@/api/home'
import { useMessage } from '@/hooks/message'

interface QuestionItem {
    question: string
    options: string[]
    answer: string
}

interface ChallengeQuestionItem {
    id: number
    questionName: string
    belongId?: number
    optionA?: string
    optionB?: string
    optionC?: string
    optionD?: string
    correctOption: string
}

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    close: []
    completed: [payload: { correctCount: number; totalCount: number; rewardCoins: number }]
}>()

const message = useMessage()
const stage = ref<'question' | 'result'>('question')
const questionList = ref<QuestionItem[]>([])
const currentIndex = ref(0)
const remainingSeconds = ref(30)
const correctCount = ref(0)
const selectedOption = ref('')
const feedbackText = ref('')
const isLocked = ref(false)
const isLoading = ref(false)
const loadError = ref('')

let countdownTimer: ReturnType<typeof setInterval> | null = null
let switchTimer: ReturnType<typeof setTimeout> | null = null
let latestRequestToken = 0

const totalCount = computed(() => questionList.value.length)

const currentQuestion = computed<QuestionItem | null>(() => {
    return questionList.value[currentIndex.value] ?? null
})

const rewardCoins = computed(() => {
    return correctCount.value * 25
})

const feedbackClass = computed(() => {
    if (!feedbackText.value) return ''
    return feedbackText.value === '回答正确' ? 'is-correct' : 'is-wrong'
})

const normalizeChallengeList = (response: any): ChallengeQuestionItem[] => {
    const payload = response?.data ?? response ?? []

    if (Array.isArray(payload)) {
        return payload as ChallengeQuestionItem[]
    }

    if (Array.isArray(payload?.list)) {
        return payload.list as ChallengeQuestionItem[]
    }

    if (Array.isArray(payload?.rows)) {
        return payload.rows as ChallengeQuestionItem[]
    }

    return []
}

const formatQuestionList = (list: ChallengeQuestionItem[]): QuestionItem[] => {
    return list.map(item => {
        const optionEntries = [
            ['A', item.optionA],
            ['B', item.optionB],
            ['C', item.optionC],
            ['D', item.optionD]
        ]

        return {
            question: item.questionName,
            options: optionEntries
                .filter(([, value]) => Boolean(value))
                .map(([key, value]) => `${key}. ${value}`),
            answer: String(item.correctOption || '')
                .trim()
                .toUpperCase()
        }
    })
}

const loadQuestions = async () => {
    const requestToken = ++latestRequestToken

    isLoading.value = true
    loadError.value = ''

    try {
        const response = await getChallengeList()
        if (requestToken !== latestRequestToken) return

        questionList.value = formatQuestionList(normalizeChallengeList(response))
    } catch (error: any) {
        if (requestToken !== latestRequestToken) return

        questionList.value = []
        loadError.value = error?.msg || '题目加载失败，请稍后重试'
        message.error(loadError.value)
    } finally {
        if (requestToken === latestRequestToken) {
            isLoading.value = false
        }
    }
}

const clearTimers = () => {
    if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }

    if (switchTimer) {
        clearTimeout(switchTimer)
        switchTimer = null
    }
}

const startCountdown = () => {
    clearTimers()
    countdownTimer = setInterval(() => {
        if (remainingSeconds.value <= 1) {
            remainingSeconds.value = 0
            goToNextQuestion()
            return
        }

        remainingSeconds.value -= 1
    }, 1000)
}

const resetCurrentQuestionState = () => {
    selectedOption.value = ''
    feedbackText.value = ''
    isLocked.value = false
    remainingSeconds.value = 30
}

const initQuiz = async () => {
    clearTimers()
    stage.value = 'question'
    currentIndex.value = 0
    correctCount.value = 0
    resetCurrentQuestionState()

    await loadQuestions()

    if (!questionList.value.length) {
        return
    }

    startCountdown()
}

const goToNextQuestion = () => {
    clearTimers()

    if (currentIndex.value >= totalCount.value - 1) {
        stage.value = 'result'
        return
    }

    currentIndex.value += 1
    resetCurrentQuestionState()
    startCountdown()
}

const parseOptionKey = (option: string) => {
    return option.split('.')[0]?.trim() || ''
}

const handleAnswer = (option: string) => {
    if (isLocked.value || stage.value !== 'question' || !currentQuestion.value) return

    isLocked.value = true
    selectedOption.value = option

    const isCorrect = parseOptionKey(option) === currentQuestion.value.answer
    if (isCorrect) {
        correctCount.value += 1
    }

    feedbackText.value = isCorrect ? '回答正确' : '回答错误'
    clearTimers()
    switchTimer = setTimeout(() => {
        goToNextQuestion()
    }, 800)
}

const getOptionClass = (option: string) => {
    if (!selectedOption.value || !currentQuestion.value) return ''
    if (selectedOption.value !== option) return ''

    return parseOptionKey(option) === currentQuestion.value.answer ? 'is-correct' : 'is-wrong'
}

const handleClose = () => {
    clearTimers()
    emit('close')
}

const handleCompleted = () => {
    clearTimers()
    emit('completed', {
        correctCount: correctCount.value,
        totalCount: totalCount.value,
        rewardCoins: rewardCoins.value
    })
}

watch(
    () => props.visible,
    visible => {
        if (visible) {
            void initQuiz()
            return
        }

        latestRequestToken += 1
        clearTimers()
    }
)

onBeforeUnmount(() => {
    clearTimers()
})
</script>

<style scoped lang="scss">
.question-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    width: min(760px, calc(100vw - 32px));
    pointer-events: auto;
}

.question-panel {
    position: relative;
    min-height: 500px;
    padding: 28px 28px 36px;
    border: 1px solid rgba(217, 232, 247, 0.45);
    border-radius: 14px;
    background:
        linear-gradient(180deg, rgba(35, 78, 122, 0.84) 0%, rgba(14, 48, 84, 0.84) 100%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(8px);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.16), transparent 28%),
            radial-gradient(circle at 80% 12%, rgba(255, 255, 255, 0.12), transparent 24%);
        pointer-events: none;
    }
}

.btn-close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        display: block;
    }
}

.question-title,
.result-title {
    position: relative;
    z-index: 1;
    margin-top: 18px;
    color: #fff;
    font-family: 'Source Han Serif CN', serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.4;
    text-align: center;
}

.question-content {
    position: relative;
    z-index: 1;
    margin-top: 28px;
}

.status-text {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    margin-top: 28px;
    color: rgba(255, 255, 255, 0.92);
    font-family: 'Source Han Serif CN', serif;
    font-size: 18px;
    line-height: 1.8;
    text-align: center;
}

.question-text {
    margin: 0;
    color: rgba(255, 255, 255, 0.95);
    font-family: 'Source Han Serif CN', serif;
    font-size: 18px;
    line-height: 1.8;
    letter-spacing: 0.5px;
}

.option-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 24px;
}

.option-item {
    padding: 10px 0;
    border: 0;
    background: transparent;
    color: rgba(255, 250, 240, 0.94);
    font-family: 'Source Han Serif CN', serif;
    font-size: 18px;
    line-height: 1.8;
    text-align: left;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover:not(:disabled) {
        color: #ffd082;
    }

    &:disabled {
        cursor: default;
    }

    &.is-correct {
        color: #ffe09b;
    }

    &.is-wrong {
        color: #ffb2a5;
    }
}

.question-footer {
    position: absolute;
    right: 24px;
    bottom: 20px;
    left: 24px;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
}

.answer-feedback {
    min-height: 28px;
    color: transparent;
    font-size: 18px;
    line-height: 1.5;

    &.is-correct {
        color: #ffe09b;
    }

    &.is-wrong {
        color: #ffb2a5;
    }
}

.progress-text {
    color: rgba(255, 255, 255, 0.96);
    font-size: 16px;
    line-height: 1.5;
    white-space: nowrap;
}

.time-text {
    color: #ff3131;
}

.result-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
    min-height: 380px;
    margin-top: 12px;
}

.result-decorate {
    width: 90px;
    object-fit: contain;
}

.result-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    color: #fff;
    font-family: 'Source Han Serif CN', serif;
    font-size: 20px;
    line-height: 1.8;

    p {
        margin: 0;
    }
}

.coin-text {
    color: #ff3131;
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
    padding: 0 2px;
}

.btn-complete {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 135px;
    height: 44px;
    border: 0;
    background-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
    z-index: 2;
}

@media (max-width: 768px) {
    .question-panel {
        min-height: 440px;
        padding: 24px 20px 28px;
    }

    .question-title,
    .result-title {
        padding-right: 28px;
        padding-left: 28px;
        font-size: 20px;
    }

    .question-text,
    .option-item {
        font-size: 16px;
    }

    .question-footer {
        position: relative;
        right: auto;
        bottom: auto;
        left: auto;
        margin-top: 24px;
        flex-direction: column;
        align-items: flex-start;
    }

    .result-content {
        flex-direction: column;
        gap: 20px;
        min-height: 0;
        padding: 24px 0 6px;
    }

    .result-decorate {
        width: 140px;
        max-width: none;
    }

    .result-summary {
        align-items: center;
        text-align: center;
        font-size: 18px;
    }
}
</style>
