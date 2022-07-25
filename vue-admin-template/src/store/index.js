import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    contentVO: null,
    chapterTree: null,
    preViewObject: null
  },
  mutations: {
    update(state, data) {
      state.contentVO = data
    },
    cacheChapter(state, data) {
      state.chapterTree = data
    },
    cachePreViewObject(state, data) {
      state.preViewObject = data
    }
  },
  actions: {

  },
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
