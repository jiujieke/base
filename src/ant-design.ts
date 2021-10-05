import Vue from 'vue';
import Antd from 'ant-design-vue';
import { Modal, message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
// import '@/styles/variables.less';
import '@/styles/ant-design-common.less';

Vue.use(Antd);

Vue.prototype.$successAntD = Modal.success;
Vue.prototype.$warningAntD = Modal.warning;
Vue.prototype.$confirmAntD = Modal.confirm;
Vue.prototype.$messageAntD = message;
