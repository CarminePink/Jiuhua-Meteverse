/**
 * 判断是否为空
 * @param val 数据
 */
export const validateNull = (val: any) => {
    if (typeof val === 'boolean') {
        return false
    }
    if (typeof val === 'number') {
        return false
    }
    if (val instanceof Array) {
        if (val.length === 0) return true
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === '{}') return true
    } else {
        if (val === 'null' || val == null || val === 'undefined' || val === '') return true
        return false
    }
    return false
}

type ValidationCallback = (error?: Error) => void

type ValidationRule = {
    errorMsg?: string
}

type RegExpValidationRule = ValidationRule & {
    regExp: string
}

type CoordinateValue = {
    longitude: string
    latitude: string
    altitude: string
}

const commonRegExp = {
    number: '^[-]?\\d+(\\.\\d+)?$',
    letter: '^[A-Za-z]+$',
    letterAndNumber: '^[A-Za-z0-9]+$',
    mobilePhone: '^[1][3-9][0-9]{9}$',
    letterStartNumberIncluded: '^[A-Za-z]+[A-Za-z\\d]*$',
    noChinese: '^[^\u4e00-\u9fa5]+$',
    chinese: '^[\u4e00-\u9fa5]+$',
    email: '^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$',
    url: '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
    coordinate: `^(0*(?:1[0-7]\\d(?:\\.\\d+)?|180(?:\\.0+)?|\\d{1,2}(?:\\.\\d+)?|\\d{1,2}(\\.\\d+)?)),\\s*(0*(?:[1-8]?\\d(?:\\.\\d+)?|90(?:\\.0+)?|\\d{1,2}(?:\\.\\d+)?|\\d{1,2}(\\.\\d+)?)),\\s*(-?\\d+(?:\\.\\d+)?)$`
} as const

type CommonValidatorName = keyof typeof commonRegExp

export const rule = {
    /**
     * 校验 请输入中文、英文、数字包括下划线
     * 名称校验
     */
    validatorNameCn(_rule: ValidationRule, value: string, callback: ValidationCallback) {
        const acount = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
        if (value && !acount.test(value)) {
            callback(new Error('请输入中文、英文、数字包括下划线'))
        } else {
            callback()
        }
    },
    /**
     * 校验 请输入大写英文、下划线
     * 名称校验
     */
    validatorCapital(_rule: ValidationRule, value: string, callback: ValidationCallback) {
        const acount = /^[A-Z_]+$/
        if (value && !acount.test(value)) {
            callback(new Error('请输入大写英文、下划线'))
        } else {
            callback()
        }
    },

    /**
     * 校验 请输入小写英文、下划线
     * 名称校验
     */
    validatorLowercase(_rule: ValidationRule, value: string, callback: ValidationCallback) {
        const acount = /^[a-z_]+$/
        if (value && !acount.test(value)) {
            callback(new Error('请输入小写英文、下划线'))
        } else {
            callback()
        }
    },

    /**
     * 校验 请输入小写英文
     * 名称校验
     */
    validatorLower(_rule: ValidationRule, value: string, callback: ValidationCallback) {
        const acount = /^[a-z]+$/
        if (value && !acount.test(value)) {
            callback(new Error('请输入小写英文'))
        } else {
            callback()
        }
    },

    /**
     * 校验首尾空白字符的正则表达式
     *
     */
    checkSpace(_rule: ValidationRule, value: string, callback: ValidationCallback) {
        const longrg = /[^\s]+$/
        if (!longrg.test(value)) {
            callback(new Error('请输入非空格信息'))
        } else {
            callback()
        }
    },

    /**
     * 校验手机号
     */
    validatePhone(_rule: ValidationRule, value: string, callback: ValidationCallback) {
        const isPhone = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/

        if (value.indexOf('****') >= 0) {
            return callback()
        }

        if (!isPhone.test(value)) {
            callback(new Error('请输入合法手机号'))
        } else {
            callback()
        }
    },

    validateCoordinates(
        _rule: ValidationRule,
        value: CoordinateValue,
        callback: ValidationCallback
    ) {
        const longitude = value.longitude
        const latitude = value.latitude
        const altitude = value.altitude
        const reg = new RegExp(getRegExp('coordinate'))

        if (longitude.trim() === '' || latitude.trim() === '' || altitude.trim() === '') {
            callback(new Error('请输入完整的坐标信息'))
        } else if (!reg.test(`${longitude},${latitude},${altitude}`)) {
            callback(new Error('坐标格式有误'))
        } else {
            callback()
        }
    },

    /* 数字 */
    number(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('number', rule, value, callback, '包含非数字字符')
    },

    /* 字母 */
    letter(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('letter', rule, value, callback, '包含非字母字符')
    },

    /* 字母和数字 */
    letterAndNumber(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('letterAndNumber', rule, value, callback, '只能输入字母或数字')
    },

    /* 手机号码 */
    mobilePhone(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('mobilePhone', rule, value, callback, '手机号码格式有误')
    },

    /* 字母开头，仅可包含数字 */
    letterStartNumberIncluded(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('letterStartNumberIncluded', rule, value, callback, '必须以字母开头，可包含数字')
    },

    /* 禁止中文输入 */
    noChinese(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('noChinese', rule, value, callback, '不可输入中文字符')
    },

    /* 必须中文输入 */
    chinese(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('chinese', rule, value, callback, '只能输入中文字符')
    },

    /* 电子邮箱 */
    email(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('email', rule, value, callback, '邮箱格式有误')
    },

    /* URL网址 */
    url(rule: ValidationRule, value: string, callback: ValidationCallback) {
        validateFn('url', rule, value, callback, 'URL格式有误')
    },

    regExp(rule: RegExpValidationRule, value: string, callback: ValidationCallback) {
        if (validateNull(value) || value.length <= 0) {
            callback()
            return
        }

        const pattern = new RegExp(rule.regExp)

        if (!pattern.test(value)) {
            const errTxt = rule.errorMsg || 'invalid value'
            callback(new Error(errTxt))
        } else {
            callback()
        }
    }
}

/**
 * @desc  [自定义校验规则]
 * @example
 *  import { validateRule } from "@/utils/validateRules";
 *  rules: [
 *     { validator: validateRule.emailValue, trigger: 'blur'}
 *  ]
 */
export const getRegExp = function (validatorName: CommonValidatorName) {
    return commonRegExp[validatorName]
}

const validateFn = (
    validatorName: CommonValidatorName,
    rule: ValidationRule,
    value: string,
    callback: ValidationCallback,
    defaultErrorMsg: string
) => {
    if (validateNull(value) || value.length <= 0) {
        callback()
        return
    }

    const reg = new RegExp(getRegExp(validatorName))

    if (!reg.test(value)) {
        const errTxt = rule.errorMsg || defaultErrorMsg
        callback(new Error(errTxt))
    } else {
        callback()
    }
}
