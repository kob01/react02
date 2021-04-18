import { defineConfig, utils } from 'umi';
import routes from './routes';
import { resolve } from "path";

const { winPath } = utils;

export default defineConfig({
  title: 'hi-umi你好',
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {},
  base: '/',
  //生成hash文件名
  // hash: true,
  //hash路由
  // history: {
  //   type: 'hash',
  // },
  // 为所有非三方脚本加上 crossorigin="anonymous" 属性，通常用于统计脚本错误。
  crossorigin: true,
  analytics: {
    ga: 'google analytics code', // 百度统计代码
    baidu: '5a66cxxxxxxxxxx9e13', // Google 统计代码
  },
  // disableRedirectHoist: true,//禁用 redirect 上提。
  devtool: 'source-map',//生成map文件
  //兼容浏览器版本  配置需要兼容的浏览器最低版本，会自动引入 polyfill 和做语法转换 Default: { chrome: 49, firefox: 64, safari: 10, edge: 13, ios: 10 }
  targets: {
    ie: 11,
  },
  // 使用 antd
  antd: {
    dark: false,
  },
  // 暂时关闭
  pwa: false,
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },

  // 使用过 dva 目前内置版本是 ^4.0.0
  // 内置 dva，默认版本是 ^2.6.0-beta.20，如果项目中有依赖，会优先使用项目中依赖的版本。
  // 约定是到 model 组织方式，不用手动注册 model
  // 文件名即 namespace，model 内如果没有声明 namespace，会以文件名作为 namespace
  // 内置 dva-loading，直接 connect loading 字段使用即可
  dva: {
    immer: true, // 表示是否启用 immer 以方便修改 reducer
    hmr: true, // 表示是否启用 dva model 的热更新
  },
   // 配置主题，实际上是配 less 变量
   theme: {
    '@primary-color': '#1DA57A',
  },
  // 代理配置(跨域处理) http://10.98.98.142:8080/
  proxy: {
    '/api': {
      'target': 'http://10.98.101.225:8089/goods',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
  // locale: {},
  // 别名配置
  alias: {
    "@": resolve(__dirname, "./src"),
  },
  routes,
  fastRefresh: {},
  // 是否启用按需加载，即是否把构建产物进行拆分，在需要的时候下载额外的 JS 再执行
  dynamicImport: {
    // 无需 level, webpackChunkName 引入 tsx时候看看 tsconfig.json配置了相关配置没
    // loading: '@/components/PageLoading/index',
  },
  cssLoader: {
    // 这里的 modules 可以接受 getLocalIdent
    modules: {
      getLocalIdent:(
        context: {
          resourcePath: string;
        },
        _: string,
        localName: string,
      ) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
            .map((a: string) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    }
  }
});
