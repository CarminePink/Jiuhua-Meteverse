<template>
    <el-form
        size="large"
        class="auth-form register-form"
        :rules="dataRules"
        ref="dataFormRef"
        :model="state.ruleForm"
    >
        <div class="auth-field">
            <div class="field-label">用户名</div>
            <el-form-item prop="nickname">
                <el-input
                    :placeholder="'请输入用户名'"
                    v-model="state.ruleForm.nickname"
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
            <div class="field-label">手机号/账号</div>
            <el-form-item prop="phone">
                <el-input
                    :placeholder="'请输入登录账号'"
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

        <div class="auth-field">
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
        <div class="auth-field">
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

        <div class="auth-field">
            <div class="field-label">密码</div>
            <el-form-item prop="password">
                <el-input
                    v-model="state.ruleForm.password"
                    type="password"
                    show-password
                    maxlength="20"
                    minlength="6"
                    placeholder="请输入您的密码"
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
            <div class="field-label">确认密码</div>
            <el-form-item prop="newpassword1">
                <el-input
                    v-model="state.ruleForm.newpassword1"
                    type="password"
                    maxlength="20"
                    minlength="6"
                    placeholder="请再次输入您的密码"
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
                @click="handleRegister"
                :loading="loading"
            >
                <span class="button-text">注册</span>
            </el-button>
        </el-form-item>

        <div class="auth-footer" @click="emit('change', LoginTypeEnum.PASSWORD)">
            <span>已有账号？</span>
            <span class="auth-link">返回登录</span>
        </div>
    </el-form>
</template>

<script setup lang="ts" name="register">
import { registerUser, validatePhone, validateUsername } from '@/api/login/user'
import { useMessage } from '@/hooks/message'
import { useI18n } from 'vue-i18n'
import { rule } from '@/utils/validate'
import { LoginTypeEnum, sendMobileCode } from '@/api/login'
import { verifyPasswordStrength } from '@/utils/toolsValidate'

type ValidateCallback = (error?: Error | string) => void

const emit = defineEmits(['afterSuccess', 'change'])
const { t } = useI18n()
const dataFormRef = ref()
const loading = ref(false)
const score = ref('0')

const state = reactive({
    ruleForm: {
        nickname: '',
        password: '',
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
    nickname: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        {
            min: 2,
            max: 15,
            message: '用户名称长度必须介于 2 和 15 之间',
            trigger: 'blur'
        },
        {
            validator: (_rule: unknown, value: string, callback: ValidateCallback) => {
                validateUsername(_rule, value, callback, false)
            },
            trigger: 'blur'
        }
    ],
    phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        {
            validator: rule.validatePhone,
            trigger: 'blur'
        },
        {
            validator: (_rule: unknown, value: string, callback: ValidateCallback) => {
                validatePhone(_rule, value, callback, false)
            },
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
    password: [
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

const handleRegister = async () => {
    const valid = await dataFormRef.value.validate().catch(() => {})
    if (!valid) return false

    try {
        loading.value = true
        if (state.ruleForm.password != state.ruleForm.newpassword1) {
            useMessage().error('两次输入的密码不一致')
            return
        }

        await registerUser(state.ruleForm)
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

    const response: any = await sendMobileCode(state.ruleForm.phone, 2)
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

.auth-footer {
    margin-top: 14px;
    text-align: center;
    color: #8f989e;
    font-size: 15px;
    cursor: pointer;
}

.auth-link {
    margin-left: 8px;
    color: #0d5b98;
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
