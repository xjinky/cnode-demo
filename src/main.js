import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import './plugins/vuetify'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import router from './router/index'
import filters from './filter/index'
import store from './store'
import axios from 'axios'
import colors from 'vuetify/es5/util/colors'
import infiniteScroll from 'vue-infinite-scroll'

import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  iconfont: "mdi",
  theme: {
    primary: colors.purple,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
})
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(filters)
Vue.use(infiniteScroll)

Vue.config.productionTip = false
Vue.prototype.$ajax = axios

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
