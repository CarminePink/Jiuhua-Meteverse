<template>
    <div class="login-page">
        <img :src="bg" class="wave" />
        <img class="cloud cloud-top" src="@/assets/login/cloud.png" />
        <img class="cloud cloud-bottom-left" src="@/assets/login/cloud_2.png" />
        <div class="login-shell" v-if="!dialogVisible">
            <div class="login-box" :class="loginPanelClass">
                <button
                    v-if="showCloseButton"
                    type="button"
                    class="login-close"
                    @click="handleClosePanel"
                >
                    <img :src="closeIcon" alt="关闭" />
                </button>
                <div class="login-header" :class="{ 'is-centered': isCenteredTitle }">
                    <div class="login-title">{{ loginTitle }}</div>
                </div>
                <div class="login-form">
                    <PasswordComponent
                        v-if="loginType === LoginTypeEnum.PASSWORD"
                        @sign-in-success="signInSuccess"
                        @change="changeLoginType"
                    />
                    <Mobile
                        v-else-if="loginType === LoginTypeEnum.MOBILE"
                        @sign-in-success="signInSuccess"
                        @change="changeLoginType"
                    />
                    <Register
                        v-else-if="loginType === LoginTypeEnum.REGISTER"
                        @change="changeLoginType"
                        @after-success="() => changeLoginType(LoginTypeEnum.PASSWORD)"
                    />
                    <ResetPassword
                        v-else-if="loginType === LoginTypeEnum.RESETPASSWORD"
                        @change="changeLoginType"
                        @after-success="() => changeLoginType(LoginTypeEnum.PASSWORD)"
                    />
                    <WxLogin
                        v-else-if="loginType === LoginTypeEnum.WXLOGIN"
                        @change="changeLoginType"
                    />
                </div>
            </div>
        </div>
        <el-dialog
            v-model="dialogVisible"
            title="密码到期请更换新密码"
            width="500"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="custom-dialog"
        >
            <el-form
                :model="passwordFormData"
                :rules="passwordRuleForm"
                label-width="100px"
                class="mt20"
                ref="passwordFormdataRef"
            >
                <el-row :gutter="20">
                    <el-col :span="24" class="mb30">
                        <el-form-item label="原密码" prop="password">
                            <el-input
                                v-model="passwordFormData.password"
                                placeholder="请输入原密码"
                                clearable
                                type="password"
                                show-password
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" class="mb30">
                        <el-form-item label="新密码" prop="newpassword1">
                            <el-input
                                v-model="passwordFormData.newpassword1"
                                placeholder="请输入新密码"
                                clearable
                                type="password"
                                show-password
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" class="mb30">
                        <el-form-item label="确认新密码" prop="newpassword2">
                            <el-input
                                v-model="passwordFormData.newpassword2"
                                placeholder="请再次输入新密码"
                                clearable
                                type="password"
                                show-password
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-button type="primary" @click="handleChangePassword">确定</el-button>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="loginIndex">
import bg from '@/assets/login/bg_login.png'
import closeIcon from '@/assets/login/close.png'
import { NextLoading } from '@/utils/loading'
import { useI18n } from 'vue-i18n'
import { formatAxis } from '@/utils/formatTime'
import { useMessage } from '@/hooks/message'
import { Session } from '@/utils/storage'
import { LoginTypeEnum } from '@/api/login/index'
import { startHeartbeat } from '@/api/home'
import { password } from '@/api/login/user'
import { mergeRetainedQuery, resolveRetainedQueryFromRoute } from '@/router/query'

type ValidateCallback = (error?: Error) => void

const PasswordComponent = defineAsyncComponent(() => import('./component/password.vue'))
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'))
const Register = defineAsyncComponent(() => import('./component/register.vue'))
const ResetPassword = defineAsyncComponent(() => import('./component/resetPassword.vue'))
const WxLogin = defineAsyncComponent(() => import('./component/wxLogin.vue'))

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const dialogVisible = ref(false)
const passwordFormdataRef = ref()
const passwordFormData = reactive({
    password: '',
    newpassword1: '',
    newpassword2: ''
})

const passwordRuleForm = reactive({
    password: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
    newpassword1: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        {
            min: 8,
            max: 20,
            message: '用户密码长度须介于8和20之间',
            trigger: 'blur'
        },
        {
            validator: (_rule: unknown, value: string, callback: ValidateCallback) => {
                if (value === '') {
                    callback(new Error('新密码不能为空'))
                } else if (
                    !/^(?![0-9A-Za-z]+$)(?![0-9A-Z\W]+$)(?![0-9a-z\W]+$)(?![A-Za-z\W]+$)[0-9A-Za-z~!@#$%^&*()__+`\-={}|[\]\\:";'<>?,./]{8,20}$/.test(
                        value
                    )
                ) {
                    callback(new Error('密码须包含大小写字母、数字和特殊字符，长度介于8到20位之间'))
                } else if (value !== passwordFormData.newpassword2) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'change'
        }
    ],
    newpassword2: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
            validator: (_rule: unknown, value: string, callback: ValidateCallback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'))
                } else if (value !== passwordFormData.newpassword1) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'change'
        }
    ]
})

