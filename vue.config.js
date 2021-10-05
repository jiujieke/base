const path = require('path')
const { name } = require('./package.json')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const serverPort = process.env.VUE_APP_PORT || 8080
const cdn = {
    js: [
        'https://cdn.jsdelivr.net/npm/vue@2.6.11',
        'https://unpkg.com/vue-router@3.5.2/dist/vue-router.js',
        'https://unpkg.com/axios/dist/axios.min.js',
    ],
}

const publicPath = isProduction ? 'https://qiankun.umijs.org/' : `http://localhost:${serverPort}`

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    publicPath,
    // 运行运行是编译
    runtimeCompiler: true,
    // 样式相关
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    // 注入样式变量
                    modifyVars: {
                        'primary-color': '#1D5EFF', // 全局主色
                        'link-color': '#1D5EFF', // 链接色
                        'success-color': '#A3E668', // 成功色
                        'warning-color': '#FF8441', // 警告色
                        'error-color': '#F56C6C', // 错误色
                        'font-size-base': '14px', // 主字号
                        'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
                        'text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
                        'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
                        'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
                        'border-radius-base': '2px', // 组件/浮层圆角
                        'border-color-base': 'rgba(42,46,50,0.10)', // 边框色
                        'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
                        'cotent-background-color': '#FFFFFF',
                        'body-background-color': '#F8F8F8',
                        'sidebar-background-color': '#F8FBFE', // 侧边栏背景色
                        'sidebar-selected-background-color': '#e0effe', // 侧边栏选中背景色
                        'headerbar-background-color': '#FFFFFF', // 头部栏背景色
                        'mini-font-size': '12px',
                        'primary-font-size': '14px',
                        'middle-font-size': '16px',
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
    chainWebpack: config => {
        /** 配置大于 4096kb 的图片的引用路径 */
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif)(\?.*)?$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 4096, // 小于4kb将会被打包成 base64
                fallback: {
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[hash:8].[ext]',
                        publicPath,
                    },
                },
            })

        // 引入 SVG
        config.module.rules.delete('svg') // 重点:删除默认配置中处理svg,
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/svg')) // 处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })

        config.when(isProduction, config => {
            // 生产环境才使用 CDN 引入
            config.plugin('html').tap(args => {
                args[0].cdn = cdn
                args[0].id = `<div id="${name}"></div>`
                return args
            })
            config.externals({
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
            })
        })
        // 优化lodash
        config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin())

        // 设置页面标题
        config.plugin('html').tap(args => {
            args[0].title = '坐席助手'
            return args
        })

        // 优化 AntDesign 的 icon（按需引入）
        // config.resolve.alias.set('@ant-design/icons/lib/dist$', path.resolve(__dirname, './src/utils/icons.ts'))

        // 打包成 umd
        config.output
            .library(`${name}`)
            .libraryTarget('umd')
            .jsonpFunction(`webpackJsonp_${name}`)

        // 配置跨域
        config.devServer.port(`${serverPort}`).headers({
            'Access-Control-Allow-Origin': '*',
        })
        config.devServer.proxy({
            '/aiadver-microservice-user': {
                target: process.env.VUE_APP_PROXY_DOMAIN || '',
                changeOrigin: true,
            },
            '/passport': {
                target: process.env.VUE_APP_PROXY_DOMAIN || '',
                changeOrigin: true,
            },
        })
    },
}
