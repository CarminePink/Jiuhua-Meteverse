import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueDevTools from 'vite-plugin-vue-devtools'
//大屏适配 引入postcss-pxtorem
import postCssPxToRem from 'postcss-pxtorem'

export default ({ mode }: ConfigEnv): UserConfig => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            vue(),
            VueDevTools(),
            AutoImport({
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/ // .md
                ],
                imports: ['vue', 'vue-router', 'pinia'],
                eslintrc: {
                    enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
                    filepath: './eslintrc-auto-import.json', // 生成json文件
                    globalsPropValue: true
                },
                // 声明文件生成位置和文件名称
                dts: './src/auto-import.d.ts',
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        ],
        resolve: {
            alias: {
                '@': resolve('./src')
            }
        },
        server: {
            host: '0.0.0.0',
            port: Number(env.VITE_APP_PORT),
            open: true, // 运行自动打开浏览器
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: 'http://10.100.201.112:9999', // 邵成威
                    changeOrigin: true,
                    rewrite: path => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
                }
            }
        },
        css: {
            postcss: {
                plugins: [
                    postCssPxToRem({
                        rootValue: 192, // 设计稿宽度的1/10
                        propList: ['*'], // 所有属性转换
                        selectorBlackList: [
                            'norem',
                            /^vue$/,
                            'vue-devtools__anchor--glowing',
                            'vue-devtools__panel',
                            'vue-devtools__anchor-btn',
                            'vue-inspector-floats',
                            'vue-inspector-card'
                        ], // 不进行rem转换
                        exclude: '/src/views/demo|node_modules'
                    })
                ]
            }
        },
        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            }
        }
    }
}
