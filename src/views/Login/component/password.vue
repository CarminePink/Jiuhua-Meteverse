<template>
    <el-form
        size="large"
        class="auth-form password-auth-form"
        ref="loginFormRef"
        :rules="loginRules"
        :model="state.ruleForm"
        @keyup.enter="handleVerify"
    >
        <div class="auth-field">
            <div class="field-label">手机号/账号</div>
            <el-form-item prop="username">
                <el-input
                    class="login-input"
                    :placeholder="'请输入登录账号'"
                    v-model="state.ruleForm.username"
                    clearable
                    autocomplete="off"
                >
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <img src="@/assets/login/userIcon.png" />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </div>

        <div class="auth-field">
            <div class="field-header">
                <span class="field-label">密码</span>
                <button
                    type="button"
                    class="field-action"
                    @click="emit('change', LoginTypeEnum.RESETPASSWORD)"
                >
                    忘记密码?
                </button>
            </div>
            <el-form-item prop="password">
                <el-input
                    class="login-input"
                    :type="state.isShowPassword ? 'text' : 'password'"
                    :placeholder="'请输入您的密码'"
                    v-model="state.ruleForm.password"
                    autocomplete="off"
                >
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <img src="@/assets/login/lockIcon.png" />
                        </el-icon>
                    </template>
                    <template #suffix>
                        <el-icon
                            v-if="state.isShowPassword"
                            class="password-toggle"
                            size="20"
                            @click="state.isShowPassword = !state.isShowPassword"
                        >
                            <View />
                        </el-icon>
                        <el-icon
                            v-else
                            class="password-toggle"
                            size="20"
                            @click="state.isShowPassword = !state.isShowPassword"
                        >
                            <Hide />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </div>

        <div v-if="verifyImageEnable" class="auth-field">
            <div class="field-label">图形验证码</div>
            <div class="verification-row image-row">
                <el-form-item prop="code" class="verification-item">
                    <el-input
                        maxlength="4"
                        :placeholder="'请输入验证码'"
                        v-model="state.ruleForm.code"
                        clearable
                        autocomplete="off"
                    >
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <img src="@/assets/login/codeIcon.png" />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <img class="captcha-image" :src="imgSrc" @click="getVerifyImageCode" />
            </div>
        </div>

        <el-form-item class="submit-item">
            <el-button
                type="primary"
                class="login-content-submit"
                v-waves
                @click="handleVerify"
                :loading="loading"
            >
                <span class="button-text">登录</span>
            </el-button>
        </el-form-item>

        <button type="button" class="mode-switch" @click="emit('change', LoginTypeEnum.MOBILE)">
            <img src="@/assets/login/phoneIcon.png" />
            <span>手机验证码登录</span>
        </button>

        <div class="auth-footer" @click="emit('change', LoginTypeEnum.REGISTER)">
            <span>还没有账号？</span>
            <span class="auth-link">立即注册</span>
        </div>
    </el-form>
    <Verify
        @success="verifySuccess"
        :mode="'pop'"
        :captchaType="'blockPuzzle'"
        v-if="verifyEnable"
        :imgSize="{ width: '330px', height: '155px' }"
        ref="verifyref"
    />
</template>

<script setup lang="ts" name="password">
import { useUserInfo } from '@/stores/userInfo'
import { generateUUID } from '@/utils/other'
import { LoginTypeEnum } from '@/api/login'
import moment from 'moment'

// @ts-expect-error existing verify component lacks generated vue declaration in this repo
const Verify = defineAsyncComponent(() => import('@/components/Verifition/Verify.vue'))

const emit = defineEmits(['signInSuccess', 'change'])
const loginFormRef = ref()
const loading = ref(false)
const state = reactive({
    isShowPassword: false,
    ruleForm: {
        username: '',
        password: '',
        code: '',
        randomStr: 'blockPuzzle'
    }
})

const loginRules = reactive({
    username: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入登录账号'
        }
    ],
    password: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入您的密码'
        }
    ],
    code: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入验证码'
        }
    ]
})

