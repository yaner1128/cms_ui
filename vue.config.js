/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'public',
  devServer: {
    host: '0.0.0.0',
    port: 8090,
    open: true,
    proxy: {
      '/': {
        target: 'http://192.168.1.166:8201', // 我的服务器地址
        changeOrigin: true, // 接口跨域配置
        // pathRewrite方法重写url
        pathRewrite: {
          '^/ctms-auth': ''
        }
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
    } else {
      // 开发环境
    }
    Object.assign(config.resolve, {
      // 开发与生产环境共同配置别名
      alias: {
        '@': path.resolve(__dirname, './src'),
        view: '@/view',
        components: '@/components'
      },
      // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀, 引入模块时可以不带扩展
      extensions: ['.ts', '.js', '.vue', '.json']
    })
  },
  // chainWebpack: () => {},
  css: {
    sourceMap: true // 开启 CSS source maps
  }
}
