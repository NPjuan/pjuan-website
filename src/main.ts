import { createApp } from 'vue'
import { createPinia } from 'pinia'

import webSDKCore from '@tencent/ti18n-websdkcore';
import ti18nVue3SDK from '@tencent/ti18n-vue3-sdk';

webSDKCore.init({
      appid: '60293', // 项目id，用于访问CDN线上配置的标识符，可在项目处获得
      ns: ['627'], // 命名空间，模块id，可在模块管理处获得
      defaultNS: ['627'], // 默认命名空间
      fallbackLng: ['en'], // 后加载语言
      lng: 'zh-Hans', // 当前语言
      preload: ['zh-Hans', 'en'], // 预加载的语言
      load: 'currentOnly',
      // partialBundledLanguages: true, // 部分从sdk传入，部分从connector获取
      debug: true, // 开启调试
      resources: {
          en: {
            "627": {
              '你好': 'hello'
            }
          },
          'zh-Hans': {
            "627": {
              '你好': '你好'
            }
          }
        
      },
      backend: {
        sVersion: '487', // 版本ID,可以通过平台侧"词库"->"版本管理"获得
        sCdnPrefix: 'https://i18n.cdn.pjuan.com.cn', // CDN域名地址, 如果直接使用COS, 未使用CDN情况下, 可以填写cos域名地址
      },
      initImmediate: true,
});

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ti18nVue3SDK, { ti18n : webSDKCore })

app.mount('#app')