const verifyref = ref()
const verifyEnable = ref(import.meta.env.VITE_VERIFY_ENABLE === 'true')
const verifyImageEnable = ref(import.meta.env.VITE_VERIFY_IMAGE_ENABLE === 'true')
const imgSrc = ref('')

const getVerifyImageCode = () => {
    state.ruleForm.randomStr = generateUUID()
    imgSrc.value = `${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : ''}/code/image?randomStr=${
        state.ruleForm.randomStr
    }`
}

const handleVerify = async () => {
    const valid = await loginFormRef.value.validate().catch(() => {})

    if (valid && verifyEnable.value && verifyref.value) {
        verifyref.value.show()
    } else if (valid) {
        onSignIn()
    }
}

const verifySuccess = (params: any) => {
    state.ruleForm.code = params.captchaVerification
    onSignIn()
}

const onSignIn = async () => {
    loading.value = true
    try {
        await useUserInfo().login(state.ruleForm)
        localStorage.setItem('loginDate', moment().format('YYYY-MM-DD HH:mm:ss'))
        emit('signInSuccess')
    } finally {
        loading.value = false
        if (verifyImageEnable.value) {
            getVerifyImageCode()
        }
    }
}

onMounted(() => {
    if (verifyImageEnable.value) {
        getVerifyImageCode()
    }
})
</script>

<style scoped lang="scss">
.auth-form {
    display: flex;
    flex-direction: column;
}

.auth-field {
    margin-bottom: 20px;
}

.field-label {
    display: block;
    margin-bottom: 10px;
    color: #4d6177;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
}

.field-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.field-action {
    padding: 0;
    border: 0;
    background: transparent;
    color: #0d5b98;
    font-size: 14px;
    cursor: pointer;
}

.verification-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.verification-item {
    flex: 1;
}

.captcha-image {
    width: 116px;
    height: 58px;
    border-radius: 12px;
    object-fit: cover;
    cursor: pointer;
}

.submit-item {
    margin-top: 10px;
    margin-bottom: 0;
}

.login-content-submit {
    width: 100%;
    height: 58px;
    border: 0;
    border-radius: 16px;
    background: #0a3860;
    box-shadow: 0 12px 24px 0 rgba(5, 102, 79, 0.2);
}

.button-text {
    color: #fff;
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 2px;
}

.mode-switch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-top: 24px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #0d5b98;
    font-size: 15px;
    cursor: pointer;
}

.mode-switch img {
    width: 18px;
    height: 18px;
}

.auth-footer {
    margin-top: 12px;
    text-align: center;
    color: #8f989e;
    font-size: 15px;
    cursor: pointer;
}

.auth-link {
    margin-left: 8px;
    color: #0d5b98;
}

.password-toggle {
    cursor: pointer;
    color: #96a7ae;
}

:deep(.el-form-item) {
    margin-bottom: 0;
}

:deep(.el-form-item__content) {
    align-items: flex-start;
}

:deep(.el-form-item__error) {
    padding-top: 8px;
}

:deep(.el-input) {
    width: 100%;
}

:deep(.el-input__wrapper) {
    min-height: 58px;
    padding: 0 18px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: none;
}

:deep(.el-input__inner) {
    color: #53606c;
    font-size: 16px;
}

:deep(.el-input__inner::placeholder) {
    color: #c8ced0;
}

:deep(.el-input__prefix-inner .el-icon),
:deep(.el-input__suffix-inner .el-icon) {
    font-size: 18px;
}

:deep(.el-input__prefix-inner .el-icon img) {
    width: 18px;
    height: 18px;
    opacity: 0.72;
}

@media (max-width: 640px) {
    .auth-field {
        margin-bottom: 16px;
    }

    .captcha-image {
        width: 104px;
        height: 54px;
    }

    :deep(.el-input__wrapper) {
        min-height: 54px;
    }
}
</style>
