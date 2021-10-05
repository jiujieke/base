import './premission';
import './public-path';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/ant-design';
import 'ant-design-vue/dist/antd.less';
import './styles/index.less'; // 全局自定义的css样式
// import './fa-icon-registry';

Vue.config.productionTip = false

Vue.use(VueRouter)
   
let instance:any = null;
let _router: any = router

function render(props = {}) {
  const container: any = props;

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container.querySelector ? container.querySelector('#app-vue') : '#app-vue');
}
 
   // 独立运行时
   if (!(window as any).__POWERED_BY_QIANKUN__) {
     render();
   }
   
   // 导出必要的生命周期函数
   export async function bootstrap() {
     console.log('[vue] vue app bootstraped');
   }
   export async function mount(props: any) {
     console.log('[vue] props from main framework', props);
     render(props);
   }
   export async function unmount() {
     instance.$destroy();
     instance.$el.innerHTML = '';
     instance = null;
     _router = null;
   }