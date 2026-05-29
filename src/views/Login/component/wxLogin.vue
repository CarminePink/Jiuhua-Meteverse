<template>
    <el-form
        size="large"
        class="login-content-form"
        :rules="dataRules"
        ref="dataFormRef"
        :model="state.ruleForm"
    >
        <div class="wx-login-title login-animation1">
            <img src="@/assets/login/wxIcon.png" />
            <span class="login-title-desc">使用微信扫一扫登录</span>
        </div>

        <div class="login-animation1">
            <img class="wxCode-box" src="@/assets/login/wxCode.png" />
        </div>
        <el-form-item class="login-animation4">
            <el-button
                type="primary"
                class="login-content-submit rounded-lg"
                v-waves
                @click="emit('change', LoginTypeEnum.PASSWORD)"
                :loading="loading"
            >
                <img src="@/assets/login/rebackIcon.png" />
                <span class="tracking-wide font-semibold font20">{{
                    $t('password.reBackBtnText')
                }}</span>
            </el-button>
        </el-form-item>

        <!-- <div class="relative flex items-center justify-between">
      <div class="text-sm ml-auto">
        <a
          href="#"
          class="text-primary hover:text-blue-600"
          @click="emit('change', LoginTypeEnum.PASSWORD)"
        >
          返回登录
        </a>
      </div>
    </div> -->
    </el-form>
</template>

<script setup lang="ts" name="register">
import { registerUser, validatePhone, validateUsername } from '@/api/login/user'
import { sendMobileCode } from '@/api/login'
import { useMessage } from '@/hooks/message'
import { useI18n } from 'vue-i18n'
import { rule } from '@/utils/validate'
import { LoginTypeEnum } from '@/api/login'

// 注册生命周期事件
const emit = defineEmits(['afterSuccess', 'change'])

// 按需加载组件
const StrengthMeter = defineAsyncComponent(() => import('@/components/StrengthMeter/index.vue'))

// 使用i18n
const { t } = useI18n()

// 表单引用
const dataFormRef = ref()

// 加载中状态
const loading = ref(false)

// 密码强度得分
const score = ref('0')

// 定义响应式对象
const msg = reactive({
    msgText: t('mobile.codeText'),
    msgTime: 60,
    msgKey: false
})

// 组件内部状态
const state = reactive({
    // 是否显示密码
    isShowPassword: false,
    // 表单内容
    ruleForm: {
        username: '', // 用户名
        password: '', // 密码
        newpassword1: '',
        phone: '', // 手机号
        checked: '', // 是否同意条款
        code: ''
    }
})

// 表单验证规则
const dataRules = reactive({
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        {
            min: 5,
            max: 20,
            message: '用户名称长度必须介于 5 和 20 之间',
            trigger: 'blur'
        },
        // 自定义方法验证用户名
        {
            validator: (rule, value, callback) => {
                validateUsername(rule, value, callback, false)
            },
            trigger: 'blur'
        }
    ],
    phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        // 手机号格式验证方法
        {
            validator: rule.validatePhone,
            trigger: 'blur'
        },
        // 自定义方法验证手机号是否重复
        {
            validator: (rule, value, callback) => {
                validatePhone(rule, value, callback, false)
            },
            trigger: 'blur'
        }
    ],
    code: [
        {
            required: true,
            trigger: 'blur',
            message: t('mobile.codeText')
        }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        {
            min: 6,
            max: 20,
            message: '用户密码长度必须介于 6 和 20 之间',
            trigger: 'blur'
        },
        // 判断密码强度是否达到要求
        {
            validator: (_rule, _value, callback) => {
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
        // 判断密码强度是否达到要求
        {
            validator: (_rule, _value, callback) => {
                if (Number(score.value) < 2) {
                    callback('密码强度太低')
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    checked: [{ required: true, message: '请阅读并同意条款', trigger: 'blur' }]
})

// 处理密码强度得分变化事件
const handlePassScore = e => {
    score.value = e
}

/**
 * @name handleRegister
 * @description 注册事件，包括表单验证、注册、成功后的钩子函数触发
 */
const handleRegister = async () => {
    // 验证表单是否符合规则
    const valid = await dataFormRef.value.validate().catch(() => {})
    if (!valid) return false

    try {
        // 开始加载
        loading.value = true
        if (state.ruleForm.password != state.ruleForm.newpassword1) {
            useMessage().error('两次输入的密码不一致')
            return
        }

        // 调用注册API
        await registerUser(state.ruleForm)
        // 注册成功提示
        useMessage().success(t('common.optSuccessText'))
        // 触发注册成功后的钩子函数
        emit('afterSuccess')
    } catch (err: any) {
        // 提示错误信息
        useMessage().error(err.msg)
    } finally {
        // 结束加载状态
        loading.value = false
    }
}

/**
 * 处理发送验证码事件。
 */
const handleSendCode = async () => {
    const valid = await dataFormRef.value.validateField('phone').catch(() => {})
    if (!valid) return
    const response = await sendMobileCode(state.ruleForm.phone, 2)
    if (response.data) {
        useMessage().success('验证码发送成功')
        timeCacl()
    } else {
        useMessage().error(response.msg)
    }
}

/**
 * 计算并更新倒计时。
 */
const timeCacl = () => {
    msg.msgText = `${msg.msgTime}秒后重发`
    msg.msgKey = true
    const time = setInterval(() => {
        msg.msgTime--
        msg.msgText = `${msg.msgTime}秒后重发`
        if (msg.msgTime === 0) {
            msg.msgTime = 60
            msg.msgText = t('mobile.codeText')
            msg.msgKey = false
            clearInterval(time)
        }
    }, 1000)
}
</script>

<style lang="scss" scoped>
.login-content-form {
    margin-top: 0;

    .wx-login-title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40px;
        > img {
            width: 40px;
            height: 40px;
            margin-right: 12px;
        }
        .login-title-desc {
            color: #000000d9;
            font-family: 'Source Han Sans CN';
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
        }
    }

    .wxCode-box {
        width: 200px;
        height: 200px;
        margin-bottom: 46px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }

    .el-form-item {
        .el-form-item__content {
            .el-button {
                > span {
                    > img {
                        width: 20px;
                        height: 18px;
                        margin-right: 12px;
                    }
                }
            }
        }
    }
}
</style>
