<template>
    <el-form
        size="large"
        class="auth-form mobile-auth-form"
        ref="loginFormRef"
        :rules="loginRules"
        :model="loginForm"
        @keyup.enter="handleLogin"
    >
        <div class="auth-field">
            <div class="field-label">手机号</div>
            <el-form-item prop="mobile">
                <el-input
                    class="login-input"
                    :placeholder="'请输入您的手机号码'"
                    v-model="loginForm.mobile"
                    clearable
                    autocomplete="off"
                >
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <img src="@/assets/login/phoneIcon.png" />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </div>

        <div class="auth-field">
            <div class="field-label">验证码</div>
            <div class="verification-row">
                <el-form-item prop="code" class="verification-item">
                    <el-input
                        class="login-input"
                        maxlength="4"
                        :placeholder="'验证码'"
                        v-model="loginForm.code"
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
                <el-button
                    v-waves
                    @click="handleSendCode"
                    :loading="msg.msgKey"
                    class="send-code-button"
                >
                    {{ msg.msgText }}
                </el-button>
            </div>
        </div>

        <el-form-item class="submit-item">
            <el-button
                type="primary"
                class="login-content-submit"
                v-waves
                @click="handleLogin"
                :loading="loading"
            >
                <span class="button-text">登录</span>
            </el-button>
        </el-form-item>

        <button type="button" class="mode-switch" @click="emit('change', LoginTypeEnum.PASSWORD)">
            <img src="@/assets/login/rebackIcon.png" class="mode-switch-icon" />
            <span>账号密码登录</span>
        </button>

        <div class="auth-footer">
            <span>还没有账号？</span>
            <span class="auth-link" @click="emit('change', LoginTypeEnum.REGISTER)">立即注册</span>
        </div>
    </el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { LoginTypeEnum, sendMobileCode } from '@/api/login'
import { useMessage } from '@/hooks/message'
import { useUserInfo } from '@/stores/userInfo'
import { rule } from '@/utils/validate'

const emit = defineEmits(['signInSuccess', 'change'])

const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
    mobile: '',
    code: ''
})

const loginRules = reactive({
    mobile: [{ required: true, trigger: 'blur', validator: rule.validatePhone }],
    code: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入验证码'
        }
    ]
})

const handleSendCode = async () => {
    const valid = await loginFormRef.value.validateField('mobile').catch(() => {})
    if (!valid) return

    const response = await sendMobileCode(loginForm.mobile)
    if ((response as any).data) {
        useMessage().success('验证码发送成功')
        timeCacl()
    } else {
        useMessage().error((response as any).msg || '验证码发送失败')
    }
}

const handleLogin = async () => {
    const valid = await loginFormRef.value.validate().catch(() => {})
    if (!valid) return

    try {
        loading.value = true
        await useUserInfo().loginByMobile(loginForm)
        emit('signInSuccess')
    } finally {
        loading.value = false
    }
}

const msg = reactive({
    msgText: '获取验证码',
    msgTime: 60,
    msgKey: false
})

const timeCacl = () => {
    msg.msgText = `${msg.msgTime}秒后重发`
    msg.msgKey = true
    const time = setInterval(() => {
        msg.msgTime--
        msg.msgText = `${msg.msgTime}秒后重发`
        if (msg.msgTime === 0) {
            msg.msgTime = 60
            msg.msgText = '获取验证码'
            msg.msgKey = false
            clearInterval(time)
        }
    }, 1000)
}
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
    margin-bottom: 10px;
    color: #4d6177;
    font-size: 15px;
    font-weight: 500;
}

.verification-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.verification-item {
    flex: 1;
}

.send-code-button {
    width: 118px;
    height: 58px;
    margin: 0;
    border: 0;
    border-radius: 12px;
    background: linear-gradient(180deg, #21609c 0%, #0c4a85 100%);
    color: #fff;
    box-shadow: none;
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
    margin-top: 26px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #0d5b98;
    font-size: 15px;
    cursor: pointer;
}

.mode-switch-icon {
    width: 18px;
    height: 18px;
    filter: brightness(0) saturate(100%) invert(25%) sepia(60%) saturate(1028%) hue-rotate(177deg)
        brightness(88%) contrast(94%);
}

.auth-footer {
    margin-top: 12px;
    text-align: center;
    color: #8f989e;
    font-size: 15px;
}

.auth-link {
    margin-left: 8px;
    color: #0d5b98;
    cursor: pointer;
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

:deep(.el-input__prefix-inner .el-icon img) {
    width: 18px;
    height: 18px;
    opacity: 0.72;
}

@media (max-width: 640px) {
    .auth-field {
        margin-bottom: 16px;
    }

    .send-code-button {
        width: 108px;
        height: 54px;
        border-radius: 16px;
        font-size: 14px;
    }

    :deep(.el-input__wrapper) {
        min-height: 54px;
    }
}
</style>
