import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// 인증
import auth from './modules/auth'
import authAdmin from './modules/authAdmin.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    authAdmin
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})
