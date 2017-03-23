import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  showLoading: false,
  isLogin: false
}

/**
 * 取值方法
 computed:{
    ...Vuex.mapGetters(['showLoading','isLogin','userName'])
  }
 */
const getters = {
  showLoading: state => state.showLoading,
  isLogin: state => state.isLogin
}

/*
 1. vue 赋值方法 this.$store.commit('showLoading' , true)[不推荐]
 2. methods(){
 ...Vuex.mapMutations(['showLoading'])
 }
 mutation 必须是同步函数
 */

const mutations = {
  isLogin(state, value) {
    state.isLogin = value
  },
  showLoading(state, value) {
    state.showLoading = value
  }
}

/*
 vue 赋值方法
 1. this.$store.dispatch('showLoading' , true)[不推荐]
 2. methods(){
 ...Vuex.mapActions(['showLoading','count']),
 }
 Action 類似於 mutation，不同在於：
 Action 提交的是 mutation，而不是直接變更狀態。
 Action 可以异步。
 Action 可以非同步，但一定只能 return Promise
 */
const actions = {
  showLoading({commit}, value) {
    commit('showLoading', value)
  },
  login({commit, state}, {email, password}) {
    /* return new Promise(resolve => {
     commit('showLoading', true)
     console.log('action login', email, password)
     setTimeout(async() => {
     let response = await axios.get('api.txt')
     let data = response.data
     if (data.status === 'ok') {
     commit('userName', data.name)
     // action 不應該直接修改 state 的值,
     // 要使用 commit 的方式呼叫 mutations 去改值
     // 以下寫法在嚴格模式會發生錯誤
     // state.isLogin = true;
     commit('isLogin', true)
     }
     resolve(data)
     commit('showLoading', false)
     }, 1000)
     }) */
  }
}

// https://vuex.vuejs.org/en/plugins.html
// Plugins
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}

export default new Vuex.Store({
  plugins: [myPlugin],
  state,
  getters,
  actions,
  mutations,
  strict: true
})

