import './config'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd, { version } from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less'; // or 'ant-design-vue/dist/antd.less'
import Print from 'vue-print-nb-jeecg'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import VueAreaLinkage from 'vue-area-linkage'
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(router)
Vue.use(Viser)
Vue.use(Print)
Vue.use(preview)
Vue.use(VueAreaLinkage);
import { message } from 'ant-design-vue';
Vue.prototype.$message = message
import Echarts from 'echarts'
Vue.prototype.$echarts = Echarts
import "perfect-scrollbar/css/perfect-scrollbar.css";
import formCreate from '@form-create/element-ui'
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSuperSlide from 'vue-superslide'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
Vue.use(VueVideoPlayer);
Vue.use(VueSuperSlide)
Vue.use(ELEMENT)
Vue.use(formCreate)


router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if(to.path ==='/Server'){
    next();
  }else if(to.path ==='/Trave'){
    next();
  }else if(to.path ==='/Traffic'){
    next();
  }else if(to.path ==='/Tour'){
    next();
  }else if(to.path ==='/Provice'){
    next();
  }else if(to.path ==='/Trave1'){
    next();
  }else if(to.path ==='/Traffic1'){
    next();
  }else if(to.path ==='/Provice1'){
    next();
  }else if(to.path ==='/Tour1'){
    next();
  }else if(to.path ==='/test'){
    next();
  }else {
    var userCode = store.state.userCode;
    console.log("------全局跳转判断------");
    if(userCode ===null || userCode ===''){
      console.log("未登录");
      next('/');
    }else {
      next();
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')