// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { httpGet, httpPost, baseUrl } from './utils/httpService'
import Vue from 'vue'
import App from './App'
import router from './router'

/* 引入element UI框架 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, {zIndex: 3000 });

/* 引入字体图标 */
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon',Icon);

/* global definitions */
Vue.config.productionTip = false
Vue.prototype.httpGet = httpGet;
Vue.prototype.httpPost = httpPost;
Vue.prototype.baseUrl = baseUrl;

/*引入vue-quill-editor*/ 
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
