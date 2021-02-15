import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import './assets/css/global.scss'
import './assets/font/iconfont.css'
import SocketService from './utils/socket_service';
//websocket连接服务端
SocketService.Instance.connect()
//将websocket的类实例挂载到vue原型上
Vue.prototype.$socket = SocketService.Instance

/*将echarts全局对象挂载到vue原型上*/
Vue.prototype.$echarts = window.echarts

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
