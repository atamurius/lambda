import Vue from 'vue'
import App from './App.vue'
import * as L from './lambda'
import * as S from './struct'

window.L = L
window.S = S

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