const loginType = ref(LoginTypeEnum.PASSWORD)

const loginTitle = computed(() => {
    switch (loginType.value) {
        case LoginTypeEnum.PASSWORD:
            return '欢迎登录'
        case LoginTypeEnum.MOBILE:
            return '手机验证码登录'
        case LoginTypeEnum.WXLOGIN:
            return '微信登录'
        case LoginTypeEnum.REGISTER:
            return '立即注册'
        case LoginTypeEnum.RESETPASSWORD:
            return '找回密码'
        default:
            return '欢迎登录'
    }
})

const loginPanelClass = computed(() => ({
    'is-password': loginType.value === LoginTypeEnum.PASSWORD,
    'is-mobile': loginType.value === LoginTypeEnum.MOBILE,
    'is-register': loginType.value === LoginTypeEnum.REGISTER,
    'is-reset': loginType.value === LoginTypeEnum.RESETPASSWORD,
    'is-wx': loginType.value === LoginTypeEnum.WXLOGIN
}))

const isCenteredTitle = computed(
    () => loginType.value === LoginTypeEnum.PASSWORD || loginType.value === LoginTypeEnum.REGISTER
)

const showCloseButton = computed(() => loginType.value !== LoginTypeEnum.PASSWORD)

const changeLoginType = (type: LoginTypeEnum) => {
    loginType.value = type
}

const handleClosePanel = () => {
    changeLoginType(LoginTypeEnum.PASSWORD)
}

const handleChangePassword = () => {
    passwordFormdataRef.value.validate((valid: boolean) => {
        if (!valid) {
            return false
        }
        password(passwordFormData)
            .then(() => {
                useMessage().success('修改成功')
                Session.clear()
                window.location.reload()
            })
            .catch((err: any) => {
                useMessage().error(err.msg)
            })
    })
}

const signInSuccess = async () => {
    if (!('nextLoading' in window)) NextLoading.start()
    if (!Session.getToken()) return false

    startHeartbeat()

    const currentTimeInfo = formatAxis(new Date())
    const redirect = route.query?.redirect as string | undefined
    const retainedQuery = resolveRetainedQueryFromRoute(route)

    if (redirect) {
        router.push({
            path: redirect,
            query: mergeRetainedQuery(retainedQuery)
        })
    } else {
        router.push({
            path: '/',
            query: mergeRetainedQuery(retainedQuery)
        })
    }

    useMessage().success(`${currentTimeInfo}，${t('signInText')}`)
}

onMounted(() => {
    NextLoading.done()
})

onBeforeRouteLeave(() => {
    if (dialogVisible.value) {
        Session.clear()
        window.location.reload()
    }
})
</script>

<style scoped lang="scss">
:deep(.custom-dialog) {
    .el-dialog__header {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        padding-top: 30px;
    }
}

:deep(.el-overlay) {
    background-color: transparent;

    .el-overlay-dialog .el-dialog {
        border-radius: 30px;

        .el-dialog__body {
            padding: 0 50px 30px 50px !important;

            .el-button {
                display: inline-block;
                width: 100%;
                height: 40px;
                border-radius: 8px;
                margin-top: 10px;
            }
        }
    }
}

.custom-dialog .el-dialog__headerbtn {
    position: absolute;
    top: 12px;
    right: 12px;
}

.login-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(180deg, #edf5f5 0%, #dce8e7 100%);

    .cloud {
        position: absolute;
        z-index: 1;
    }

    .cloud-top {
        top: 27px;
        left: 352px;
        width: 1888px;
        height: 874px;
        aspect-ratio: 445/206;
    }

    .cloud-bottom-left {
        bottom: -32px;
        right: 1123px;
        width: 1506px;
        height: 697px;
        aspect-ratio: 121/56;
    }
}

.wave {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.88;
    pointer-events: none;
}

.login-shell {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    padding: 32px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-box {
    position: relative;
    box-sizing: border-box;
    width: 448px;
    height: auto;
    padding: 42px 38px 34px;
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(246, 250, 248, 0.75);
    box-shadow: 0 32px 64px 0 rgba(5, 102, 79, 0.12);
    backdrop-filter: blur(12px);
}

.login-box > * {
    position: relative;
    z-index: 1;
}

.login-box.is-register,
.login-box.is-reset {
    padding-top: 36px;
}

.login-close {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 38px;
    height: 38px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.login-close img {
    display: block;
    width: 100%;
    height: 100%;
}

.login-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.login-header.is-centered {
    align-items: center;
    text-align: center;
}

.login-title {
    color: #0d5b98;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 1px;
}

.login-form {
    margin-top: 26px;
}

@media (max-width: 640px) {
    .login-shell {
        padding: 20px 12px;
    }

    .login-box,
    .login-box.is-register,
    .login-box.is-reset,
    .login-box.is-mobile {
        width: 100%;
        padding: 34px 22px 26px;
        border-radius: 28px;
    }

    .login-title {
        font-size: 22px;
    }

    .login-close {
        top: 14px;
        right: 14px;
        width: 34px;
        height: 34px;
    }
}
</style>
