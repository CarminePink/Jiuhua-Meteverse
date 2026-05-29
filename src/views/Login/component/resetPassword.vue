<template>
    <el-form
        size="large"
        class="auth-form reset-password-form"
        :rules="dataRules"
        ref="dataFormRef"
        :model="state.ruleForm"
    >
        <div class="auth-field">
            <div class="field-label">手机号</div>
            <el-form-item prop="phone">
                <el-input
                    :placeholder="'请输入绑定的手机号码'"
                    v-model="state.ruleForm.phone"
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

        <div class="auth-field code-field">
            <div class="field-label">验证码</div>
            <div class="verification-row">
                <el-form-item prop="verificationCode" class="verification-item">
                    <el-input
                        maxlength="6"
                        :placeholder="'请输入验证码'"
                        v-model="state.ruleForm.verificationCode"
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

        <!--
        <div class="auth-field code-field">
            <div class="field-label">身份证后六位</div>
            <el-form-item prop="securityAnswer">
                <el-input
                    maxlength="6"
                    :placeholder="'请输入身份证后六位'"
                    v-model="state.ruleForm.securityAnswer"
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
        </div>
        -->

        <div class="divider"></div>

        <div class="auth-field">
            <div class="field-label">新密码</div>
            <el-form-item prop="newPassword">
                <el-input
                    v-model="state.ruleForm.newPassword"
                    type="password"
                    show-password
                    maxlength="20"
                    minlength="6"
                    placeholder="设置新密码"
                    autocomplete="off"
                    @input="handlePassScore"
                >
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <img src="@/assets/login/lockIcon.png" />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </div>

        <div class="auth-field">
            <div class="field-label">确认新密码</div>
            <el-form-item prop="newpassword1">
                <el-input
                    v-model="state.ruleForm.newpassword1"
                    type="password"
                    maxlength="20"
                    minlength="6"
                    placeholder="再次输入新密码"
                    autocomplete="off"
                >
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <img src="@/assets/login/repeatIcon.png" />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </div>

        <el-form-item class="submit-item">
            <el-button
                type="primary"
                class="login-content-submit"
                v-waves
                @click="handleResetPassword"
                :loading="loading"
            >
                <span class="button-text">确认修改</span>
            </el-button>
        </el-form-item>

        <button type="button" class="mode-switch" @click="emit('change', LoginTypeEnum.PASSWORD)">
            <img src="@/assets/login/rebackIcon.png" class="mode-switch-icon" />
            <span>返回登录</span>
        </button>
    </el-form>
</template>

<script setup lang="ts" name="resetPassword">
import { useMessage } from '@/hooks/message'
import { useI18n } from 'vue-i18n'
import { rule } from '@/utils/validate'
import { LoginTypeEnum, resetPassword, sendMobileCode } from '@/api/login'
import { verifyPasswordStrength } from '@/utils/toolsValidate'

type ValidateCallback = (error?: Error | string) => void

const emit = defineEmits(['afterSuccess', 'change'])
const { t } = useI18n()
const dataFormRef = ref()
const loading = ref(false)
const score = ref('0')

const state = reactive({
    ruleForm: {
        newPassword: '',
        newpassword1: '',
        phone: '',
        verificationCode: ''
    }
})

// const validateIdCardLastSix = (_rule: unknown, value: string, callback: ValidateCallback) => {
//     if (!value) {
//         callback(new Error('请输入身份证后六位'))
//         return
//     }
//
//     if (!/^\d{6}$/.test(value)) {
//         callback(new Error('身份证后六位应为6位数字'))
//         return
//     }
//
//     callback()
// }

const dataRules = reactive({
    phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        {
            validator: rule.validatePhone,
            trigger: 'blur'
        }
    ],
    verificationCode: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入验证码'
        }
    ],
    // securityAnswer: [
    //     {
    //         required: true,
    //         trigger: 'blur',
    //         validator: validateIdCardLastSix
    //     }
    // ],
    newPassword: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        {
            min: 6,
            max: 20,
            message: '用户密码长度必须介于 6 和 20 之间',
            trigger: 'blur'
        },
        {
            validator: (_rule: unknown, _value: string, callback: ValidateCallback) => {
                if (Number(score.value) < 2) {
                    callback('密码强度太低')
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    newpassword1: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        {
            min: 6,
            max: 20,
            message: '用户密码长度必须介于 6 和 20 之间',
            trigger: 'blur'
        },
        {
            validator: (_rule: unknown, _value: string, callback: ValidateCallback) => {
                if (Number(score.value) < 2) {
                    callback('密码强度太低')
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
})

const handlePassScore = (value: string) => {
    score.value = verifyPasswordStrength(value)
}

const handleResetPassword = async () => {
    const valid = await dataFormRef.value.validate().catch(() => {})
    if (!valid) return false

    try {
        loading.value = true

        if (state.ruleForm.newPassword != state.ruleForm.newpassword1) {
            useMessage().error('两次输入的密码不一致')
            return
        }

        await resetPassword({
            username: state.ruleForm.phone,
            newPassword: state.ruleForm.newPassword,
            verificationCode: state.ruleForm.verificationCode
        })
        useMessage().success(t('common.optSuccessText'))
        emit('afterSuccess')
    } catch (err: any) {
        useMessage().error(err.msg)
    } finally {
        loading.value = false
    }
}

const msg = reactive({
    msgText: '获取验证码',
    msgTime: 60,
    msgKey: false
})

const handleSendCode = async () => {
    const valid = await dataFormRef.value.validateField('phone').catch(() => {})
    if (!valid) return

    const response: any = await sendMobileCode(state.ruleForm.phone, 3)
    if (response.data) {
        useMessage().success('验证码发送成功')
        timeCacl()
    } else {
        useMessage().error(response.msg || '验证码发送失败')
    }
}

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

<style lang="scss" scoped>
.auth-form {
    display: flex;
    flex-direction: column;
}

.auth-field {
    margin-bottom: 18px;
}

.field-label {
    display: block;
    margin-bottom: 10px;
    color: #4d6177;
    font-size: 15px;
    font-weight: 500;
}

.code-field {
    margin-bottom: 10px;
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

.divider {
    height: 1px;
    margin: 4px 0 18px;
    background: rgba(16, 45, 73, 0.16);
}

.submit-item {
    margin-top: 16px;
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
    margin-top: 22px;
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
