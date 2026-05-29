import { createI18n } from 'vue-i18n'
import zh from './lang/zh'

const i18n = createI18n({
    legacy: false,
    locale: 'zh',
    globalInjection: true,
    messages: {
        zh
    }
})

export default i18n
